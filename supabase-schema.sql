-- PostgreSQL / Supabase Schema
-- Run this in Supabase SQL Editor, NOT in VS Code
-- ============================================================================
-- BizAI Supabase Schema
-- ============================================================================
-- Paste this SQL into the Supabase dashboard SQL editor to create the tables
-- Go to: https://supabase.com/dashboard -> Your Project -> SQL Editor
-- Create a new query and paste this entire script, then run it
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- Table: businesses
-- ============================================================================
-- Stores business accounts with subscription info
CREATE TABLE IF NOT EXISTS public.businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_email TEXT NOT NULL,
  business_name TEXT NOT NULL,
  business_type TEXT,
  owner_name TEXT,
  whatsapp TEXT,
  website TEXT,
  system_prompt TEXT,
  widget_color TEXT DEFAULT '#2563eb',
  plan TEXT DEFAULT 'trial' CHECK (plan IN ('trial', 'basic', 'pro', 'business')),
  plan_expires_at TIMESTAMPTZ,
  paypal_subscription_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT valid_email CHECK (owner_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$')
);

-- Migration: add columns introduced in v2 signup flow (safe to run multiple times)
ALTER TABLE public.businesses ADD COLUMN IF NOT EXISTS paypal_order_id TEXT;
ALTER TABLE public.businesses ADD COLUMN IF NOT EXISTS owner_name TEXT;
ALTER TABLE public.businesses ADD COLUMN IF NOT EXISTS whatsapp TEXT;
ALTER TABLE public.businesses ADD COLUMN IF NOT EXISTS website TEXT;
ALTER TABLE public.businesses ADD COLUMN IF NOT EXISTS business_hours JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.businesses ADD COLUMN IF NOT EXISTS languages JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.businesses ADD COLUMN IF NOT EXISTS custom_faqs JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.businesses ADD COLUMN IF NOT EXISTS widget_position TEXT DEFAULT 'bottom-right';
ALTER TABLE public.businesses ADD COLUMN IF NOT EXISTS welcome_message TEXT DEFAULT 'Hi! 👋 How can I help you today?';
ALTER TABLE public.businesses ADD COLUMN IF NOT EXISTS pricing_info TEXT;
ALTER TABLE public.businesses ADD COLUMN IF NOT EXISTS common_questions_text TEXT;
ALTER TABLE public.businesses ADD COLUMN IF NOT EXISTS additional_info TEXT;
ALTER TABLE public.businesses ADD COLUMN IF NOT EXISTS onboarding_complete BOOLEAN DEFAULT false;
ALTER TABLE public.businesses ADD COLUMN IF NOT EXISTS referral_code TEXT;
ALTER TABLE public.businesses ADD COLUMN IF NOT EXISTS affiliate_commission_credited BOOLEAN DEFAULT false;
ALTER TABLE public.businesses ADD COLUMN IF NOT EXISTS whatsapp_phone_number_id TEXT;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_businesses_owner_email ON public.businesses(owner_email);
CREATE INDEX IF NOT EXISTS idx_businesses_created_at ON public.businesses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_businesses_referral_code ON public.businesses(referral_code);
CREATE INDEX IF NOT EXISTS idx_businesses_paypal_order_id ON public.businesses(paypal_order_id);
CREATE INDEX IF NOT EXISTS idx_businesses_paypal_subscription_id ON public.businesses(paypal_subscription_id);
CREATE INDEX IF NOT EXISTS idx_businesses_whatsapp_phone_number_id ON public.businesses(whatsapp_phone_number_id);

-- --------------------------------------------------------------------------
-- Login + payment reliability hardening for owner_email
-- --------------------------------------------------------------------------
-- 1) Normalize any existing owner_email values so lookups are consistent.
UPDATE public.businesses
SET owner_email = lower(trim(owner_email))
WHERE owner_email IS NOT NULL
  AND owner_email <> lower(trim(owner_email));

-- 2) Abort if duplicates exist (required before creating unique index).
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM public.businesses
    GROUP BY owner_email
    HAVING COUNT(*) > 1
  ) THEN
    RAISE EXCEPTION 'Duplicate owner_email values detected in public.businesses. Deduplicate rows, then re-run this script.';
  END IF;
END $$;

-- 3) Enforce uniqueness so UPSERT ... ON CONFLICT(owner_email) always works.
CREATE UNIQUE INDEX IF NOT EXISTS uq_businesses_owner_email
  ON public.businesses(owner_email);

-- 4) Keep owner_email normalized on all future inserts/updates.
CREATE OR REPLACE FUNCTION public.normalize_business_owner_email()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.owner_email := lower(trim(NEW.owner_email));
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_normalize_business_owner_email ON public.businesses;
CREATE TRIGGER trg_normalize_business_owner_email
BEFORE INSERT OR UPDATE ON public.businesses
FOR EACH ROW
EXECUTE FUNCTION public.normalize_business_owner_email();

-- ============================================================================
-- Table: affiliates
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.affiliates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  referral_code TEXT NOT NULL UNIQUE,
  total_referrals INTEGER NOT NULL DEFAULT 0,
  total_earnings NUMERIC(10,2) NOT NULL DEFAULT 0,
  payout_requested BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT affiliates_referral_code_len CHECK (char_length(referral_code) = 8),
  CONSTRAINT affiliates_email_valid CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$')
);

CREATE INDEX IF NOT EXISTS idx_affiliates_email ON public.affiliates(email);
CREATE INDEX IF NOT EXISTS idx_affiliates_referral_code ON public.affiliates(referral_code);

-- ============================================================================
-- Table: webhook_endpoints (iPaaS outbound integrations)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.webhook_endpoints (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  tenant_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('lead.created', 'booking.confirmed', 'booking.paid', 'review.requested')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE public.webhook_endpoints ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Tenants see own webhooks" ON public.webhook_endpoints;
CREATE POLICY "Tenants see own webhooks" ON public.webhook_endpoints
  USING (tenant_id = auth.uid());

-- ============================================================================
-- Table: paypal_webhook_events (idempotency + audit)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.paypal_webhook_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id TEXT NOT NULL UNIQUE,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  processed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_paypal_webhook_events_processed_at
  ON public.paypal_webhook_events(processed_at DESC);

-- ============================================================================
-- Table: marketing_automation_queue
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.marketing_automation_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL CHECK (event_type IN ('abandoned_signup', 'abandoned_payment')),
  dedupe_key TEXT UNIQUE,
  recipient_email TEXT,
  plan_id TEXT,
  status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'sent', 'failed')),
  email_subject TEXT,
  email_body TEXT,
  provider_message_id TEXT,
  last_error TEXT,
  retry_count INTEGER NOT NULL DEFAULT 0,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  processed_at TIMESTAMPTZ
);

ALTER TABLE public.marketing_automation_queue ADD COLUMN IF NOT EXISTS email_subject TEXT;
ALTER TABLE public.marketing_automation_queue ADD COLUMN IF NOT EXISTS email_body TEXT;
ALTER TABLE public.marketing_automation_queue ADD COLUMN IF NOT EXISTS provider_message_id TEXT;
ALTER TABLE public.marketing_automation_queue ADD COLUMN IF NOT EXISTS last_error TEXT;
ALTER TABLE public.marketing_automation_queue ADD COLUMN IF NOT EXISTS retry_count INTEGER NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_marketing_automation_queue_event_type
  ON public.marketing_automation_queue(event_type, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_marketing_automation_queue_recipient
  ON public.marketing_automation_queue(recipient_email, created_at DESC);

ALTER TABLE public.marketing_automation_queue ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role full access to marketing automation queue" ON public.marketing_automation_queue;
CREATE POLICY "Service role full access to marketing automation queue" ON public.marketing_automation_queue
  FOR ALL USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ============================================================================
CREATE TABLE IF NOT EXISTS public.marketing_automation_policy (
  id TEXT PRIMARY KEY DEFAULT 'default',
  max_retries INTEGER NOT NULL DEFAULT 3 CHECK (max_retries >= 1 AND max_retries <= 10),
  retry_window_hours INTEGER NOT NULL DEFAULT 72 CHECK (retry_window_hours >= 1 AND retry_window_hours <= 168),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==========================================================================
-- Table: booking_audit_logs
-- ==========================================================================
CREATE TABLE IF NOT EXISTS public.booking_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  details JSONB,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS: Only allow business owner to view their audit logs
CREATE POLICY select_audit_logs ON booking_audit_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM bookings b
      WHERE b.id = booking_audit_logs.booking_id
      AND b.business_id = auth.uid()
    )
  );

ALTER TABLE booking_audit_logs ENABLE ROW LEVEL SECURITY;

INSERT INTO public.marketing_automation_policy (id, max_retries, retry_window_hours)
VALUES ('default', 3, 72)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.marketing_automation_policy (id, max_retries, retry_window_hours)
VALUES
  ('abandoned_signup', 3, 72),
  ('abandoned_payment', 3, 72)
ON CONFLICT (id) DO NOTHING;

ALTER TABLE public.marketing_automation_policy ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role full access to marketing automation policy" ON public.marketing_automation_policy;
CREATE POLICY "Service role full access to marketing automation policy" ON public.marketing_automation_policy
  FOR ALL USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ============================================================================
-- Table: marketing_automation_alert_policy
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.marketing_automation_alert_policy (
  id TEXT PRIMARY KEY DEFAULT 'default',
  failure_rate_threshold INTEGER NOT NULL DEFAULT 40 CHECK (failure_rate_threshold >= 1 AND failure_rate_threshold <= 100),
  min_attempts INTEGER NOT NULL DEFAULT 5 CHECK (min_attempts >= 1 AND min_attempts <= 1000),
  cooldown_minutes INTEGER NOT NULL DEFAULT 60 CHECK (cooldown_minutes >= 1 AND cooldown_minutes <= 1440),
  alert_email TEXT,
  webhook_url TEXT,
  last_alert_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO public.marketing_automation_alert_policy (id, failure_rate_threshold, min_attempts, cooldown_minutes)
VALUES ('default', 40, 5, 60)
ON CONFLICT (id) DO NOTHING;

ALTER TABLE public.marketing_automation_alert_policy ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role full access to marketing automation alert policy" ON public.marketing_automation_alert_policy;
CREATE POLICY "Service role full access to marketing automation alert policy" ON public.marketing_automation_alert_policy
  FOR ALL USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ============================================================================
-- Table: marketing_automation_alert_logs
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.marketing_automation_alert_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  triggered_by TEXT NOT NULL CHECK (triggered_by IN ('automatic', 'manual_test')),
  event_scope TEXT NOT NULL DEFAULT 'all',
  failure_rate NUMERIC(5,2) NOT NULL DEFAULT 0,
  attempts INTEGER NOT NULL DEFAULT 0,
  sent_webhook BOOLEAN NOT NULL DEFAULT false,
  sent_email BOOLEAN NOT NULL DEFAULT false,
  webhook_provider TEXT,
  signed_webhook BOOLEAN NOT NULL DEFAULT false,
  dispatch_error TEXT,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_marketing_automation_alert_logs_created_at ON public.marketing_automation_alert_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_marketing_automation_alert_logs_scope_created ON public.marketing_automation_alert_logs(event_scope, created_at DESC);

ALTER TABLE public.marketing_automation_alert_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role full access to marketing automation alert logs" ON public.marketing_automation_alert_logs;
CREATE POLICY "Service role full access to marketing automation alert logs" ON public.marketing_automation_alert_logs
  FOR ALL USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ============================================================================
-- Table: conversations
-- ============================================================================
-- Stores chat conversations between customers and the AI
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  messages JSONB DEFAULT '[]'::jsonb,
  lead_captured BOOLEAN DEFAULT false,
  lead_contacted BOOLEAN DEFAULT false,
  customer_name TEXT,
  customer_phone TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_conversations_business_id ON public.conversations(business_id);
CREATE INDEX IF NOT EXISTS idx_conversations_session_id ON public.conversations(session_id);
CREATE INDEX IF NOT EXISTS idx_conversations_business_created_at ON public.conversations(business_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversations_lead_captured ON public.conversations(lead_captured);
CREATE INDEX IF NOT EXISTS idx_conversations_lead_contacted ON public.conversations(lead_contacted);

-- ============================================================================
-- Migration: Agent Audit columns on conversations (v3 – safe to re-run)
-- ============================================================================
ALTER TABLE public.conversations ADD COLUMN IF NOT EXISTS ai_safety_score INTEGER CHECK (ai_safety_score IS NULL OR (ai_safety_score >= 0 AND ai_safety_score <= 100));
ALTER TABLE public.conversations ADD COLUMN IF NOT EXISTS flagged BOOLEAN DEFAULT false;
ALTER TABLE public.conversations ADD COLUMN IF NOT EXISTS flag_reason TEXT;
ALTER TABLE public.conversations ADD COLUMN IF NOT EXISTS sensitive_data_detected BOOLEAN DEFAULT false;
ALTER TABLE public.conversations ADD COLUMN IF NOT EXISTS sensitive_data_types JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.conversations ADD COLUMN IF NOT EXISTS response_accuracy_score INTEGER CHECK (response_accuracy_score IS NULL OR (response_accuracy_score >= 0 AND response_accuracy_score <= 100));
ALTER TABLE public.conversations ADD COLUMN IF NOT EXISTS audit_reviewed BOOLEAN DEFAULT false;
ALTER TABLE public.conversations ADD COLUMN IF NOT EXISTS audit_reviewed_at TIMESTAMPTZ;

-- Index for quickly fetching flagged conversations per business
CREATE INDEX IF NOT EXISTS idx_conversations_flagged ON public.conversations(business_id, flagged);

-- ============================================================================
-- Table: audit_reports
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.audit_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  report_date DATE NOT NULL,
  total_conversations INTEGER NOT NULL DEFAULT 0,
  flagged_count INTEGER NOT NULL DEFAULT 0,
  avg_safety_score INTEGER,
  sensitive_data_incidents INTEGER NOT NULL DEFAULT 0,
  top_issues JSONB DEFAULT '[]'::jsonb,
  ai_summary TEXT,
  generated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_reports_business_id ON public.audit_reports(business_id, report_date DESC);

-- RLS for audit_reports
ALTER TABLE public.audit_reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own audit reports" ON public.audit_reports;
CREATE POLICY "Users can view own audit reports" ON public.audit_reports
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.businesses
      WHERE businesses.id = audit_reports.business_id
      AND businesses.owner_email = auth.jwt() ->> 'email'
    )
  );

DROP POLICY IF EXISTS "Service role can manage audit reports" ON public.audit_reports;
CREATE POLICY "Service role can manage audit reports" ON public.audit_reports
  FOR ALL USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ============================================================================
-- Row Level Security (RLS) Policies
-- ============================================================================
-- Enable RLS on both tables
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

-- Policies for businesses table
-- Users can only see their own business
DROP POLICY IF EXISTS "Users can view own business" ON public.businesses;
CREATE POLICY "Users can view own business" ON public.businesses
  FOR SELECT USING (
    lower(auth.jwt() ->> 'email') = lower(owner_email)
  );

-- Users can only update their own business
DROP POLICY IF EXISTS "Users can update own business" ON public.businesses;
CREATE POLICY "Users can update own business" ON public.businesses
  FOR UPDATE USING (
    lower(auth.jwt() ->> 'email') = lower(owner_email)
  ) WITH CHECK (
    lower(auth.jwt() ->> 'email') = lower(owner_email)
  );

-- Users can insert businesses (for signup)
DROP POLICY IF EXISTS "Users can create business" ON public.businesses;
CREATE POLICY "Users can create business" ON public.businesses
  FOR INSERT WITH CHECK (
    lower(auth.jwt() ->> 'email') = lower(owner_email)
  );

-- Policies for conversations table
-- Users can view conversations for their businesses
DROP POLICY IF EXISTS "Users can view business conversations" ON public.conversations;
CREATE POLICY "Users can view business conversations" ON public.conversations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.businesses
      WHERE businesses.id = conversations.business_id
      AND lower(businesses.owner_email) = lower(auth.jwt() ->> 'email')
    )
  );

-- Users can update conversations for their businesses
DROP POLICY IF EXISTS "Users can update business conversations" ON public.conversations;
CREATE POLICY "Users can update business conversations" ON public.conversations
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.businesses
      WHERE businesses.id = conversations.business_id
      AND lower(businesses.owner_email) = lower(auth.jwt() ->> 'email')
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.businesses
      WHERE businesses.id = conversations.business_id
      AND lower(businesses.owner_email) = lower(auth.jwt() ->> 'email')
    )
  );

-- Anyone can insert conversations (for widget interactions)
DROP POLICY IF EXISTS "Anyone can create conversation" ON public.conversations;
CREATE POLICY "Anyone can create conversation" ON public.conversations
  FOR INSERT WITH CHECK (true);

-- ============================================================================
-- Broadcasts Table
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.broadcasts (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id  UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  message      TEXT NOT NULL,
  sent_to_count INTEGER NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_broadcasts_business_id ON public.broadcasts (business_id, created_at DESC);

ALTER TABLE public.broadcasts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Business owners can manage own broadcasts" ON public.broadcasts;
CREATE POLICY "Business owners can manage own broadcasts" ON public.broadcasts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.businesses
      WHERE businesses.id = broadcasts.business_id
      AND lower(businesses.owner_email) = lower(auth.jwt() ->> 'email')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.businesses
      WHERE businesses.id = broadcasts.business_id
      AND lower(businesses.owner_email) = lower(auth.jwt() ->> 'email')
    )
  );

-- Service role has full access (used by API routes)
DROP POLICY IF EXISTS "Service role full access to broadcasts" ON public.broadcasts;
CREATE POLICY "Service role full access to broadcasts" ON public.broadcasts
  FOR ALL USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ============================================================================
-- Bookings Table (car rental & booking-based businesses)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.bookings (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id    UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  session_id     TEXT NOT NULL,
  customer_name  TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  pickup_date    TEXT NOT NULL,
  return_date    TEXT NOT NULL,
  car_type       TEXT NOT NULL DEFAULT 'Standard',
  total_days     INTEGER NOT NULL DEFAULT 1,
  status         TEXT NOT NULL DEFAULT 'pending'
                   CHECK (status IN ('pending', 'confirmed', 'declined')),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bookings_business_id ON public.bookings (business_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings (business_id, status);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Business owners can manage own bookings" ON public.bookings;
CREATE POLICY "Business owners can manage own bookings" ON public.bookings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.businesses
      WHERE businesses.id = bookings.business_id
      AND lower(businesses.owner_email) = lower(auth.jwt() ->> 'email')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.businesses
      WHERE businesses.id = bookings.business_id
      AND lower(businesses.owner_email) = lower(auth.jwt() ->> 'email')
    )
  );

-- Service role has full access (used by API routes)
DROP POLICY IF EXISTS "Service role full access to bookings" ON public.bookings;
CREATE POLICY "Service role full access to bookings" ON public.bookings
  FOR ALL USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Widget can create bookings (triggered by chat AI)
DROP POLICY IF EXISTS "Anyone can create booking" ON public.bookings;
CREATE POLICY "Anyone can create booking" ON public.bookings
  FOR INSERT WITH CHECK (true);

-- ============================================================================
-- Migration: customer_rating column on conversations (v5 – safe to re-run)
-- ============================================================================
ALTER TABLE public.conversations ADD COLUMN IF NOT EXISTS customer_rating INTEGER
  CHECK (customer_rating IS NULL OR (customer_rating >= 1 AND customer_rating <= 5));

-- ============================================================================
-- Migration: CRM contact fields on conversations (v6 – safe to re-run)
-- ============================================================================
ALTER TABLE public.conversations ADD COLUMN IF NOT EXISTS contact_status TEXT DEFAULT 'new';
ALTER TABLE public.conversations ADD COLUMN IF NOT EXISTS contact_notes TEXT;
ALTER TABLE public.conversations ADD COLUMN IF NOT EXISTS contacted_at TIMESTAMPTZ;
ALTER TABLE public.conversations ADD COLUMN IF NOT EXISTS converted_at TIMESTAMPTZ;
ALTER TABLE public.conversations ADD COLUMN IF NOT EXISTS channel TEXT DEFAULT 'web';
ALTER TABLE public.conversations ADD COLUMN IF NOT EXISTS external_contact_id TEXT;

-- Optional helper index for CRM filtering by status per business
CREATE INDEX IF NOT EXISTS idx_conversations_contact_status
  ON public.conversations (business_id, contact_status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversations_channel_created
  ON public.conversations (business_id, channel, created_at DESC);

-- ============================================================================
-- Table: whatsapp_message_events
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.whatsapp_message_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  direction TEXT NOT NULL CHECK (direction IN ('inbound', 'outbound')),
  whatsapp_message_id TEXT NOT NULL UNIQUE,
  from_number TEXT,
  to_phone_number_id TEXT,
  body_text TEXT,
  delivery_status TEXT,
  error_message TEXT,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_whatsapp_message_events_business_created
  ON public.whatsapp_message_events (business_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_whatsapp_message_events_session_created
  ON public.whatsapp_message_events (session_id, created_at DESC);

ALTER TABLE public.whatsapp_message_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role full access to whatsapp message events" ON public.whatsapp_message_events;
CREATE POLICY "Service role full access to whatsapp message events" ON public.whatsapp_message_events
  FOR ALL USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Users can view own whatsapp message events" ON public.whatsapp_message_events;
CREATE POLICY "Users can view own whatsapp message events" ON public.whatsapp_message_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.businesses
      WHERE businesses.id = whatsapp_message_events.business_id
      AND lower(businesses.owner_email) = lower(auth.jwt() ->> 'email')
    )
  );

-- ============================================================================
-- Migration: Generic booking fields (v6 – safe to re-run)
-- ============================================================================
-- Keep existing car-rental columns for backward compatibility while enabling
-- generic service bookings used by the new dashboard booking workflows.
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS service_type TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS booking_date DATE;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS booking_time TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS special_requests TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS confirmed_at TIMESTAMPTZ;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMPTZ;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS notes TEXT;

-- Extend status enum check to support cancelled if this is an older schema.
ALTER TABLE public.bookings DROP CONSTRAINT IF EXISTS bookings_status_check;
ALTER TABLE public.bookings
  ADD CONSTRAINT bookings_status_check
  CHECK (status IN ('pending', 'confirmed', 'declined', 'cancelled'));

CREATE INDEX IF NOT EXISTS idx_bookings_business_booking_date
  ON public.bookings (business_id, booking_date, created_at DESC);

-- ============================================================================
-- Storage Bucket (Optional - for widget customization assets)
-- ============================================================================
-- Uncomment if you want to store business logos/assets
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('business-assets', 'business-assets', true);

-- ============================================================================
-- v2 additions: message counter and increment function
-- ============================================================================
ALTER TABLE public.businesses ADD COLUMN IF NOT EXISTS message_count_month INTEGER NOT NULL DEFAULT 0;
ALTER TABLE public.businesses ADD COLUMN IF NOT EXISTS message_count_total INTEGER NOT NULL DEFAULT 0;

-- Atomic increment (called from chat route, non-blocking)
CREATE OR REPLACE FUNCTION public.increment_message_count(p_business_id UUID)
RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  UPDATE public.businesses
  SET message_count_month = message_count_month + 1,
      message_count_total = message_count_total + 1
  WHERE id = p_business_id;
END;
$$;

-- Reset monthly counter (run on 1st of each month via cron or Supabase Edge Function)
CREATE OR REPLACE FUNCTION public.reset_monthly_counts()
RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  UPDATE public.businesses SET message_count_month = 0;
END;
$$;

-- Service role: allow API routes to bypass RLS for these functions
GRANT EXECUTE ON FUNCTION public.increment_message_count TO service_role;
GRANT EXECUTE ON FUNCTION public.reset_monthly_counts TO service_role;

-- ============================================================================
-- FIX 4: Add last_message_at and is_read to conversations
-- ============================================================================
ALTER TABLE public.conversations ADD COLUMN IF NOT EXISTS last_message_at TIMESTAMPTZ;
ALTER TABLE public.conversations ADD COLUMN IF NOT EXISTS is_read BOOLEAN DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_conversations_last_message_at ON public.conversations(last_message_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversations_is_read ON public.conversations(business_id, is_read);

-- ============================================================================
-- FIX 5: Orders table
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  conversation_id UUID REFERENCES conversations(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  customer_email TEXT,
  items JSONB DEFAULT '[]'::jsonb,
  total_amount DECIMAL(10,2) DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'done', 'cancelled')),
  source TEXT DEFAULT 'chat',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_orders_business_id ON public.orders(business_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(business_id, status);

-- Orders RLS policies
DROP POLICY IF EXISTS "Business owners can manage own orders" ON public.orders;
CREATE POLICY "Business owners can manage own orders" ON public.orders
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.businesses
      WHERE businesses.id = orders.business_id
      AND lower(businesses.owner_email) = lower(auth.jwt() ->> 'email')
    )
  );

DROP POLICY IF EXISTS "Service role full access to orders" ON public.orders;
CREATE POLICY "Service role full access to orders" ON public.orders
  FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Anyone can create order" ON public.orders;
CREATE POLICY "Anyone can create order" ON public.orders
  FOR INSERT WITH CHECK (true);

-- Add conversation_id to bookings if not exists
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS conversation_id UUID REFERENCES conversations(id) ON DELETE SET NULL;
