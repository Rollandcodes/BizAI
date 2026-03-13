import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const hasValidSupabaseConfig =
  /^https?:\/\//.test(supabaseUrl) && supabaseAnonKey.length > 0;
const fallbackSupabaseUrl = 'https://placeholder.supabase.co';
const fallbackSupabaseKey = 'placeholder-anon-key';

export function assertSupabaseConfig() {
  if (hasValidSupabaseConfig) {
    return;
  }

  throw new Error(
    'Missing Supabase configuration. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY'
  );
}

// Client-side Supabase instance (use in components)
export const supabase = createClient(
  hasValidSupabaseConfig ? supabaseUrl : fallbackSupabaseUrl,
  hasValidSupabaseConfig ? supabaseAnonKey : fallbackSupabaseKey
);

// Server-side Supabase instance (use in API routes)
export const createServerClient = (accessToken?: string) => {
  const serverUrl = hasValidSupabaseConfig ? supabaseUrl : fallbackSupabaseUrl;
  const serverKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey;

  return createClient(serverUrl, serverKey || fallbackSupabaseKey, {
    auth: {
      persistSession: false,
    },
  });
};

// ============================================================================
// Database Types
// ============================================================================

export type BusinessPlan = 'trial' | 'basic' | 'pro' | 'business';
export type BusinessType =
  | 'car_rental'
  | 'barbershop'
  | 'student_accommodation'
  | 'accommodation'
  | string;

export interface Business {
  id: string;
  owner_email: string;
  business_name: string;
  business_type?: BusinessType;
  system_prompt?: string;
  widget_color: string;
  widget_position?: 'bottom-right' | 'bottom-left';
  welcome_message?: string;
  business_hours?: Record<string, { open: string; close: string; closed: boolean }>;
  languages?: string[];
  custom_faqs?: Array<{ question: string; answer: string }>;
  pricing_info?: string;
  common_questions_text?: string;
  additional_info?: string;
  onboarding_complete?: boolean;
  plan: BusinessPlan;
  plan_expires_at?: string;
  paypal_subscription_id?: string;
  created_at: string;
}

export interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface Conversation {
  id: string;
  business_id: string;
  session_id: string;
  messages: ConversationMessage[];
  lead_captured: boolean;
  lead_contacted?: boolean;
  customer_name?: string;
  customer_phone?: string;
  created_at: string;
}

// ============================================================================
// Business Operations
// ============================================================================

export const getBusinessSettings = async (businessId: string) => {
  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('id', businessId)
    .single();

  if (error) throw error;
  return data as Business;
};

export const getBusinessByEmail = async (email: string) => {
  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('owner_email', email);

  if (error) throw error;
  return data as Business[];
};

export const saveBusinessSettings = async (
  businessId: string,
  settings: Partial<Business>
) => {
  const { data, error } = await supabase
    .from('businesses')
    .update(settings)
    .eq('id', businessId)
    .select()
    .single();

  if (error) throw error;
  return data as Business;
};

export const createBusiness = async (business: Omit<Business, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('businesses')
    .insert([business])
    .select()
    .single();

  if (error) throw error;
  return data as Business;
};

// ============================================================================
// Conversation Operations
// ============================================================================

export const createConversation = async (
  businessId: string,
  sessionId: string
) => {
  const { data, error } = await supabase
    .from('conversations')
    .insert([
      {
        business_id: businessId,
        session_id: sessionId,
        messages: [],
        lead_captured: false,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data as Conversation;
};

export const getConversation = async (conversationId: string) => {
  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .eq('id', conversationId)
    .single();

  if (error) throw error;
  return data as Conversation;
};

export const updateConversationMessages = async (
  conversationId: string,
  messages: ConversationMessage[]
) => {
  const { data, error } = await supabase
    .from('conversations')
    .update({ messages })
    .eq('id', conversationId)
    .select()
    .single();

  if (error) throw error;
  return data as Conversation;
};

export const updateConversationLead = async (
  conversationId: string,
  leadData: {
    lead_captured: boolean;
    customer_name?: string;
    customer_phone?: string;
  }
) => {
  const { data, error } = await supabase
    .from('conversations')
    .update(leadData)
    .eq('id', conversationId)
    .select()
    .single();

  if (error) throw error;
  return data as Conversation;
};

export const getBusinessConversations = async (businessId: string) => {
  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .eq('business_id', businessId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Conversation[];
};
