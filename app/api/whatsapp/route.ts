import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getOpenAIClient } from '@/lib/openai';

type BusinessRow = {
  id: string;
  business_name: string | null;
  business_type: string | null;
  system_prompt: string | null;
  whatsapp_phone_number_id: string | null;
  whatsapp: string | null;
};

type ConversationRow = {
  id: string;
  messages: Array<{ role: 'user' | 'assistant'; content: string }> | null;
  customer_name: string | null;
  customer_phone: string | null;
};

const DEFAULT_SYSTEM_PROMPT =
  'You are a helpful AI assistant for this business. Reply concisely, professionally, and in the user language.';

function createServiceClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
}

function normalizeText(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function getVerifyToken(): string {
  return normalizeText(process.env.WHATSAPP_VERIFY_TOKEN);
}

function getAccessToken(): string {
  return normalizeText(process.env.WHATSAPP_ACCESS_TOKEN);
}

function getGraphApiVersion(): string {
  return normalizeText(process.env.WHATSAPP_GRAPH_API_VERSION) || 'v21.0';
}

function getDefaultBusinessId(): string {
  return normalizeText(process.env.WHATSAPP_DEFAULT_BUSINESS_ID);
}

async function resolveBusiness(phoneNumberId: string | null): Promise<BusinessRow | null> {
  const supabase = createServiceClient();

  async function loadBusinessById(businessId: string): Promise<BusinessRow | null> {
    const primary = await supabase
      .from('businesses')
      .select('id, business_name, business_type, system_prompt, whatsapp_phone_number_id, whatsapp')
      .eq('id', businessId)
      .maybeSingle();

    if (primary.error?.code === '42703') {
      const fallback = await supabase
        .from('businesses')
        .select('id, business_name, business_type, system_prompt, whatsapp')
        .eq('id', businessId)
        .maybeSingle();

      if (!fallback.data) {
        return null;
      }

      const withDefaults = fallback.data as Omit<BusinessRow, 'whatsapp_phone_number_id'>;
      return { ...withDefaults, whatsapp_phone_number_id: null };
    }

    return (primary.data as BusinessRow | null) || null;
  }

  if (phoneNumberId) {
    const lookup = await supabase
      .from('businesses')
      .select('id, business_name, business_type, system_prompt, whatsapp_phone_number_id, whatsapp')
      .eq('whatsapp_phone_number_id', phoneNumberId)
      .maybeSingle();

    if (lookup.error?.code === '42703') {
      return null;
    }

    if (lookup.data) {
      return lookup.data as BusinessRow;
    }
  }

  const fallbackBusinessId = getDefaultBusinessId();
  if (!fallbackBusinessId) {
    return null;
  }

  return loadBusinessById(fallbackBusinessId);
}

async function getBusinessById(businessId: string): Promise<BusinessRow | null> {
  const supabase = createServiceClient();
  const primary = await supabase
    .from('businesses')
    .select('id, business_name, business_type, system_prompt, whatsapp_phone_number_id, whatsapp')
    .eq('id', businessId)
    .maybeSingle();

  if (primary.error?.code === '42703') {
    const fallback = await supabase
      .from('businesses')
      .select('id, business_name, business_type, system_prompt, whatsapp')
      .eq('id', businessId)
      .maybeSingle();

    if (!fallback.data) {
      return null;
    }

    const withDefaults = fallback.data as Omit<BusinessRow, 'whatsapp_phone_number_id'>;
    return { ...withDefaults, whatsapp_phone_number_id: null };
  }

  return (primary.data as BusinessRow | null) || null;
}

async function hasProcessedInboundMessage(messageId: string): Promise<boolean> {
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from('whatsapp_message_events')
    .select('id')
    .eq('whatsapp_message_id', messageId)
    .maybeSingle();

  if (error?.code === '42P01') {
    return false;
  }

  return Boolean(data?.id);
}

async function insertMessageEvent(input: {
  businessId: string;
  sessionId: string;
  direction: 'inbound' | 'outbound';
  whatsappMessageId: string;
  fromNumber: string;
  toPhoneNumberId: string;
  bodyText: string;
  payload: unknown;
  deliveryStatus?: string;
  errorMessage?: string;
}) {
  const supabase = createServiceClient();
  const { error } = await supabase.from('whatsapp_message_events').insert({
    business_id: input.businessId,
    session_id: input.sessionId,
    direction: input.direction,
    whatsapp_message_id: input.whatsappMessageId,
    from_number: input.fromNumber,
    to_phone_number_id: input.toPhoneNumberId,
    body_text: input.bodyText,
    payload: input.payload,
    delivery_status: input.deliveryStatus || null,
    error_message: input.errorMessage || null,
  });

  if (error?.code === '42P01' || error?.code === '42703') {
    return;
  }
}

async function syncMessageDeliveryStatus(input: {
  phoneNumberId: string;
  messageId: string;
  status: string;
  recipientId: string | null;
  errorMessage: string | null;
  payload: unknown;
}) {
  const supabase = createServiceClient();

  const { data: updatedRows, error: updateError } = await supabase
    .from('whatsapp_message_events')
    .update({
      delivery_status: input.status,
      error_message: input.errorMessage,
      payload: input.payload,
    })
    .eq('whatsapp_message_id', input.messageId)
    .select('id');

  if (updateError?.code === '42P01') {
    return { ok: false as const, reason: 'missing_table' as const };
  }

  if (Array.isArray(updatedRows) && updatedRows.length > 0) {
    return { ok: true as const, mode: 'updated' as const };
  }

  const business = await resolveBusiness(input.phoneNumberId);
  if (!business) {
    return { ok: false as const, reason: 'business_not_found' as const };
  }

  const sessionId = input.recipientId ? `wa:${input.recipientId}` : `wa:unknown:${input.messageId}`;

  await insertMessageEvent({
    businessId: business.id,
    sessionId,
    direction: 'outbound',
    whatsappMessageId: input.messageId,
    fromNumber: input.phoneNumberId,
    toPhoneNumberId: input.phoneNumberId,
    bodyText: '',
    payload: input.payload,
    deliveryStatus: input.status,
    errorMessage: input.errorMessage || undefined,
  });

  return { ok: true as const, mode: 'inserted' as const };
}

async function upsertConversationWithMessage(input: {
  business: BusinessRow;
  sessionId: string;
  customerName: string | null;
  customerPhone: string;
  message: { role: 'user' | 'assistant'; content: string };
}): Promise<ConversationRow | null> {
  const supabase = createServiceClient();
  const { data: existing } = await supabase
    .from('conversations')
    .select('id, messages, customer_name, customer_phone')
    .eq('business_id', input.business.id)
    .eq('session_id', input.sessionId)
    .maybeSingle();

  const existingMessages = Array.isArray(existing?.messages) ? existing.messages : [];
  const updatedMessages = [...existingMessages, input.message];

  if (existing?.id) {
    const { data } = await supabase
      .from('conversations')
      .update({
        messages: updatedMessages,
        customer_name: input.customerName || existing.customer_name,
        customer_phone: input.customerPhone || existing.customer_phone,
        channel: 'whatsapp',
        external_contact_id: input.customerPhone,
      })
      .eq('id', existing.id)
      .select('id, messages, customer_name, customer_phone')
      .single();

    return (data as ConversationRow | null) || null;
  }

  const { data } = await supabase
    .from('conversations')
    .insert({
      business_id: input.business.id,
      session_id: input.sessionId,
      messages: [input.message],
      customer_name: input.customerName,
      customer_phone: input.customerPhone,
      channel: 'whatsapp',
      external_contact_id: input.customerPhone,
      lead_captured: Boolean(input.customerName && input.customerPhone),
    })
    .select('id, messages, customer_name, customer_phone')
    .single();

  return (data as ConversationRow | null) || null;
}

async function buildAssistantReply(input: {
  business: BusinessRow;
  history: Array<{ role: 'user' | 'assistant'; content: string }>;
}): Promise<string> {
  const openai = getOpenAIClient();

  const systemMessage =
    normalizeText(input.business.system_prompt) ||
    `${DEFAULT_SYSTEM_PROMPT}\nBusiness name: ${input.business.business_name || 'this business'}.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `${systemMessage}\n\nReply in the same language as the customer message.`,
      },
      ...input.history.slice(-12),
    ],
    max_tokens: 350,
    temperature: 0.5,
  });

  return normalizeText(response.choices[0]?.message?.content) || 'Thank you for your message. Our team will get back to you shortly.';
}

async function sendWhatsAppText(input: {
  phoneNumberId: string;
  to: string;
  body: string;
}): Promise<{ ok: boolean; messageId: string | null; error?: string }> {
  const accessToken = getAccessToken();
  if (!accessToken) {
    return { ok: false, messageId: null, error: 'missing_whatsapp_access_token' };
  }

  const graphVersion = getGraphApiVersion();
  const url = `https://graph.facebook.com/${graphVersion}/${input.phoneNumberId}/messages`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: input.to,
        text: { body: input.body },
      }),
    });

    const data = (await response.json().catch(() => ({}))) as {
      messages?: Array<{ id?: string }>;
      error?: { message?: string };
    };

    if (!response.ok) {
      return {
        ok: false,
        messageId: null,
        error: data?.error?.message || `whatsapp_send_failed_${response.status}`,
      };
    }

    return {
      ok: true,
      messageId: data.messages?.[0]?.id || null,
    };
  } catch {
    return {
      ok: false,
      messageId: null,
      error: 'whatsapp_send_request_failed',
    };
  }
}

async function processInboundMessage(input: {
  phoneNumberId: string;
  messageId: string;
  from: string;
  text: string;
  profileName: string | null;
  rawPayload: unknown;
}) {
  if (!input.text) {
    return { processed: false, reason: 'empty_text' as const };
  }

  if (await hasProcessedInboundMessage(input.messageId)) {
    return { processed: false, reason: 'duplicate' as const };
  }

  const business = await resolveBusiness(input.phoneNumberId);
  if (!business) {
    return { processed: false, reason: 'business_not_found' as const };
  }

  const sessionId = `wa:${input.from}`;

  await insertMessageEvent({
    businessId: business.id,
    sessionId,
    direction: 'inbound',
    whatsappMessageId: input.messageId,
    fromNumber: input.from,
    toPhoneNumberId: input.phoneNumberId,
    bodyText: input.text,
    payload: input.rawPayload,
    deliveryStatus: 'received',
  });

  const conversation = await upsertConversationWithMessage({
    business,
    sessionId,
    customerName: input.profileName,
    customerPhone: input.from,
    message: {
      role: 'user',
      content: input.text,
    },
  });

  const history = Array.isArray(conversation?.messages)
    ? conversation?.messages
    : [{ role: 'user', content: input.text } as { role: 'user' | 'assistant'; content: string }];

  let assistantText = '';
  try {
    assistantText = await buildAssistantReply({
      business,
      history,
    });
  } catch {
    assistantText = 'Thanks for reaching out. Our team has received your message and will reply shortly.';
  }

  await upsertConversationWithMessage({
    business,
    sessionId,
    customerName: input.profileName,
    customerPhone: input.from,
    message: {
      role: 'assistant',
      content: assistantText,
    },
  });

  const sendResult = await sendWhatsAppText({
    phoneNumberId: input.phoneNumberId,
    to: input.from,
    body: assistantText,
  });

  await insertMessageEvent({
    businessId: business.id,
    sessionId,
    direction: 'outbound',
    whatsappMessageId: sendResult.messageId || `outbound:${input.messageId}`,
    fromNumber: input.phoneNumberId,
    toPhoneNumberId: input.phoneNumberId,
    bodyText: assistantText,
    payload: {
      basedOnInboundMessageId: input.messageId,
    },
    deliveryStatus: sendResult.ok ? 'sent' : 'failed',
    errorMessage: sendResult.ok ? undefined : sendResult.error,
  });

  return {
    processed: true,
    businessId: business.id,
    sessionId,
    sent: sendResult.ok,
    sendError: sendResult.error,
  };
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const mode = params.get('hub.mode');
  const token = params.get('hub.verify_token');
  const challenge = params.get('hub.challenge');

  if (mode === 'subscribe' && token && challenge && token === getVerifyToken()) {
    return new NextResponse(challenge, { status: 200 });
  }

  return NextResponse.json({ error: 'Webhook verification failed' }, { status: 403 });
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      action?: string;
      businessId?: string;
      to?: string;
      phoneNumberId?: string;
      message?: string;
      entry?: Array<{
        changes?: Array<{
          value?: {
            metadata?: { phone_number_id?: string };
            contacts?: Array<{ wa_id?: string; profile?: { name?: string } }>;
            messages?: Array<{ id?: string; from?: string; type?: string; text?: { body?: string } }>;
            statuses?: Array<{
              id?: string;
              status?: string;
              recipient_id?: string;
              errors?: Array<{ title?: string; code?: number }>;
            }>;
          };
        }>;
      }>;
    };

    if (body.action === 'send_test') {
      const businessId = normalizeText(body.businessId);
      const to = normalizeText(body.to);
      const customPhoneNumberId = normalizeText(body.phoneNumberId);
      const messageText = normalizeText(body.message) || 'Test from CypAI dashboard. If you received this, WhatsApp sync is working.';

      if (!businessId || !to) {
        return NextResponse.json({ ok: false, error: 'businessId and to are required' }, { status: 400 });
      }

      const business = await getBusinessById(businessId);
      if (!business) {
        return NextResponse.json({ ok: false, error: 'business_not_found' }, { status: 404 });
      }

      const phoneNumberId = customPhoneNumberId || normalizeText(business.whatsapp_phone_number_id);
      if (!phoneNumberId) {
        return NextResponse.json({ ok: false, error: 'missing_whatsapp_phone_number_id', details: 'Set whatsapp_phone_number_id for this business first.' }, { status: 400 });
      }

      const sendResult = await sendWhatsAppText({
        phoneNumberId,
        to,
        body: messageText,
      });

      const sessionId = `wa:${to}`;

      await upsertConversationWithMessage({
        business,
        sessionId,
        customerName: null,
        customerPhone: to,
        message: {
          role: 'assistant',
          content: messageText,
        },
      });

      await insertMessageEvent({
        businessId,
        sessionId,
        direction: 'outbound',
        whatsappMessageId: sendResult.messageId || `test:${Date.now()}`,
        fromNumber: phoneNumberId,
        toPhoneNumberId: phoneNumberId,
        bodyText: messageText,
        payload: {
          action: 'send_test',
          to,
        },
        deliveryStatus: sendResult.ok ? 'sent' : 'failed',
        errorMessage: sendResult.ok ? undefined : sendResult.error,
      });

      return NextResponse.json({
        ok: true,
        sent: sendResult.ok,
        details: sendResult.error || null,
        messageId: sendResult.messageId,
      });
    }

    const outcomes: Array<Record<string, unknown>> = [];

    for (const entry of body.entry || []) {
      for (const change of entry.changes || []) {
        const value = change.value;
        const phoneNumberId = normalizeText(value?.metadata?.phone_number_id);
        const messages = value?.messages || [];
        const statuses = value?.statuses || [];

        for (const message of messages) {
          if (message.type !== 'text') {
            continue;
          }

          const inboundFrom = normalizeText(message.from);
          const inboundId = normalizeText(message.id);
          const inboundText = normalizeText(message.text?.body);

          if (!phoneNumberId || !inboundFrom || !inboundId) {
            continue;
          }

          const contact = (value?.contacts || []).find((item) => normalizeText(item.wa_id) === inboundFrom);
          const profileName = normalizeText(contact?.profile?.name) || null;

          const result = await processInboundMessage({
            phoneNumberId,
            messageId: inboundId,
            from: inboundFrom,
            text: inboundText,
            profileName,
            rawPayload: {
              entry,
              change,
              message,
            },
          });

          outcomes.push({
            phoneNumberId,
            from: inboundFrom,
            messageId: inboundId,
            ...result,
          });
        }

        for (const status of statuses) {
          const statusMessageId = normalizeText(status.id);
          const deliveryStatus = normalizeText(status.status) || 'unknown';
          const recipientId = normalizeText(status.recipient_id) || null;
          const firstError = Array.isArray(status.errors) && status.errors.length > 0 ? status.errors[0] : null;
          const errorMessage = firstError
            ? `${normalizeText(firstError.title) || 'delivery_error'}${typeof firstError.code === 'number' ? `:${firstError.code}` : ''}`
            : null;

          if (!phoneNumberId || !statusMessageId) {
            continue;
          }

          const statusResult = await syncMessageDeliveryStatus({
            phoneNumberId,
            messageId: statusMessageId,
            status: deliveryStatus,
            recipientId,
            errorMessage,
            payload: {
              entry,
              change,
              status,
            },
          });

          outcomes.push({
            phoneNumberId,
            messageId: statusMessageId,
            deliveryStatus,
            statusSync: statusResult,
          });
        }
      }
    }

    return NextResponse.json({ ok: true, outcomes });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
