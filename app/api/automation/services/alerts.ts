import { createServerClient } from '@/lib/supabase';
import { CYPAI_WEBHOOK_SIGNATURE_VERSION, signCypaiWebhookPayload } from '@/lib/webhookSignature';
import { AutomationEventType, getAlertDestinations } from './policy';

export type AlertDispatchResult = {
  sentWebhook: boolean;
  sentEmail: boolean;
  webhookProvider?: 'slack' | 'discord' | 'generic';
  signedWebhook?: boolean;
  error?: string;
};

export type AlertLogRecord = {
  id: string;
  triggered_by: 'automatic' | 'manual_test';
  event_scope: string;
  failure_rate: number;
  attempts: number;
  sent_webhook: boolean;
  sent_email: boolean;
  webhook_provider: string | null;
  signed_webhook: boolean;
  dispatch_error: string | null;
  created_at: string;
};

export type AlertLogTriggerFilter = 'all' | 'automatic' | 'manual_test';
export type AlertLogOutcomeFilter = 'all' | 'success' | 'failed';

export type AlertLogsPage = {
  records: AlertLogRecord[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type AlertLogDateRange = {
  from: string | null;
  to: string | null;
};

function csvEscape(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

export function buildAlertLogsCsv(records: AlertLogRecord[]): string {
  const header = [
    'Created At',
    'Trigger',
    'Scope',
    'Failure Rate',
    'Attempts',
    'Sent Webhook',
    'Sent Email',
    'Webhook Provider',
    'Signed Webhook',
    'Dispatch Error',
  ]
    .map(csvEscape)
    .join(',');

  const rows = records.map((record) =>
    [
      record.created_at,
      record.triggered_by,
      record.event_scope,
      String(record.failure_rate),
      String(record.attempts),
      String(record.sent_webhook),
      String(record.sent_email),
      record.webhook_provider || '',
      String(record.signed_webhook),
      record.dispatch_error || '',
    ]
      .map((value) => csvEscape(value))
      .join(',')
  );

  return [header, ...rows].join('\n');
}

export async function dispatchFailureSpikeAlert(input: {
  failureRate: number;
  attempts: number;
  trend: { sent: number; failed: number; queued: number };
  filter: AutomationEventType | null;
}): Promise<AlertDispatchResult> {
  const destinations = await getAlertDestinations();
  const resendApiKey = process.env.RESEND_API_KEY;
  const resendFrom = process.env.RESEND_FROM_EMAIL || 'CypAI <noreply@cypai.app>';
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.cypai.app';
  const webhookSigningSecret = process.env.AUTOMATION_ALERT_WEBHOOK_SECRET?.trim() || '';

  let sentWebhook = false;
  let sentEmail = false;
  let webhookProvider: 'slack' | 'discord' | 'generic' | undefined;
  let error: string | undefined;

  const payload = {
    type: 'automation_failure_spike',
    filter: input.filter || 'all',
    failureRate: input.failureRate,
    attempts: input.attempts,
    failed: input.trend.failed,
    sent: input.trend.sent,
    queued: input.trend.queued,
    observedAt: new Date().toISOString(),
    dashboardUrl: `${appUrl}/dashboard`,
  };

  function getWebhookProvider(webhookUrl: string): 'slack' | 'discord' | 'generic' {
    const normalized = webhookUrl.toLowerCase();
    if (normalized.includes('discord.com/api/webhooks') || normalized.includes('discordapp.com/api/webhooks')) {
      return 'discord';
    }
    if (normalized.includes('hooks.slack.com')) {
      return 'slack';
    }
    return 'generic';
  }

  function buildProviderPayload(provider: 'slack' | 'discord' | 'generic') {
    const title = `CypAI automation failure spike (${input.failureRate.toFixed(1)}%)`;
    const lines = [
      `Scope: ${input.filter || 'all events'}`,
      `Failure rate: ${input.failureRate.toFixed(1)}%`,
      `Attempts: ${input.attempts}`,
      `Failed: ${input.trend.failed}`,
      `Sent: ${input.trend.sent}`,
      `Queued: ${input.trend.queued}`,
      `Dashboard: ${appUrl}/dashboard`,
    ];

    if (provider === 'slack') {
      return {
        text: `${title}\n${lines.join('\n')}`,
        blocks: [
          { type: 'header', text: { type: 'plain_text', text: title } },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: lines.join('\n'),
            },
          },
        ],
      };
    }

    if (provider === 'discord') {
      return {
        content: title,
        embeds: [
          {
            title,
            description: lines.join('\n'),
            color: 15158332,
            timestamp: new Date().toISOString(),
          },
        ],
      };
    }

    return payload;
  }

  if (destinations.webhookUrl) {
    webhookProvider = getWebhookProvider(destinations.webhookUrl);
    const webhookPayload = buildProviderPayload(webhookProvider);
    const webhookBody = JSON.stringify(webhookPayload);
    const webhookHeaders: Record<string, string> = { 'Content-Type': 'application/json' };

    if (webhookSigningSecret) {
      const timestamp = String(Date.now());
      const signature = signCypaiWebhookPayload({
        secret: webhookSigningSecret,
        timestamp,
        rawBody: webhookBody,
      });

      webhookHeaders['X-CypAI-Timestamp'] = timestamp;
      webhookHeaders['X-CypAI-Signature'] = signature;
      webhookHeaders['X-CypAI-Signature-Version'] = CYPAI_WEBHOOK_SIGNATURE_VERSION;
    }

    try {
      const response = await fetch(destinations.webhookUrl, {
        method: 'POST',
        headers: webhookHeaders,
        body: webhookBody,
      });
      sentWebhook = response.ok;
      if (!response.ok && !error) {
        error = `webhook_error:${response.status}`;
      }
    } catch {
      if (!error) {
        error = 'webhook_request_failed';
      }
    }

  }

  if (destinations.alertEmail && resendApiKey) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: resendFrom,
          to: [destinations.alertEmail],
          subject: `CypAI alert: automation failure spike (${input.failureRate.toFixed(1)}%)`,
          text: [
            `Failure rate alert detected in automation queue.`,
            `Scope: ${input.filter || 'all events'}`,
            `Failure rate: ${input.failureRate.toFixed(1)}%`,
            `Attempts: ${input.attempts}`,
            `Failed: ${input.trend.failed}`,
            `Sent: ${input.trend.sent}`,
            `Queued: ${input.trend.queued}`,
            `Dashboard: ${appUrl}/dashboard`,
          ].join('\n'),
        }),
      });
      sentEmail = response.ok;
      if (!response.ok && !error) {
        error = `alert_email_error:${response.status}`;
      }
    } catch {
      if (!error) {
        error = 'alert_email_request_failed';
      }
    }
  }

  return {
    sentWebhook,
    sentEmail,
    webhookProvider,
    signedWebhook: Boolean(webhookSigningSecret),
    error,
  };
}

export async function logAlertDispatch(input: {
  triggeredBy: 'automatic' | 'manual_test';
  eventScope: AutomationEventType | null;
  failureRate: number;
  attempts: number;
  dispatch: AlertDispatchResult;
  trend: { sent: number; failed: number; queued: number };
}) {
  const supabase = createServerClient();
  const { error } = await supabase.from('marketing_automation_alert_logs').insert({
    triggered_by: input.triggeredBy,
    event_scope: input.eventScope || 'all',
    failure_rate: Number(input.failureRate.toFixed(2)),
    attempts: input.attempts,
    sent_webhook: input.dispatch.sentWebhook,
    sent_email: input.dispatch.sentEmail,
    webhook_provider: input.dispatch.webhookProvider || null,
    signed_webhook: Boolean(input.dispatch.signedWebhook),
    dispatch_error: input.dispatch.error || null,
    payload: {
      trend: input.trend,
      dispatch: input.dispatch,
    },
  });

  if (error?.code === '42P01' || error?.code === '42703') {
    return;
  }
}

export async function getAlertLogsPage(input: {
  trigger: AlertLogTriggerFilter;
  outcome: AlertLogOutcomeFilter;
  dateRange: AlertLogDateRange;
  page: number;
  pageSize: number;
}): Promise<AlertLogsPage> {
  const supabase = createServerClient();
  let countQuery = supabase.from('marketing_automation_alert_logs').select('id', { count: 'exact', head: true });

  if (input.trigger !== 'all') {
    countQuery = countQuery.eq('triggered_by', input.trigger);
  }

  if (input.outcome === 'success') {
    countQuery = countQuery.or('sent_webhook.eq.true,sent_email.eq.true');
  } else if (input.outcome === 'failed') {
    countQuery = countQuery.eq('sent_webhook', false).eq('sent_email', false);
  }

  if (input.dateRange.from) {
    countQuery = countQuery.gte('created_at', input.dateRange.from);
  }
  if (input.dateRange.to) {
    countQuery = countQuery.lte('created_at', input.dateRange.to);
  }

  const { count, error: countError } = await countQuery;

  if (countError?.code === '42P01') {
    return {
      records: [],
      total: 0,
      page: 1,
      pageSize: input.pageSize,
      totalPages: 1,
    };
  }

  if (countError) {
    return {
      records: [],
      total: 0,
      page: 1,
      pageSize: input.pageSize,
      totalPages: 1,
    };
  }

  const total = Number(count || 0);
  const totalPages = Math.max(1, Math.ceil(total / input.pageSize));
  const page = Math.min(Math.max(1, input.page), totalPages);
  const rangeStart = (page - 1) * input.pageSize;
  const rangeEnd = rangeStart + input.pageSize - 1;

  let dataQuery = supabase
    .from('marketing_automation_alert_logs')
    .select('id, triggered_by, event_scope, failure_rate, attempts, sent_webhook, sent_email, webhook_provider, signed_webhook, dispatch_error, created_at')
    .order('created_at', { ascending: false })
    .range(rangeStart, rangeEnd);

  if (input.trigger !== 'all') {
    dataQuery = dataQuery.eq('triggered_by', input.trigger);
  }

  if (input.outcome === 'success') {
    dataQuery = dataQuery.or('sent_webhook.eq.true,sent_email.eq.true');
  } else if (input.outcome === 'failed') {
    dataQuery = dataQuery.eq('sent_webhook', false).eq('sent_email', false);
  }

  if (input.dateRange.from) {
    dataQuery = dataQuery.gte('created_at', input.dateRange.from);
  }
  if (input.dateRange.to) {
    dataQuery = dataQuery.lte('created_at', input.dateRange.to);
  }

  const { data, error } = await dataQuery;

  if (error || !data) {
    return {
      records: [],
      total,
      page,
      pageSize: input.pageSize,
      totalPages,
    };
  }

  return {
    records: data as AlertLogRecord[],
    total,
    page,
    pageSize: input.pageSize,
    totalPages,
  };
}
