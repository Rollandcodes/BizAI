import { NextRequest, NextResponse } from 'next/server';
import { assertSupabaseConfig, createServerClient } from '@/lib/supabase';

const supabase = createServerClient();
const CUSTOM_FAQ_SEPARATOR = '\n\nCustom FAQs:\n';
const defaultWelcomeMessage = 'Hi! 👋 How can I help you today?';
const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

type CustomFaq = {
  question: string;
  answer: string;
};

type BusinessHoursDay = {
  open: string;
  close: string;
  closed: boolean;
};

type BusinessHours = Record<string, BusinessHoursDay>;

type OnboardingPayload = {
  businessName: string;
  businessType: string;
  whatsapp: string;
  website: string;
  businessHours: BusinessHours;
  languages: string[];
  pricesText: string;
  commonQuestionsText: string;
  additionalInfo: string;
  widgetColor: string;
  widgetPosition: 'bottom-right' | 'bottom-left';
  welcomeMessage: string;
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

function parseFaqTextarea(value?: string) {
  const lines = (value || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
  const faqs: CustomFaq[] = [];

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (!line?.startsWith('Q:')) {
      continue;
    }

    const answerLine = lines[index + 1]?.startsWith('A:') ? lines[index + 1] : '';
    if (answerLine) {
      index += 1;
    }

    faqs.push({
      question: line.replace(/^Q:\s*/, '').trim(),
      answer: answerLine.replace(/^A:\s*/, '').trim(),
    });
  }

  return faqs;
}

function serializeBusinessHours(hours?: BusinessHours) {
  const fallback = {
    Mon: { open: '09:00', close: '18:00', closed: false },
    Tue: { open: '09:00', close: '18:00', closed: false },
    Wed: { open: '09:00', close: '18:00', closed: false },
    Thu: { open: '09:00', close: '18:00', closed: false },
    Fri: { open: '09:00', close: '18:00', closed: false },
    Sat: { open: '09:00', close: '14:00', closed: false },
    Sun: { open: '09:00', close: '14:00', closed: true },
  } satisfies BusinessHours;

  return weekDays.reduce<BusinessHours>((accumulator, day) => {
    const source = hours?.[day];
    accumulator[day] = {
      open: source?.open || fallback[day].open,
      close: source?.close || fallback[day].close,
      closed: typeof source?.closed === 'boolean' ? source.closed : fallback[day].closed,
    };
    return accumulator;
  }, {});
}

function buildOnboardingSystemPrompt(onboarding: OnboardingPayload) {
  const faqItems = parseFaqTextarea(onboarding.commonQuestionsText);
  const formattedFaqs = faqItems.length > 0
    ? faqItems.map((faq) => `Q: ${faq.question}\nA: ${faq.answer || 'Share the latest answer with the customer.'}`).join('\n')
    : '';
  const formattedHours = weekDays
    .map((day) => {
      const entry = onboarding.businessHours?.[day];
      if (!entry || entry.closed) {
        return `${day}: Closed`;
      }

      return `${day}: ${entry.open} - ${entry.close}`;
    })
    .join('\n');

  return [
    `You are the AI assistant for ${onboarding.businessName || 'this business'}.`,
    onboarding.businessType ? `Business type: ${onboarding.businessType}.` : '',
    onboarding.whatsapp ? `Primary WhatsApp contact: ${onboarding.whatsapp}.` : '',
    onboarding.website ? `Website: ${onboarding.website}.` : '',
    onboarding.languages?.length ? `Reply in any of these languages when relevant: ${onboarding.languages.join(', ')}.` : '',
    formattedHours ? `Business hours:\n${formattedHours}` : '',
    onboarding.pricesText.trim() ? `Pricing and packages:\n${onboarding.pricesText.trim()}` : '',
    formattedFaqs ? `${CUSTOM_FAQ_SEPARATOR}${formattedFaqs}` : '',
    onboarding.additionalInfo.trim() ? `Extra business notes:\n${onboarding.additionalInfo.trim()}` : '',
    onboarding.welcomeMessage.trim() ? `Preferred welcome message: ${onboarding.welcomeMessage.trim()}` : '',
    'Be concise, helpful, and lead-focused. When someone is ready to book or enquire, collect their name and phone number.',
  ]
    .filter(Boolean)
    .join('\n\n');
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
  const storedFaqs = Array.isArray(business.custom_faqs)
    ? (business.custom_faqs as CustomFaq[])
    : parsedPrompt.customFaqs;

  const monthlyMessages = (monthlyMessagesResult.data || []).reduce((sum, row) => {
    const messages = Array.isArray(row.messages) ? row.messages : [];
    return sum + messages.length;
  }, 0);

  return {
    business: {
      ...business,
      customInstructions: parsedPrompt.customInstructions,
      customFaqs: storedFaqs,
      onboarding_complete: Boolean(business.onboarding_complete),
      business_hours: serializeBusinessHours(business.business_hours as BusinessHours | undefined),
      languages: Array.isArray(business.languages) ? business.languages : [],
      widget_position: (business.widget_position as string | null | undefined) || 'bottom-right',
      welcome_message: (business.welcome_message as string | null | undefined) || defaultWelcomeMessage,
      pricing_info: (business.pricing_info as string | null | undefined) || '',
      common_questions_text: (business.common_questions_text as string | null | undefined) || '',
      additional_info: (business.additional_info as string | null | undefined) || '',
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
      onboardingData,
      onboardingComplete,
    } = body as {
      businessId?: string;
      businessName?: string;
      businessType?: string;
      widgetColor?: string;
      customInstructions?: string;
      customFaqs?: CustomFaq[];
      onboardingData?: OnboardingPayload;
      onboardingComplete?: boolean;
    };

    if (!businessId) {
      return NextResponse.json(
        { error: 'businessId is required' },
        { status: 400 }
      );
    }

    const updatePayload: Record<string, unknown> = {};

    if (onboardingData) {
      // Core fields — always exist in the schema
      updatePayload.business_name = onboardingData.businessName;
      updatePayload.business_type = onboardingData.businessType;
      updatePayload.whatsapp = onboardingData.whatsapp;
      updatePayload.website = onboardingData.website || null;
      updatePayload.widget_color = onboardingData.widgetColor;
      updatePayload.system_prompt = buildOnboardingSystemPrompt(onboardingData);
    } else {
      if (typeof businessName !== 'undefined') {
        updatePayload.business_name = businessName;
      }
      if (typeof businessType !== 'undefined') {
        updatePayload.business_type = businessType;
      }
      if (typeof widgetColor !== 'undefined') {
        updatePayload.widget_color = widgetColor;
      }
      if (typeof customInstructions !== 'undefined' || typeof customFaqs !== 'undefined') {
        const normalizedFaqs = (customFaqs || []).filter((faq) => faq.question.trim() || faq.answer.trim());
        updatePayload.custom_faqs = normalizedFaqs;
        updatePayload.system_prompt = buildSystemPrompt(customInstructions, normalizedFaqs);
      }
    }

    if (typeof onboardingComplete === 'boolean') {
      updatePayload.onboarding_complete = onboardingComplete;
    }

    // ------------------------------------------------------------------
    // Phase 1 — save core fields (always succeeds)
    // ------------------------------------------------------------------
    const { data, error } = await supabase
      .from('businesses')
      .update(updatePayload)
      .eq('id', businessId)
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    // ------------------------------------------------------------------
    // Phase 2 — save extended onboarding columns (graceful: columns may
    //           not exist yet if the ALTER TABLE migration hasn't been run)
    // ------------------------------------------------------------------
    let extendedSaved = false;
    if (onboardingData) {
      const onboardingFaqs = parseFaqTextarea(onboardingData.commonQuestionsText);
      const extendedPayload: Record<string, unknown> = {
        business_hours: serializeBusinessHours(onboardingData.businessHours),
        languages: onboardingData.languages || [],
        widget_position: onboardingData.widgetPosition,
        welcome_message: onboardingData.welcomeMessage || defaultWelcomeMessage,
        custom_faqs: onboardingFaqs,
        pricing_info: onboardingData.pricesText,
        common_questions_text: onboardingData.commonQuestionsText,
        additional_info: onboardingData.additionalInfo,
      };
      if (typeof onboardingComplete === 'boolean') {
        extendedPayload.onboarding_complete = onboardingComplete;
      }

      const { error: extError } = await supabase
        .from('businesses')
        .update(extendedPayload)
        .eq('id', businessId);

      if (extError) {
        // Columns not yet migrated — log but do NOT fail the request
        console.warn('Onboarding extended save skipped (run schema migration):', extError.message);
      } else {
        extendedSaved = true;
      }
    }

    const parsedPrompt = parseBusinessPrompt(data.system_prompt as string | null | undefined);

    return NextResponse.json({
      success: true,
      migrationNeeded: onboardingData ? !extendedSaved : false,
      business: {
        ...data,
        customInstructions: parsedPrompt.customInstructions,
        customFaqs: Array.isArray(data.custom_faqs) ? data.custom_faqs : parsedPrompt.customFaqs,
        onboarding_complete: Boolean(data.onboarding_complete),
        business_hours: serializeBusinessHours(data.business_hours as BusinessHours | undefined),
        languages: Array.isArray(data.languages) ? data.languages : [],
        widget_position: (data.widget_position as string | null | undefined) || 'bottom-right',
        welcome_message: (data.welcome_message as string | null | undefined) || defaultWelcomeMessage,
        pricing_info: (data.pricing_info as string | null | undefined) || '',
        common_questions_text: (data.common_questions_text as string | null | undefined) || '',
        additional_info: (data.additional_info as string | null | undefined) || '',
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
