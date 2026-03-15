import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

type AutomationEventType = 'abandoned_signup' | 'abandoned_payment';

type AutomationPayload = {
  eventType?: AutomationEventType;
  planId?: string;
  email?: string;
  businessName?: string;
  yourName?: string;
  businessType?: string;
  source?: string;
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
          providerMessageId: emailResult.providerMessageId || null,
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

export async function GET() {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('marketing_automation_queue')
    .select('event_type, status, recipient_email, created_at, processed_at, last_error')
    .order('created_at', { ascending: false })
    .limit(25);

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

  return NextResponse.json({
    message: 'CypAI automation endpoint',
    status: 'ready',
    method: 'POST required',
    summary,
    recent: data || [],
  });
}
