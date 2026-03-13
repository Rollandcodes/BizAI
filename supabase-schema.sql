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

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_businesses_owner_email ON public.businesses(owner_email);
CREATE INDEX IF NOT EXISTS idx_businesses_created_at ON public.businesses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_businesses_referral_code ON public.businesses(referral_code);

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

CREATE POLICY "Users can view own audit reports" ON public.audit_reports
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.businesses
      WHERE businesses.id = audit_reports.business_id
      AND businesses.owner_email = auth.jwt() ->> 'email'
    )
  );

CREATE POLICY "Service role can manage audit reports" ON public.audit_reports
  FOR ALL USING (true);

-- ============================================================================
-- Row Level Security (RLS) Policies
-- ============================================================================
-- Enable RLS on both tables
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

-- Policies for businesses table
-- Users can only see their own business
CREATE POLICY "Users can view own business" ON public.businesses
  FOR SELECT USING (
    auth.jwt() ->> 'email' = owner_email
  );

-- Users can only update their own business
CREATE POLICY "Users can update own business" ON public.businesses
  FOR UPDATE USING (
    auth.jwt() ->> 'email' = owner_email
  ) WITH CHECK (
    auth.jwt() ->> 'email' = owner_email
  );

-- Users can insert businesses (for signup)
CREATE POLICY "Users can create business" ON public.businesses
  FOR INSERT WITH CHECK (
    auth.jwt() ->> 'email' = owner_email
  );

-- Policies for conversations table
-- Users can view conversations for their businesses
CREATE POLICY "Users can view business conversations" ON public.conversations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.businesses
      WHERE businesses.id = conversations.business_id
      AND businesses.owner_email = auth.jwt() ->> 'email'
    )
  );

-- Users can update conversations for their businesses
CREATE POLICY "Users can update business conversations" ON public.conversations
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.businesses
      WHERE businesses.id = conversations.business_id
      AND businesses.owner_email = auth.jwt() ->> 'email'
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.businesses
      WHERE businesses.id = conversations.business_id
      AND businesses.owner_email = auth.jwt() ->> 'email'
    )
  );

-- Anyone can insert conversations (for widget interactions)
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

CREATE POLICY "Business owners can manage own broadcasts" ON public.broadcasts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.businesses
      WHERE businesses.id = broadcasts.business_id
      AND businesses.owner_email = auth.jwt() ->> 'email'
    )
  );

-- Service role has full access (used by API routes)
CREATE POLICY "Service role full access to broadcasts" ON public.broadcasts
  FOR ALL USING (auth.role() = 'service_role');

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

CREATE POLICY "Business owners can manage own bookings" ON public.bookings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.businesses
      WHERE businesses.id = bookings.business_id
      AND businesses.owner_email = auth.jwt() ->> 'email'
    )
  );

-- Service role has full access (used by API routes)
CREATE POLICY "Service role full access to bookings" ON public.bookings
  FOR ALL USING (auth.role() = 'service_role');

-- Widget can create bookings (triggered by chat AI)
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

-- Optional helper index for CRM filtering by status per business
CREATE INDEX IF NOT EXISTS idx_conversations_contact_status
  ON public.conversations (business_id, contact_status, created_at DESC);

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
