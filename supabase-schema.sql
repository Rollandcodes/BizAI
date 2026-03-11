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
  system_prompt TEXT,
  widget_color TEXT DEFAULT '#2563eb',
  plan TEXT DEFAULT 'trial' CHECK (plan IN ('trial', 'basic', 'pro', 'business')),
  plan_expires_at TIMESTAMPTZ,
  paypal_subscription_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT valid_email CHECK (owner_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$')
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_businesses_owner_email ON public.businesses(owner_email);
CREATE INDEX IF NOT EXISTS idx_businesses_created_at ON public.businesses(created_at DESC);

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
-- Storage Bucket (Optional - for widget customization assets)
-- ============================================================================
-- Uncomment if you want to store business logos/assets
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('business-assets', 'business-assets', true);
