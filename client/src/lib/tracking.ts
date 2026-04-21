const CLICK_ID_KEYS = [
  "utm_id",
  "gclid",
  "fbclid",
  "ad_id",
  "adset_id",
  "campaign_id",
] as const;

type ClickIdKey = (typeof CLICK_ID_KEYS)[number];

const SESSION_PREFIX = "attr_";
const FBC_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 90; // 90 days, Meta's recommended window

function readSessionItem(key: string): string | null {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeSessionItem(key: string, value: string) {
  try {
    sessionStorage.setItem(key, value);
  } catch {
    // sessionStorage may be unavailable (private mode, etc) — ignore
  }
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp("(?:^|;\\s*)" + name.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\$&") + "=([^;]*)"),
  );
  return match ? decodeURIComponent(match[1]) : null;
}

function setCookie(name: string, value: string, maxAgeSeconds: number) {
  if (typeof document === "undefined") return;
  const parts = [
    `${name}=${encodeURIComponent(value)}`,
    "path=/",
    `max-age=${maxAgeSeconds}`,
    "SameSite=Lax",
  ];
  if (typeof location !== "undefined" && location.protocol === "https:") {
    parts.push("Secure");
  }
  document.cookie = parts.join("; ");
}

/**
 * Reads click-id query params from the current URL and persists them in
 * sessionStorage so they survive intra-site navigation during this session.
 * Also synthesizes the _fbc cookie from fbclid when missing (Meta CAPI requirement).
 */
export function captureAttributionParams() {
  if (typeof window === "undefined") return;

  let fbclidFromUrl: string | null = null;
  try {
    const params = new URLSearchParams(window.location.search);
    for (const key of CLICK_ID_KEYS) {
      const value = params.get(key);
      if (value) {
        writeSessionItem(SESSION_PREFIX + key, value);
        if (key === "fbclid") fbclidFromUrl = value;
      }
    }
  } catch {
    // URL parsing failed — nothing to do
  }

  // If we have an fbclid but no _fbc cookie, synthesize one so the Conversions
  // API can still attribute the click on subsequent visits.
  if (fbclidFromUrl && !getCookie("_fbc")) {
    const synthesized = `fb.1.${Date.now()}.${fbclidFromUrl}`;
    setCookie("_fbc", synthesized, FBC_COOKIE_MAX_AGE_SECONDS);
  }
}

function getStoredClickId(key: ClickIdKey): string | null {
  const fromSession = readSessionItem(SESSION_PREFIX + key);
  if (fromSession) return fromSession;
  if (typeof window === "undefined") return null;
  try {
    const value = new URLSearchParams(window.location.search).get(key);
    return value || null;
  } catch {
    return null;
  }
}

export function getClickIds(): Record<ClickIdKey, string | null> {
  const out = {} as Record<ClickIdKey, string | null>;
  for (const key of CLICK_ID_KEYS) {
    out[key] = getStoredClickId(key);
  }
  return out;
}

export function getFbp(): string | null {
  return getCookie("_fbp");
}

export function getFbc(): string | null {
  return getCookie("_fbc");
}

export function generateEventId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  // RFC 4122 v4 fallback
  const bytes = new Uint8Array(16);
  if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < 16; i++) bytes[i] = Math.floor(Math.random() * 256);
  }
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export function getEventTime(): number {
  return Math.floor(Date.now() / 1000);
}

export async function sha256Hex(input: string): Promise<string | null> {
  if (typeof crypto === "undefined" || !crypto.subtle) return null;
  try {
    const bytes = new TextEncoder().encode(input);
    const hashBuffer = await crypto.subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  } catch {
    return null;
  }
}

export async function hashEmail(email: string): Promise<string | null> {
  const normalized = (email || "").trim().toLowerCase();
  if (!normalized) return null;
  return sha256Hex(normalized);
}

export function getUserAgent(): string | null {
  if (typeof navigator === "undefined") return null;
  return navigator.userAgent || null;
}

/**
 * Builds the Meta/CAPI enrichment object to merge into the webhook payload.
 * Keys are omitted (not sent as empty string) when the value is null/undefined
 * so the backend can rely on presence to mean "we have this signal".
 */
export async function buildTrackingEnrichment(opts: {
  email?: string | null;
  eventId: string;
}): Promise<Record<string, string | number>> {
  const enrichment: Record<string, string | number> = {
    event_id: opts.eventId,
    event_time: getEventTime(),
  };

  const clickIds = getClickIds();
  for (const [key, value] of Object.entries(clickIds)) {
    if (value) enrichment[key] = value;
  }

  const fbp = getFbp();
  if (fbp) enrichment.fbp = fbp;
  const fbc = getFbc();
  if (fbc) enrichment.fbc = fbc;

  const userAgent = getUserAgent();
  if (userAgent) enrichment.user_agent = userAgent;

  if (opts.email) {
    const hashed = await hashEmail(opts.email);
    if (hashed) enrichment.external_id = hashed;
  }

  return enrichment;
}
