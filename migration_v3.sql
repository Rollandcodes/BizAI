-- CypAI Rebuild V3.0 - Neural Schema Migration
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. Profiles Table (Linked to Auth Users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  language_preference TEXT DEFAULT 'en',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Organizations (Replaces/Extends Businesses)
-- We keep 'businesses' for backward compatibility, but create 'organizations' for the new naming convention
-- Many-to-One: Profiles can have multiple organizations in the future
CREATE TABLE IF NOT EXISTS public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  niche TEXT, -- Links to AGENT_PACKS
  website TEXT,
  whatsapp_number TEXT,
  plan TEXT DEFAULT 'Free', -- Re-enforcing platform is FREE
  v3_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Agents Table (V3 Multiple Agents per Org)
CREATE TABLE IF NOT EXISTS public.agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  niche_pack TEXT NOT NULL, -- e.g. 'Car Rental'
  welcome_message TEXT,
  system_instructions TEXT,
  is_active BOOLEAN DEFAULT true,
  widget_config JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Neural Knowledge Items (RAG source)
CREATE TABLE IF NOT EXISTS public.knowledge_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES public.agents(id) ON DELETE CASCADE,
  content_type TEXT CHECK (content_type IN ('pdf', 'text', 'url', 'spreadsheet')),
  content_body TEXT,
  source_name TEXT,
  vector_id TEXT, -- For future Vecto integration
  last_synced TIMESTAMPTZ DEFAULT now()
);

-- 5. Neural Bridge Requests (Lead Gen Form)
CREATE TABLE IF NOT EXISTS public.custom_build_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  business_type TEXT,
  whatsapp_number TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'built')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Updated Conversations for Agents
ALTER TABLE public.conversations ADD COLUMN IF NOT EXISTS agent_id UUID REFERENCES public.agents(id) ON DELETE SET NULL;
ALTER TABLE public.conversations ADD COLUMN IF NOT EXISTS visitor_id TEXT; -- For persistent tracking
ALTER TABLE public.conversations ADD COLUMN IF NOT EXISTS lead_score INTEGER DEFAULT 0;
ALTER TABLE public.conversations ADD COLUMN IF NOT EXISTS intent_classification TEXT;

-- 7. RLS for Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 8. RLS for Organizations
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners can manage own organization" ON public.organizations FOR ALL USING (owner_id = auth.uid());

-- 9. RLS for Agents
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members see own organization agents" ON public.agents FOR ALL USING (
  EXISTS (SELECT 1 FROM public.organizations WHERE id = agents.organization_id AND owner_id = auth.uid())
);

-- 10. Neural Bridge RLS (Anyone can insert)
ALTER TABLE public.custom_build_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can request build" ON public.custom_build_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins see requests" ON public.custom_build_requests FOR SELECT USING (auth.role() = 'service_role');
