import { NextRequest, NextResponse } from 'next/server';
import { assertSupabaseConfig, createServerClient } from '@/lib/supabase';

const supabase = createServerClient();
const CUSTOM_FAQ_SEPARATOR = '\n\nCustom FAQs:\n';

type CustomFaq = {
  question: string;
  answer: string;
};

type ConversationRow = {
  id: string;
  created_at: string;
  customer_name: string | null;
  customer_phone: string | null;
  lead_captured: boolean;
  lead_contacted: boolean | null;
  messages: Array<{ role: 'user' | 'assistant'; content: string }> | null;
};

function parseBusinessPrompt(systemPrompt?: string | null) {
  if (!systemPrompt) {
    return { customInstructions: '', customFaqs: [] as CustomFaq[] };
  }

  const [customInstructions, faqBlock] = systemPrompt.split(CUSTOM_FAQ_SEPARATOR);

  if (!faqBlock) {
    return {
      customInstructions: systemPrompt.trim(),
      customFaqs: [],
    };
  }

  const lines = faqBlock
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
  const customFaqs: CustomFaq[] = [];

  for (let index = 0; index < lines.length; index += 2) {
    const questionLine = lines[index];
    const answerLine = lines[index + 1];

    if (!questionLine?.startsWith('Q:') || !answerLine?.startsWith('A:')) {
      continue;
    }

    customFaqs.push({
      question: questionLine.replace(/^Q:\s*/, '').trim(),
      answer: answerLine.replace(/^A:\s*/, '').trim(),
    });
  }

  return {
    customInstructions: customInstructions.trim(),
    customFaqs,
  };
}

function buildSystemPrompt(customInstructions?: string, customFaqs?: CustomFaq[]) {
  const baseInstructions = (customInstructions || '').trim();
  const faqLines = (customFaqs || [])
    .filter((faq) => faq.question.trim() && faq.answer.trim())
    .map((faq) => `Q: ${faq.question.trim()}\nA: ${faq.answer.trim()}`)
    .join('\n');

  if (!faqLines) {
    return baseInstructions;
  }

  return [baseInstructions, `${CUSTOM_FAQ_SEPARATOR}${faqLines}`]
    .filter(Boolean)
    .join('');
}

async function buildDashboardPayload(business: Record<string, unknown>) {
  const businessId = String(business.id);
  const monthStart = getMonthStartIso();

  const [
    totalConversationsResult,
    leadsCountResult,
    monthlyConversationsResult,
    monthlyMessagesResult,
    conversationsResult,
    leadsResult,
  ] = await Promise.all([
    supabase
      .from('conversations')
      .select('*', { count: 'exact', head: true })
      .eq('business_id', businessId),
    supabase
      .from('conversations')
      .select('*', { count: 'exact', head: true })
      .eq('business_id', businessId)
      .eq('lead_captured', true),
    supabase
      .from('conversations')
      .select('*', { count: 'exact', head: true })
      .eq('business_id', businessId)
      .gte('created_at', monthStart),
    supabase
      .from('conversations')
      .select('messages')
      .eq('business_id', businessId)
      .gte('created_at', monthStart),
    supabase
      .from('conversations')
      .select('id, created_at, customer_name, customer_phone, lead_captured, lead_contacted, messages')
      .eq('business_id', businessId)
      .order('created_at', { ascending: false })
      .limit(100),
    supabase
      .from('conversations')
      .select('id, created_at, customer_name, customer_phone, lead_captured, lead_contacted, messages')
      .eq('business_id', businessId)
      .eq('lead_captured', true)
      .order('created_at', { ascending: false })
      .limit(200),
  ]);

  if (
    totalConversationsResult.error ||
    leadsCountResult.error ||
    monthlyConversationsResult.error ||
    monthlyMessagesResult.error ||
    conversationsResult.error ||
    leadsResult.error
  ) {
    throw (
      totalConversationsResult.error ||
      leadsCountResult.error ||
      monthlyConversationsResult.error ||
      monthlyMessagesResult.error ||
      conversationsResult.error ||
      leadsResult.error
    );
  }

  const parsedPrompt = parseBusinessPrompt((business.system_prompt as string | null | undefined) ?? '');

  const monthlyMessages = (monthlyMessagesResult.data || []).reduce((sum, row) => {
    const messages = Array.isArray(row.messages) ? row.messages : [];
    return sum + messages.length;
  }, 0);

  return {
    business: {
      ...business,
      customInstructions: parsedPrompt.customInstructions,
      customFaqs: parsedPrompt.customFaqs,
    },
    stats: {
      totalConversations: totalConversationsResult.count ?? 0,
      leadsCaptured: leadsCountResult.count ?? 0,
      monthlyConversations: monthlyConversationsResult.count ?? 0,
      monthlyMessages,
    },
    conversations: (conversationsResult.data ?? []) as ConversationRow[],
    leads: (leadsResult.data ?? []) as ConversationRow[],
  };
}

function getMonthStartIso() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
}

async function getBusinessByEmail(email: string) {
  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('owner_email', email)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

async function getBusinessById(businessId: string) {
  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('id', businessId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

export async function GET(request: NextRequest) {
  try {
    assertSupabaseConfig();

    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const businessId = searchParams.get('businessId');

    if (!email && !businessId) {
      return NextResponse.json(
        { error: 'Provide email or businessId' },
        { status: 400 }
      );
    }

    const business = email
      ? await getBusinessByEmail(email)
      : await getBusinessById(businessId as string);

    if (!business) {
      return NextResponse.json({
        business: null,
        stats: null,
        conversations: [],
        leads: [],
      });
    }

    return NextResponse.json(await buildDashboardPayload(business as Record<string, unknown>));
  } catch (error) {
    console.error('Business API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch business settings' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    assertSupabaseConfig();

    const body = await request.json();
    const {
      businessId,
      businessName,
      businessType,
      widgetColor,
      customInstructions,
      customFaqs,
    } = body as {
      businessId?: string;
      businessName?: string;
      businessType?: string;
      widgetColor?: string;
      customInstructions?: string;
      customFaqs?: CustomFaq[];
    };

    if (!businessId) {
      return NextResponse.json(
        { error: 'businessId is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('businesses')
      .update({
        business_name: businessName,
        business_type: businessType,
        widget_color: widgetColor,
        system_prompt: buildSystemPrompt(customInstructions, customFaqs),
      })
      .eq('id', businessId)
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    const parsedPrompt = parseBusinessPrompt(data.system_prompt as string | null | undefined);

    return NextResponse.json({
      success: true,
      business: {
        ...data,
        customInstructions: parsedPrompt.customInstructions,
        customFaqs: parsedPrompt.customFaqs,
      },
    });
  } catch (error) {
    console.error('Business API error:', error);
    return NextResponse.json(
      { error: 'Failed to save business settings' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  return PATCH(request);
}
