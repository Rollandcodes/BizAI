import { createServerClient } from '@/lib/supabase';
import { AutomationEventType, getRetryPolicy } from './policy';

type AutomationPayload = {
  businessName?: string;
};

type QueueInsertInput = {
  event_type: AutomationEventType;
  dedupe_key: string;
  recipient_email: string | null;
  plan_id: string | null;
  payload: AutomationPayload;
  status: 'queued' | 'sent' | 'failed';
  email_subject?: string;
  email_body?: string;
};

function normalizeString(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const text = value.trim();
  return text.length > 0 ? text : null;
}

function toEventType(value: unknown): AutomationEventType | null {
  if (value === 'abandoned_signup' || value === 'abandoned_payment') {
    return value;
  }
  return null;
}

function isRetryWindowExpired(createdAt: string | null | undefined, retryWindowHours: number): boolean {
  const createdAtMs = Date.parse(createdAt || '');
  if (!Number.isFinite(createdAtMs)) {
    return false;
  }

  const retryWindowMs = retryWindowHours * 60 * 60 * 1000;
  return Date.now() - createdAtMs > retryWindowMs;
}

function getPlanLabel(planId: string | null): string {
  switch ((planId || '').toLowerCase()) {
    case 'starter':
    case 'basic':
      return 'Starter';
    case 'business':
      return 'Business';
    case 'pro':
    default:
      return 'Pro';
  }
}

export function buildRecoveryTemplate(input: {
  eventType: AutomationEventType;
  planId: string | null;
  businessName: string | null;
}) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.cypai.app';
  const safePlanId = input.planId || 'pro';
  const planLabel = getPlanLabel(input.planId);
  const name = input.businessName || 'your business';

  const ctaUrl =
    input.eventType === 'abandoned_signup'
      ? `${appUrl}/signup?plan=${encodeURIComponent(safePlanId)}`
      : `${appUrl}/payment?plan=${encodeURIComponent(safePlanId)}`;

  if (input.eventType === 'abandoned_signup') {
    return {
      subject: `Finish setting up CypAI for ${name}`,
      body: `Hi,\n\nYou were just a step away from activating CypAI ${planLabel}.\n\nComplete your setup: ${ctaUrl}\n\nIf you need help, reply to this email and our team will assist you.\n\n- CypAI Team`,
      ctaUrl,
    };
  }

  return {
    subject: `Your CypAI ${planLabel} checkout is waiting`,
    body: `Hi,\n\nYour CypAI checkout for ${name} is still open.\n\nComplete payment: ${ctaUrl}\n\nIf you need help, reply to this email and our team will assist you.\n\n- CypAI Team`,
    ctaUrl,
  };
}

export async function sendRecoveryEmail(input: {
  subject: string;
  body: string;
  recipientEmail: string;
}) {
  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    return { sent: false, reason: 'missing_resend_api_key' };
  }

  const from = process.env.RESEND_FROM_EMAIL || 'CypAI <noreply@cypai.app>';

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [input.recipientEmail],
      subject: input.subject,
      text: input.body,
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    return { sent: false, reason: `resend_error:${response.status}`, details };
  }

  const data = (await response.json()) as { id?: string };

  return { sent: true, providerMessageId: data.id || null };
}

export async function insertQueueRecord(input: QueueInsertInput) {
  const supabase = createServerClient();

  const extendedInsert = await supabase.from('marketing_automation_queue').insert({
    ...input,
    email_subject: input.email_subject,
    email_body: input.email_body,
  });

  if (!extendedInsert.error) {
    return { error: null as null | { code?: string; message: string } };
  }

  if (extendedInsert.error.code === '42703') {
    const fallbackInsert = await supabase.from('marketing_automation_queue').insert({
      event_type: input.event_type,
      dedupe_key: input.dedupe_key,
      recipient_email: input.recipient_email,
      plan_id: input.plan_id,
      payload: input.payload,
      status: input.status,
    });

    return { error: fallbackInsert.error ? { code: fallbackInsert.error.code, message: fallbackInsert.error.message } : null };
  }

  return { error: { code: extendedInsert.error.code, message: extendedInsert.error.message } };
}

export async function updateQueueDelivery(
  dedupeKey: string,
  update: {
    status: 'sent' | 'failed';
    providerMessageId?: string;
    errorMessage?: string;
  }
) {
  const supabase = createServerClient();
  const payload = {
    status: update.status,
    processed_at: new Date().toISOString(),
    provider_message_id: update.providerMessageId || null,
    last_error: update.errorMessage || null,
  };

  const res = await supabase.from('marketing_automation_queue').update(payload).eq('dedupe_key', dedupeKey);

  if (res.error?.code === '42703') {
    await supabase
      .from('marketing_automation_queue')
      .update({
        status: update.status,
        processed_at: new Date().toISOString(),
      })
      .eq('dedupe_key', dedupeKey);
  }
}

async function updateQueueDeliveryById(
  queueId: string,
  update: {
    status: 'sent' | 'failed';
    providerMessageId?: string;
    errorMessage?: string;
    incrementRetryCount?: boolean;
  }
) {
  const supabase = createServerClient();
  const processedAt = new Date().toISOString();
  const payload = {
    status: update.status,
    processed_at: processedAt,
    provider_message_id: update.providerMessageId || null,
    last_error: update.errorMessage || null,
  };

  let res = await supabase.from('marketing_automation_queue').update(payload).eq('id', queueId);

  if (res.error?.code === '42703') {
    res = await supabase
      .from('marketing_automation_queue')
      .update({
        status: update.status,
        processed_at: processedAt,
      })
      .eq('id', queueId);
  }

  if (!res.error && update.incrementRetryCount) {
    const { data: currentRow } = await supabase
      .from('marketing_automation_queue')
      .select('retry_count')
      .eq('id', queueId)
      .single();

    const currentRetryCount =
      currentRow && typeof currentRow === 'object' && 'retry_count' in currentRow
        ? Number((currentRow as { retry_count?: number | null }).retry_count || 0)
        : 0;

    await supabase
      .from('marketing_automation_queue')
      .update({ retry_count: currentRetryCount + 1 })
      .eq('id', queueId);
  }
}

export async function retryFailedAutomation(queueId: string) {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('marketing_automation_queue')
    .select('id, event_type, recipient_email, plan_id, payload, status, email_subject, email_body, retry_count, created_at')
    .eq('id', queueId)
    .single();

  if (error) {
    return { ok: false, status: 404 as const, error: error.message };
  }

  if (!data || data.status !== 'failed') {
    return { ok: false, status: 400 as const, error: 'Only failed automation records can be retried' };
  }

  const eventType = toEventType(data.event_type);
  if (!eventType) {
    return { ok: false, status: 400 as const, error: 'Unsupported event_type for retry' };
  }

  const policy = await getRetryPolicy(eventType);

  const retryCount = Number(data.retry_count || 0);
  if (retryCount >= policy.maxRetries) {
    return {
      ok: false,
      status: 400 as const,
      error: `Retry limit reached (${policy.maxRetries}) for this record`,
    };
  }

  if (isRetryWindowExpired(data.created_at, policy.retryWindowHours)) {
    return {
      ok: false,
      status: 400 as const,
      error: `Retry window expired (${policy.retryWindowHours}h) for this record`,
    };
  }

  if (!data.recipient_email) {
    return { ok: false, status: 400 as const, error: 'Record has no recipient_email to retry' };
  }

  const payload = (data.payload || {}) as AutomationPayload;

  const fallbackTemplate = buildRecoveryTemplate({
    eventType,
    planId: normalizeString(data.plan_id),
    businessName: normalizeString(payload.businessName),
  });

  const subject = normalizeString(data.email_subject) || fallbackTemplate.subject;
  const body = normalizeString(data.email_body) || fallbackTemplate.body;

  const emailResult = await sendRecoveryEmail({
    subject,
    body,
    recipientEmail: data.recipient_email,
  });

  if (emailResult.sent) {
    await updateQueueDeliveryById(queueId, {
      status: 'sent',
      providerMessageId: emailResult.providerMessageId || undefined,
      incrementRetryCount: true,
    });

    return { ok: true, status: 200 as const, sent: true };
  }

  await updateQueueDeliveryById(queueId, {
    status: 'failed',
    errorMessage: emailResult.reason,
    incrementRetryCount: true,
  });

  return {
    ok: true,
    status: 200 as const,
    sent: false,
    reason: emailResult.reason,
    details: emailResult.details,
  };
}

export async function retryFailedAutomationBatch(limit: number, eventType: AutomationEventType | null) {
  const supabase = createServerClient();
  let query = supabase
    .from('marketing_automation_queue')
    .select('id, retry_count, created_at')
    .eq('status', 'failed')
    .order('created_at', { ascending: true })
    .limit(limit);

  if (eventType) {
    query = query.eq('event_type', eventType);
  }

  const { data, error } = await query;
  if (error) {
    return { ok: false, status: 500 as const, error: error.message };
  }

  let queueIds = (data || []).map((row) => row.id as string).filter(Boolean);
  if (eventType) {
    const policy = await getRetryPolicy(eventType);
    queueIds = (data || [])
      .filter((row) => {
        const retryCount = Number((row as { retry_count?: number | null }).retry_count || 0);
        if (retryCount >= policy.maxRetries) {
          return false;
        }

        const createdAt = (row as { created_at?: string | null }).created_at;
        return !isRetryWindowExpired(createdAt, policy.retryWindowHours);
      })
      .map((row) => row.id as string)
      .filter(Boolean);
  }
  let sent = 0;
  let failed = 0;

  for (const id of queueIds) {
    const retryResult = await retryFailedAutomation(id);
    if (retryResult.ok && retryResult.sent) {
      sent += 1;
    } else {
      failed += 1;
    }
  }

  return {
    ok: true,
    status: 200 as const,
    attempted: queueIds.length,
    sent,
    failed,
  };
}
