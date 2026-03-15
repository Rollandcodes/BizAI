import { createClient } from "@supabase/supabase-js";

const supabaseUrl      = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const hasValidConfig   = /^https?:\/\//.test(supabaseUrl) && supabaseAnonKey.length > 10;

const PLACEHOLDER_URL  = "https://placeholder.supabase.co";
const PLACEHOLDER_KEY  = "placeholder-key";

export function assertSupabaseConfig() {
  if (!hasValidConfig) {
    throw new Error("Missing Supabase config: check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }
}

/** Client-side singleton — uses anon key, respects RLS */
export const supabase = createClient(
  hasValidConfig ? supabaseUrl : PLACEHOLDER_URL,
  hasValidConfig ? supabaseAnonKey : PLACEHOLDER_KEY
);

/** Server-side admin client — bypasses RLS (API routes only) */
export function createServerClient() {
  return createClient(
    hasValidConfig ? supabaseUrl : PLACEHOLDER_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? (hasValidConfig ? supabaseAnonKey : PLACEHOLDER_KEY),
    { auth: { persistSession: false } }
  );
}

// ─── Shared types ──────────────────────────────────────────────────────────────
export type BusinessPlan = "trial" | "basic" | "starter" | "pro" | "business";

export interface Business {
  id:                        string;
  owner_email:               string;
  business_name:             string;
  business_type?:            string | null;
  owner_name?:               string | null;
  whatsapp?:                 string | null;
  whatsapp_phone_number_id?: string | null;
  website?:                  string | null;
  widget_color?:             string | null;
  widget_position?:          "bottom-right" | "bottom-left" | null;
  welcome_message?:          string | null;
  business_hours?:           Record<string, { open: string; close: string; closed: boolean }> | null;
  languages?:                string[] | null;
  pricing_info?:             string | null;
  common_questions_text?:    string | null;
  additional_info?:          string | null;
  custom_faqs?:              Array<{ question: string; answer: string }> | null;
  onboarding_complete?:      boolean | null;
  plan:                      BusinessPlan;
  plan_expires_at?:          string | null;
  paypal_order_id?:          string | null;
  paypal_subscription_id?:   string | null;
  message_count_month?:      number | null;
  system_prompt?:            string | null;
  referral_code?:            string | null;
  created_at:                string;
}

export interface Conversation {
  id:              string;
  business_id:     string;
  session_id:      string;
  messages:        Array<{ role: "user" | "assistant"; content: string }>;
  lead_captured?:  boolean | null;
  lead_contacted?: boolean | null;
  customer_name?:  string | null;
  customer_phone?: string | null;
  customer_email?: string | null;
  contact_status?: string | null;
  contact_notes?:  string | null;
  channel?:        string | null;
  customer_rating?: number | null;
  ai_safety_score?: number | null;
  flagged?:        boolean | null;
  flag_reason?:    string | null;
  audit_reviewed?: boolean | null;
  created_at:      string;
}

export interface BookingRecord {
  id:             string;
  business_id:    string;
  session_id:     string;
  customer_name:  string;
  customer_phone: string;
  pickup_date:    string;
  return_date:    string;
  car_type:       string;
  total_days:     number;
  status:         "pending" | "confirmed" | "declined";
  service_type?:  string | null;
  booking_date?:  string | null;
  booking_time?:  string | null;
  created_at:     string;
}
