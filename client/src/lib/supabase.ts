import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Lead {
  id?: string;
  created_at?: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  role: string | null;
  bottleneck: string | null;
  revenue: string | null;
  team_size: string | null;
  segment: string | null;
  urgency: string | null;
  has_partner: string | null;
  social_media: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  referrer: string | null;
  first_page: string | null;
  current_page: string | null;
  device: string | null;
}
