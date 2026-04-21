import { useEffect, useMemo, useState } from "react";
import { captureAttributionParams } from "@/lib/tracking";

type AttributionData = Record<string, string>;

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;

const EXTRA_KEYS = ["referrer", "first_page", "current_page", "device", "timestamp"] as const;

export const ATTR_KEYS = [...UTM_KEYS, ...EXTRA_KEYS] as const;

function getDeviceType() {
  const ua = navigator.userAgent.toLowerCase();
  if (/mobile|android|iphone|ipad|ipod/.test(ua)) return "mobile";
  return "desktop";
}

function nowISO() {
  return new Date().toISOString();
}

function getUTMsFromURL(url: string) {
  const u = new URL(url);
  const params = u.searchParams;
  const out: AttributionData = {};
  UTM_KEYS.forEach((k) => {
    const v = params.get(k);
    if (v) out[k] = v;
  });
  return out;
}

function loadFromStorage(): AttributionData {
  const out: AttributionData = {};
  ATTR_KEYS.forEach((k) => {
    const v = localStorage.getItem(k);
    if (v) out[k] = v;
  });
  return out;
}

function saveToStorage(data: AttributionData) {
  Object.entries(data).forEach(([k, v]) => {
    if (!v) return;

    const isFirstTouch =
      k === "first_page" ||
      k === "referrer" ||
      k.startsWith("utm_");

    const alwaysUpdate = k === "current_page" || k === "timestamp";

    if (alwaysUpdate) {
      localStorage.setItem(k, v);
      return;
    }

    if (isFirstTouch) {
      if (!localStorage.getItem(k)) localStorage.setItem(k, v);
      return;
    }

    if (!localStorage.getItem(k)) localStorage.setItem(k, v);
  });
}

export function useAttribution(currentUrl?: string) {
  const initialUrl = useMemo(() => currentUrl ?? window.location.href, [currentUrl]);
  const [data, setData] = useState<AttributionData>(() => loadFromStorage());

  useEffect(() => {
    const url = currentUrl ?? window.location.href;

    captureAttributionParams();

    const utms = getUTMsFromURL(url);

    const payload: AttributionData = {
      ...utms,
      referrer: localStorage.getItem("referrer") ? "" : (document.referrer || "direct"),
      first_page: localStorage.getItem("first_page") ? "" : window.location.href,
      current_page: url,
      device: getDeviceType(),
      timestamp: nowISO(),
    };

    saveToStorage(payload);
    setData(loadFromStorage());
  }, [currentUrl, initialUrl]);

  return data;
}
