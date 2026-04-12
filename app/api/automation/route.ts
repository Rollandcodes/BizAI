import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import {
  AlertLogDateRange,
  buildAlertLogsCsv,
  dispatchFailureSpikeAlert,
  getAlertLogsPage,
  logAlertDispatch,
} from './services/alerts';
import { buildTrendOverview, parseAlertLogFilters } from './services/analytics';
import {
  AlertPolicy,
  AutomationEventType,
  DEFAULT_ALERT_POLICY,
  DEFAULT_RETRY_POLICY,
  getAlertPolicy,
  getRetryPoliciesMap,
  getRetryPolicy,
  saveAlertPolicy,
  saveRetryPolicy,
  touchLastAlertAt,
} from './services/policy';
import {
  buildRecoveryTemplate,
  insertQueueRecord,
  retryFailedAutomation,
  retryFailedAutomationBatch,
  sendRecoveryEmail,
  updateQueueDelivery,
} from './services/retry';

function hasSupabaseConfig() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

type AutomationPayload = {
  eventType?: AutomationEventType;
  action?:
    | 'retry_failed'
    | 'retry_failed_batch'
    | 'get_retry_policy'
    | 'set_retry_policy'
    | 'get_alert_policy'
    | 'set_alert_policy'
    | 'test_alert';
  queueId?: string;
  limit?: number;
  maxRetries?: number;
  retryWindowHours?: number;
  failureRateThreshold?: number;
  minAttempts?: number;
  cooldownMinutes?: number;
  webhookUrl?: string;
  alertEmail?: string;
  planId?: string;
  email?: string;
  businessName?: string;
  yourName?: string;
  businessType?: string;
  source?: string;
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

function buildDedupeKey(eventType: AutomationEventType, email: string | null, planId: string | null): string {
  const windowStart = new Date();
  windowStart.setMinutes(0, 0, 0);
  return `${eventType}:${email ?? 'unknown'}:${planId ?? 'none'}:${windowStart.toISOString()}`;
}

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as AutomationPayload;

    if (payload.action === 'get_alert_policy') {
      const policy = await getAlertPolicy();
      return NextResponse.json({ ok: true, policy });
    }

    if (payload.action === 'set_alert_policy') {
      const failureRateThreshold = normalizePositiveInt(payload.failureRateThreshold, DEFAULT_ALERT_POLICY.failureRateThreshold, 1, 100);
      const minAttempts = normalizePositiveInt(payload.minAttempts, DEFAULT_ALERT_POLICY.minAttempts, 1, 1000);
      const cooldownMinutes = normalizePositiveInt(payload.cooldownMinutes, DEFAULT_ALERT_POLICY.cooldownMinutes, 1, 1440);

      const saveResult = await saveAlertPolicy({
        failureRateThreshold,
        minAttempts,
        cooldownMinutes,
        alertEmail: payload.alertEmail,
        webhookUrl: payload.webhookUrl,
      });

      if (!saveResult.ok) {
        return NextResponse.json({ error: saveResult.error }, { status: saveResult.status });
      }

      const policy = await getAlertPolicy();
      return NextResponse.json({ ok: true, action: 'set_alert_policy', policy });
    }

    if (payload.action === 'test_alert') {
      const testEventScope = payload.eventType ? toEventType(payload.eventType) : null;
      const testTrend = { sent: 0, failed: 1, queued: 0 };
      const dispatchResult = await dispatchFailureSpikeAlert({
        failureRate: 100,
        attempts: 1,
        trend: testTrend,
        filter: testEventScope,
      });

      await logAlertDispatch({
        triggeredBy: 'manual_test',
        eventScope: testEventScope,
        failureRate: 100,
        attempts: 1,
        dispatch: dispatchResult,
        trend: testTrend,
      });

      if (dispatchResult.sentEmail || dispatchResult.sentWebhook) {
        await touchLastAlertAt();
      }

      return NextResponse.json({
        ok: true,
        action: 'test_alert',
        result: dispatchResult,
      });
    }

    if (payload.action === 'get_retry_policy') {
      const policy = await getRetryPolicy(payload.eventType ? toEventType(payload.eventType) : null);
      return NextResponse.json({ ok: true, policy });
    }

    if (payload.action === 'set_retry_policy') {
      const maxRetries = normalizePositiveInt(payload.maxRetries, DEFAULT_RETRY_POLICY.maxRetries, 1, 10);
      const retryWindowHours = normalizePositiveInt(payload.retryWindowHours, DEFAULT_RETRY_POLICY.retryWindowHours, 1, 168);
      const eventType = payload.eventType ? toEventType(payload.eventType) : null;

      const saveResult = await saveRetryPolicy(maxRetries, retryWindowHours, eventType);
      if (!saveResult.ok) {
        return NextResponse.json({ error: saveResult.error }, { status: saveResult.status });
      }

      return NextResponse.json({
        ok: true,
        action: 'set_retry_policy',
        eventType,
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
    const queuePayload = businessName ? { businessName } : {};

    const insertResult = await insertQueueRecord({
      event_type: eventType,
      dedupe_key: dedupeKey,
      recipient_email: recipientEmail,
      plan_id: planId,
      payload: queuePayload,
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
  if (!hasSupabaseConfig()) {
    return NextResponse.json({
      message: 'CypAI automation endpoint',
      status: 'ready',
      queue: 'disabled_no_supabase_config',
      hint: 'Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to enable analytics and retry data',
      method: 'POST required',
      summary: { total: 0, queued: 0, sent: 0, failed: 0 },
      trend: { windowDays: 7, sent: 0, failed: 0, queued: 0, successRate: 0 },
      policy: DEFAULT_RETRY_POLICY,
      policies: {
        default: DEFAULT_RETRY_POLICY,
        abandoned_signup: DEFAULT_RETRY_POLICY,
        abandoned_payment: DEFAULT_RETRY_POLICY,
      },
      alertPolicy: DEFAULT_ALERT_POLICY,
      alertLogs: [],
      alertLogsMeta: {
        page: 1,
        pageSize: 10,
        total: 0,
        totalPages: 1,
        trigger: 'all',
        outcome: 'all',
        from: null,
        to: null,
      },
      alertState: {
        attempts: 0,
        failureRate: 0,
        thresholdMet: false,
        cooldownActive: false,
        lastAlertAt: null,
        alertTriggered: false,
        reason: 'no_supabase_config',
        dispatch: null,
      },
      timeline: [],
      recent: [],
    });
  }

  const supabase = createServerClient();
  const alertPolicy: AlertPolicy = await getAlertPolicy();
  const policies = await getRetryPoliciesMap();
  const eventTypeFilter = toEventType(request.nextUrl.searchParams.get('eventType'));
  const alertLogFilters = parseAlertLogFilters(request.nextUrl.searchParams);

  if (alertLogFilters.exportCsv) {
    const alertLogsPage = await getAlertLogsPage({
      trigger: alertLogFilters.trigger,
      outcome: alertLogFilters.outcome,
      dateRange: alertLogFilters.dateRange,
      page: 1,
      pageSize: 5000,
    });

    const csv = buildAlertLogsCsv(alertLogsPage.records);
    const dateSuffix = new Date().toISOString().slice(0, 10);
    const fileName = `cypai-alert-logs-${alertLogFilters.trigger}-${alertLogFilters.outcome}-${dateSuffix}.csv`;

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${fileName}"`,
      },
    });
  }

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

  const { trend, attempts, failureRate, timeline } = buildTrendOverview(
    (trendData || []) as Array<{ status: string | null; created_at: string | null }>
  );

  const lastAlertAtMs = Date.parse(alertPolicy.lastAlertAt || '');
  const cooldownMs = alertPolicy.cooldownMinutes * 60 * 1000;
  const cooldownActive = Number.isFinite(lastAlertAtMs) ? Date.now() - lastAlertAtMs < cooldownMs : false;
  const thresholdMet = attempts >= alertPolicy.minAttempts && failureRate >= alertPolicy.failureRateThreshold;

  let alertTriggered = false;
  let alertDispatch: Awaited<ReturnType<typeof dispatchFailureSpikeAlert>> | null = null;
  let alertReason = 'below_threshold_or_filtered';

  if (!eventTypeFilter && thresholdMet && !cooldownActive) {
    alertDispatch = await dispatchFailureSpikeAlert({
      failureRate,
      attempts,
      trend,
      filter: null,
    });

    if (alertDispatch.sentEmail || alertDispatch.sentWebhook) {
      await touchLastAlertAt();
      alertTriggered = true;
      alertReason = 'alert_dispatched';
    } else {
      alertReason = alertDispatch.error || 'no_destinations_configured';
    }
  } else if (cooldownActive) {
    alertReason = 'cooldown_active';
  } else if (eventTypeFilter) {
    alertReason = 'filtered_view_no_dispatch';
   }

  if (alertDispatch) {
     await logAlertDispatch({
       triggeredBy: 'automatic',
       eventScope: null,
       failureRate,
       attempts,
       dispatch: alertDispatch,
       trend,
     });
   }
 
   const alertLogsPage = await getAlertLogsPage({
     trigger: alertLogFilters.trigger,
    outcome: alertLogFilters.outcome,
      dateRange: alertLogFilters.dateRange,
     page: alertLogFilters.page,
     pageSize: alertLogFilters.pageSize,
   });
 
  return NextResponse.json({
     alertState: {
       attempts,
       failureRate,
       thresholdMet,
       cooldownActive,
       lastAlertAt: alertTriggered ? new Date().toISOString() : alertPolicy.lastAlertAt,
       alertTriggered,
       reason: alertReason,
       dispatch: alertDispatch,
     },
     timeline,
     recent: data || [],
   });
 }
