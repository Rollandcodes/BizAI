import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

type AutomationEventType = 'abandoned_signup' | 'abandoned_payment';

type AutomationPayload = {
  eventType?: AutomationEventType;
  action?: 'retry_failed' | 'retry_failed_batch' | 'get_retry_policy' | 'set_retry_policy';
  queueId?: string;
  limit?: number;
  maxRetries?: number;
  retryWindowHours?: number;
  planId?: string;
  email?: string;
  businessName?: string;
  yourName?: string;
  businessType?: string;
  source?: string;
};

type RetryPolicy = {
  maxRetries: number;
  retryWindowHours: number;
};

const DEFAULT_RETRY_POLICY: RetryPolicy = {
  maxRetries: 3,
  retryWindowHours: 72,
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

function normalizeEmail(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const email = value.trim().toLowerCase();
  return email.length > 0 ? email : null;
}

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

function normalizePositiveInt(value: unknown, fallback: number, min: number, max: number): number {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return fallback;
  }

  return Math.min(max, Math.max(min, Math.floor(value)));
}

async function getRetryPolicy(): Promise<RetryPolicy> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('marketing_automation_policy')
    .select('max_retries, retry_window_hours')
    .eq('id', 'default')
    .single();

  if (error?.code === '42P01' || error?.code === 'PGRST116') {
    return DEFAULT_RETRY_POLICY;
  }

  if (error || !data) {
    return DEFAULT_RETRY_POLICY;
  }

  return {
    maxRetries: Number(data.max_retries || DEFAULT_RETRY_POLICY.maxRetries),
    retryWindowHours: Number(data.retry_window_hours || DEFAULT_RETRY_POLICY.retryWindowHours),
  };
}

async function saveRetryPolicy(maxRetries: number, retryWindowHours: number) {
  const supabase = createServerClient();
  const { error } = await supabase.from('marketing_automation_policy').upsert(
    {
      id: 'default',
      max_retries: maxRetries,
      retry_window_hours: retryWindowHours,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'id' }
  );

  if (error?.code === '42P01') {
    return { ok: false as const, status: 400 as const, error: 'marketing_automation_policy table missing. Run latest supabase-schema.sql.' };
  }

  if (error) {
    return { ok: false as const, status: 500 as const, error: error.message };
  }

  return { ok: true as const };
}

function isRetryWindowExpired(createdAt: string | null | undefined, retryWindowHours: number): boolean {
  const createdAtMs = Date.parse(createdAt || '');
  if (!Number.isFinite(createdAtMs)) {
    return false;
  }

  const retryWindowMs = retryWindowHours * 60 * 60 * 1000;
  return Date.now() - createdAtMs > retryWindowMs;
}

function buildDedupeKey(eventType: AutomationEventType, email: string | null, planId: string | null): string {
  const windowStart = new Date();
  windowStart.setMinutes(0, 0, 0);
  return `${eventType}:${email ?? 'unknown'}:${planId ?? 'none'}:${windowStart.toISOString()}`;
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

function buildRecoveryTemplate(input: {
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

async function insertQueueRecord(input: QueueInsertInput) {
  const supabase = createServerClient();

  const extendedInsert = await supabase.from('marketing_automation_queue').insert({
    ...input,
    email_subject: input.email_subject,
    email_body: input.email_body,
  });

  if (!extendedInsert.error) {
    return { error: null as null | { code?: string; message: string } };
  }

  // Backward compatibility if migration for email_subject/email_body has not run yet.
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

async function updateQueueDelivery(
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

  // Backward compatibility if migration for provider_message_id/last_error has not run yet.
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

async function retryFailedAutomation(queueId: string) {
  const policy = await getRetryPolicy();
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
  const eventType = toEventType(data.event_type);
  if (!eventType) {
    return { ok: false, status: 400 as const, error: 'Unsupported event_type for retry' };
  }

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

async function retryFailedAutomationBatch(limit: number, eventType: AutomationEventType | null) {
  const policy = await getRetryPolicy();
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

  const queueIds = (data || [])
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

async function sendRecoveryEmail(input: {
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

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as AutomationPayload;
    if (payload.action === 'get_retry_policy') {
      const policy = await getRetryPolicy();
      return NextResponse.json({ ok: true, policy });
    }

    if (payload.action === 'set_retry_policy') {
      const maxRetries = normalizePositiveInt(payload.maxRetries, DEFAULT_RETRY_POLICY.maxRetries, 1, 10);
      const retryWindowHours = normalizePositiveInt(payload.retryWindowHours, DEFAULT_RETRY_POLICY.retryWindowHours, 1, 168);

      const saveResult = await saveRetryPolicy(maxRetries, retryWindowHours);
      if (!saveResult.ok) {
        return NextResponse.json({ error: saveResult.error }, { status: saveResult.status });
      }

      return NextResponse.json({
        ok: true,
        action: 'set_retry_policy',
        policy: { maxRetries, retryWindowHours },
      });
    }

    if (payload.action === 'retry_failed_batch') {
      const rawLimit = typeof payload.limit === 'number' ? payload.limit : 5;
      const batchLimit = Math.min(20, Math.max(1, Math.floor(rawLimit)));
      const eventTypeFilter = payload.eventType ? toEventType(payload.eventType) : null;

      const batchResult = await retryFailedAutomationBatch(batchLimit, eventTypeFilter);
      if (!batchResult.ok) {
        return NextResponse.json({ error: batchResult.error }, { status: batchResult.status });
      }

      return NextResponse.json({
        ok: true,
        action: 'retry_failed_batch',
        attempted: batchResult.attempted,
        sent: batchResult.sent,
        failed: batchResult.failed,
        eventType: eventTypeFilter,
      });
    }

    if (payload.action === 'retry_failed') {
      const queueId = normalizeString(payload.queueId);
      if (!queueId) {
        return NextResponse.json({ error: 'queueId is required for retry_failed' }, { status: 400 });
      }

      const retryResult = await retryFailedAutomation(queueId);
      if (!retryResult.ok) {
        return NextResponse.json({ error: retryResult.error }, { status: retryResult.status });
      }

      return NextResponse.json({
        ok: true,
        action: 'retry_failed',
        sent: retryResult.sent,
        reason: retryResult.reason,
        details: retryResult.details,
      });
    }

    const eventType = toEventType(payload.eventType);

    if (!eventType) {
      return NextResponse.json({ error: 'Invalid eventType' }, { status: 400 });
    }

    const recipientEmail = normalizeEmail(payload.email);
    const planId = normalizeString(payload.planId);
    const businessName = normalizeString(payload.businessName);
    const dedupeKey = buildDedupeKey(eventType, recipientEmail, planId);
    const template = buildRecoveryTemplate({ eventType, planId, businessName });

    const insertResult = await insertQueueRecord({
      event_type: eventType,
      dedupe_key: dedupeKey,
      recipient_email: recipientEmail,
      plan_id: planId,
      payload,
      status: 'queued',
      email_subject: template.subject,
      email_body: template.body,
    });
    const error = insertResult.error;

    if (error && error.code !== '23505' && error.code !== '42P01') {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const duplicate = error?.code === '23505';
    const tableMissing = error?.code === '42P01';

    let emailResult: { sent: boolean; reason?: string; details?: string; providerMessageId?: string | null } = {
      sent: false,
      reason: 'skipped_no_email',
    };
    if (!duplicate && !tableMissing && recipientEmail) {
      emailResult = await sendRecoveryEmail({
        subject: template.subject,
        body: template.body,
        recipientEmail,
      });

      if (emailResult.sent) {
        await updateQueueDelivery(dedupeKey, {
          status: 'sent',
          providerMessageId: emailResult.providerMessageId || undefined,
        });
      } else {
        await updateQueueDelivery(dedupeKey, {
          status: 'failed',
          errorMessage: emailResult.reason,
        });
      }
    }

    return NextResponse.json({
      ok: true,
      queued: !tableMissing,
      duplicate,
      template: {
        subject: template.subject,
        ctaUrl: template.ctaUrl,
      },
      email: emailResult,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const supabase = createServerClient();
  const policy = await getRetryPolicy();
  const eventTypeFilter = toEventType(request.nextUrl.searchParams.get('eventType'));
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  let recentQuery = supabase
    .from('marketing_automation_queue')
    .select('id, event_type, status, recipient_email, created_at, processed_at, last_error, retry_count');

  if (eventTypeFilter) {
    recentQuery = recentQuery.eq('event_type', eventTypeFilter);
  }

  const { data, error } = await recentQuery.order('created_at', { ascending: false }).limit(25);

  let trendQuery = supabase
    .from('marketing_automation_queue')
    .select('status, created_at')
    .gte('created_at', sevenDaysAgo);

  if (eventTypeFilter) {
    trendQuery = trendQuery.eq('event_type', eventTypeFilter);
  }

  const { data: trendData, error: trendError } = await trendQuery.order('created_at', { ascending: false }).limit(1000);

  if (error?.code === '42P01') {
    return NextResponse.json({
      message: 'CypAI automation endpoint',
      status: 'ready',
      queue: 'missing_table',
      hint: 'Run supabase-schema.sql to create marketing_automation_queue',
      method: 'POST required',
    });
  }

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (trendError && trendError.code !== '42P01') {
    return NextResponse.json({ error: trendError.message }, { status: 500 });
  }

  const summary = {
    total: data?.length || 0,
    queued: 0,
    sent: 0,
    failed: 0,
  };

  for (const row of data || []) {
    if (row.status === 'queued') summary.queued += 1;
    if (row.status === 'sent') summary.sent += 1;
    if (row.status === 'failed') summary.failed += 1;
  }

  const trend = {
    windowDays: 7,
    sent: 0,
    failed: 0,
    queued: 0,
    successRate: 0,
  };

  const timelineMap = new Map<string, { day: string; sent: number; failed: number; queued: number; total: number }>();
  for (let i = 6; i >= 0; i -= 1) {
    const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    const dayKey = date.toISOString().slice(0, 10);
    timelineMap.set(dayKey, {
      day: dayKey,
      sent: 0,
      failed: 0,
      queued: 0,
      total: 0,
    });
  }

  for (const row of trendData || []) {
    if (row.status === 'queued') trend.queued += 1;
    if (row.status === 'sent') trend.sent += 1;
    if (row.status === 'failed') trend.failed += 1;

    const dayKey = typeof row.created_at === 'string' ? row.created_at.slice(0, 10) : '';
    const dayEntry = timelineMap.get(dayKey);
    if (dayEntry) {
      if (row.status === 'queued') dayEntry.queued += 1;
      if (row.status === 'sent') dayEntry.sent += 1;
      if (row.status === 'failed') dayEntry.failed += 1;
      dayEntry.total += 1;
    }
  }

  const attempts = trend.sent + trend.failed;
  trend.successRate = attempts > 0 ? Number(((trend.sent / attempts) * 100).toFixed(1)) : 0;

  return NextResponse.json({
    message: 'CypAI automation endpoint',
    status: 'ready',
    method: 'POST required',
    filter: {
      eventType: eventTypeFilter,
    },
    summary,
    trend,
    policy,
    timeline: Array.from(timelineMap.values()),
    recent: data || [],
  });
}
