import { createServerClient } from '@/lib/supabase';

export type AutomationEventType = 'abandoned_signup' | 'abandoned_payment';

export type RetryPolicy = {
  maxRetries: number;
  retryWindowHours: number;
};

export type RetryPolicyMap = {
  default: RetryPolicy;
  abandoned_signup: RetryPolicy;
  abandoned_payment: RetryPolicy;
};

export type AlertPolicy = {
  failureRateThreshold: number;
  minAttempts: number;
  cooldownMinutes: number;
  alertEmail: string | null;
  hasWebhook: boolean;
  hasSigningSecret: boolean;
  lastAlertAt: string | null;
};

export const DEFAULT_RETRY_POLICY: RetryPolicy = {
  maxRetries: 3,
  retryWindowHours: 72,
};

export const DEFAULT_ALERT_POLICY: AlertPolicy = {
  failureRateThreshold: 40,
  minAttempts: 5,
  cooldownMinutes: 60,
  alertEmail: null,
  hasWebhook: false,
  hasSigningSecret: false,
  lastAlertAt: null,
};

function normalizeEmail(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const email = value.trim().toLowerCase();
  return email.length > 0 ? email : null;
}

function getPolicyId(eventType: AutomationEventType | null): string {
  return eventType || 'default';
}

export async function getRetryPolicy(eventType: AutomationEventType | null = null): Promise<RetryPolicy> {
  const supabase = createServerClient();
  const policyId = getPolicyId(eventType);
  const { data, error } = await supabase
    .from('marketing_automation_policy')
    .select('max_retries, retry_window_hours')
    .eq('id', policyId)
    .single();

  if (error?.code === '42P01' || error?.code === 'PGRST116') {
    return DEFAULT_RETRY_POLICY;
  }

  if (error || !data) {
    if (eventType) {
      return getRetryPolicy(null);
    }
    return DEFAULT_RETRY_POLICY;
  }

  return {
    maxRetries: Number(data.max_retries || DEFAULT_RETRY_POLICY.maxRetries),
    retryWindowHours: Number(data.retry_window_hours || DEFAULT_RETRY_POLICY.retryWindowHours),
  };
}

export async function getRetryPoliciesMap(): Promise<RetryPolicyMap> {
  const [defaultPolicy, signupPolicy, paymentPolicy] = await Promise.all([
    getRetryPolicy(null),
    getRetryPolicy('abandoned_signup'),
    getRetryPolicy('abandoned_payment'),
  ]);

  return {
    default: defaultPolicy,
    abandoned_signup: signupPolicy,
    abandoned_payment: paymentPolicy,
  };
}

export async function saveRetryPolicy(maxRetries: number, retryWindowHours: number, eventType: AutomationEventType | null = null) {
  const supabase = createServerClient();
  const policyId = getPolicyId(eventType);
  const { error } = await supabase.from('marketing_automation_policy').upsert(
    {
      id: policyId,
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

export async function getAlertPolicy(): Promise<AlertPolicy> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('marketing_automation_alert_policy')
    .select('failure_rate_threshold, min_attempts, cooldown_minutes, alert_email, webhook_url, last_alert_at')
    .eq('id', 'default')
    .single();

  if (error?.code === '42P01' || error?.code === 'PGRST116') {
    return DEFAULT_ALERT_POLICY;
  }

  if (error || !data) {
    return DEFAULT_ALERT_POLICY;
  }

  return {
    failureRateThreshold: Number(data.failure_rate_threshold || DEFAULT_ALERT_POLICY.failureRateThreshold),
    minAttempts: Number(data.min_attempts || DEFAULT_ALERT_POLICY.minAttempts),
    cooldownMinutes: Number(data.cooldown_minutes || DEFAULT_ALERT_POLICY.cooldownMinutes),
    alertEmail: normalizeEmail(data.alert_email),
    hasWebhook: typeof data.webhook_url === 'string' && data.webhook_url.trim().length > 0,
    hasSigningSecret: typeof process.env.AUTOMATION_ALERT_WEBHOOK_SECRET === 'string' && process.env.AUTOMATION_ALERT_WEBHOOK_SECRET.trim().length > 0,
    lastAlertAt: typeof data.last_alert_at === 'string' ? data.last_alert_at : null,
  };
}

export async function saveAlertPolicy(input: {
  failureRateThreshold: number;
  minAttempts: number;
  cooldownMinutes: number;
  alertEmail?: string | null;
  webhookUrl?: string | null;
}) {
  const supabase = createServerClient();

  const current = await supabase
    .from('marketing_automation_alert_policy')
    .select('alert_email, webhook_url')
    .eq('id', 'default')
    .single();

  const existingAlertEmail = current.data && typeof current.data.alert_email === 'string' ? current.data.alert_email : null;
  const existingWebhookUrl = current.data && typeof current.data.webhook_url === 'string' ? current.data.webhook_url : null;

  const nextAlertEmail =
    typeof input.alertEmail === 'string' && input.alertEmail.trim().length > 0
      ? input.alertEmail.trim().toLowerCase()
      : existingAlertEmail;

  const nextWebhookUrl =
    typeof input.webhookUrl === 'string' && input.webhookUrl.trim().length > 0
      ? input.webhookUrl.trim()
      : existingWebhookUrl;

  const { error } = await supabase.from('marketing_automation_alert_policy').upsert(
    {
      id: 'default',
      failure_rate_threshold: input.failureRateThreshold,
      min_attempts: input.minAttempts,
      cooldown_minutes: input.cooldownMinutes,
      alert_email: nextAlertEmail,
      webhook_url: nextWebhookUrl,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'id' }
  );

  if (error?.code === '42P01') {
    return { ok: false as const, status: 400 as const, error: 'marketing_automation_alert_policy table missing. Run latest supabase-schema.sql.' };
  }

  if (error) {
    return { ok: false as const, status: 500 as const, error: error.message };
  }

  return { ok: true as const };
}

export async function getAlertDestinations() {
  const supabase = createServerClient();
  const { data } = await supabase
    .from('marketing_automation_alert_policy')
    .select('alert_email, webhook_url')
    .eq('id', 'default')
    .single();

  return {
    alertEmail: data && typeof data.alert_email === 'string' ? data.alert_email.trim().toLowerCase() : null,
    webhookUrl: data && typeof data.webhook_url === 'string' ? data.webhook_url.trim() : null,
  };
}

export async function touchLastAlertAt() {
  const supabase = createServerClient();
  await supabase
    .from('marketing_automation_alert_policy')
    .upsert(
      {
        id: 'default',
        last_alert_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' }
    );
}
