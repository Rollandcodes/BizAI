import { NextRequest, NextResponse } from 'next/server';
import paypal from '@paypal/checkout-server-sdk';
import { createServerClient, type BusinessPlan } from '@/lib/supabase';

const PLAN_EXPIRY_DAYS = 30;

type JsonMap = Record<string, unknown>;

interface PayPalWebhookEvent {
  id?: string;
  event_type?: string;
  resource?: JsonMap;
}

function asRecord(value: unknown): JsonMap {
  if (!value || typeof value !== 'object') {
    return {};
  }
  return value as JsonMap;
}

function getString(value: unknown): string | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function normalizeEmail(value: string | undefined): string | undefined {
  if (!value) {
    return undefined;
  }

  const normalized = value.trim().toLowerCase();
  return normalized.length > 0 ? normalized : undefined;
}

function extractEmailCandidates(resource: JsonMap): string[] {
  const candidates = [
    getString(resource.custom_id),
    getString(resource.custom),
    getString(asRecord(resource.subscriber).email_address),
    getString(asRecord(resource.payer).email_address),
  ];

  return candidates
    .map(normalizeEmail)
    .filter((value): value is string => Boolean(value));
}

function extractSubscriptionCandidates(resource: JsonMap): string[] {
  const supplementaryData = asRecord(resource.supplementary_data);
  const relatedIds = asRecord(supplementaryData.related_ids);

  const ids = [
    getString(resource.id),
    getString(resource.billing_agreement_id),
    getString(relatedIds.billing_subscription_id),
    getString(relatedIds.subscription_id),
  ];

  return ids.filter((value): value is string => Boolean(value));
}

function extractPlan(resource: JsonMap): BusinessPlan | undefined {
  const planCandidates = [
    getString(resource.plan_id),
    getString(resource.custom),
    getString(resource.custom_id),
  ]
    .filter((value): value is string => Boolean(value))
    .map((value) => value.toLowerCase());

  for (const candidate of planCandidates) {
    if (candidate.includes('starter') || candidate.includes('basic')) {
      return 'basic';
    }
    if (candidate.includes('pro')) {
      return 'pro';
    }
    if (candidate.includes('business')) {
      return 'business';
    }
  }

  return undefined;
}

function computePlanExpiry(resource: JsonMap): string {
  const billingInfo = asRecord(resource.billing_info);
  const nextBilling = getString(billingInfo.next_billing_time);

  if (nextBilling) {
    return nextBilling;
  }

  const fallback = new Date();
  fallback.setDate(fallback.getDate() + PLAN_EXPIRY_DAYS);
  return fallback.toISOString();
}

function requiredHeader(request: NextRequest, name: string): string | null {
  const value = request.headers.get(name);
  return value && value.trim().length > 0 ? value : null;
}

function getPayPalClient(): paypal.core.PayPalHttpClient {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET || process.env.PAYPAL_SECRET;
  const baseUrl = process.env.PAYPAL_BASE_URL || '';

  if (!clientId || !clientSecret) {
    throw new Error('Missing PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET (or PAYPAL_SECRET)');
  }

  const environment = baseUrl.includes('sandbox')
    ? new paypal.core.SandboxEnvironment(clientId, clientSecret)
    : new paypal.core.LiveEnvironment(clientId, clientSecret);

  return new paypal.core.PayPalHttpClient(environment);
}

async function verifyWebhookSignature(
  request: NextRequest,
  event: PayPalWebhookEvent,
): Promise<{ ok: boolean; reason?: string }> {
  const transmissionId = requiredHeader(request, 'paypal-transmission-id');
  const transmissionTime = requiredHeader(request, 'paypal-transmission-time');
  const transmissionSig = requiredHeader(request, 'paypal-transmission-sig');
  const authAlgo = requiredHeader(request, 'paypal-auth-algo');
  const certUrl = requiredHeader(request, 'paypal-cert-url');
  const webhookId = process.env.PAYPAL_WEBHOOK_ID;

  if (!webhookId) {
    return { ok: false, reason: 'Missing PAYPAL_WEBHOOK_ID' };
  }

  if (!transmissionId || !transmissionTime || !transmissionSig || !authAlgo || !certUrl) {
    return { ok: false, reason: 'Missing PayPal signature headers' };
  }

  try {
    const client = getPayPalClient();
    const verifyResponse = await client.execute({
      verb: 'POST',
      path: '/v1/notifications/verify-webhook-signature',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        auth_algo: authAlgo,
        cert_url: certUrl,
        transmission_id: transmissionId,
        transmission_sig: transmissionSig,
        transmission_time: transmissionTime,
        webhook_id: webhookId,
        webhook_event: event,
      },
    });

    const verifyData = verifyResponse.result as { verification_status?: string };

    return {
      ok: verifyData.verification_status === 'SUCCESS',
      reason: verifyData.verification_status,
    };
  } catch (error) {
    const reason = error instanceof Error ? error.message : 'Unknown verification error';
    return { ok: false, reason };
  }
}

async function markEventProcessed(event: PayPalWebhookEvent): Promise<{ duplicate: boolean }> {
  const eventId = getString(event.id);
  const eventType = getString(event.event_type) || 'unknown';

  if (!eventId) {
    return { duplicate: false };
  }

  const supabase = createServerClient();
  const { error } = await supabase.from('paypal_webhook_events').insert({
    event_id: eventId,
    event_type: eventType,
    payload: event,
  });

  if (!error) {
    return { duplicate: false };
  }

  if (error.code === '23505') {
    return { duplicate: true };
  }

  // Keep webhook flow alive if the idempotency table is not migrated yet.
  if (error.code === '42P01') {
    console.warn('[PayPal webhook] paypal_webhook_events table not found; idempotency skipped');
    return { duplicate: false };
  }

  throw new Error(`Failed to persist webhook event: ${error.message}`);
}

async function findBusiness(resource: JsonMap) {
  const supabase = createServerClient();
  const subscriptionIds = extractSubscriptionCandidates(resource);

  for (const subscriptionId of subscriptionIds) {
    const { data } = await supabase
      .from('businesses')
      .select('id, owner_email, plan, paypal_subscription_id')
      .eq('paypal_subscription_id', subscriptionId)
      .maybeSingle();

    if (data) {
      return { business: data, matchedSubscriptionId: subscriptionId };
    }
  }

  const emailCandidates = extractEmailCandidates(resource);
  for (const email of emailCandidates) {
    const { data } = await supabase
      .from('businesses')
      .select('id, owner_email, plan, paypal_subscription_id')
      .eq('owner_email', email)
      .maybeSingle();

    if (data) {
      return { business: data, matchedSubscriptionId: subscriptionIds[0] };
    }
  }

  return null;
}

async function applyEventToBusiness(eventType: string, resource: JsonMap) {
  const resolved = await findBusiness(resource);
  if (!resolved?.business) {
    return { applied: false, reason: 'No matching business found' };
  }

  const supabase = createServerClient();
  const inferredPlan = extractPlan(resource);
  const subscriptionId =
    resolved.matchedSubscriptionId ||
    getString(resource.id) ||
    getString(resource.billing_agreement_id) ||
    resolved.business.paypal_subscription_id ||
    null;

  const patch: Record<string, unknown> = {
    paypal_subscription_id: subscriptionId,
  };

  switch (eventType) {
    case 'BILLING.SUBSCRIPTION.CREATED':
    case 'BILLING.SUBSCRIPTION.ACTIVATED':
    case 'BILLING.SUBSCRIPTION.UPDATED':
      patch.plan = inferredPlan || resolved.business.plan;
      patch.plan_expires_at = computePlanExpiry(resource);
      break;
    case 'PAYMENT.SALE.COMPLETED':
      patch.plan = inferredPlan || resolved.business.plan;
      patch.plan_expires_at = computePlanExpiry(resource);
      break;
    case 'BILLING.SUBSCRIPTION.CANCELLED':
      patch.plan = 'trial';
      patch.plan_expires_at = new Date().toISOString();
      break;
    default:
      return { applied: false, reason: `Unhandled event type: ${eventType}` };
  }

  const { error } = await supabase
    .from('businesses')
    .update(patch)
    .eq('id', resolved.business.id);

  if (error) {
    throw new Error(`Failed to update business from webhook: ${error.message}`);
  }

  return { applied: true, businessId: resolved.business.id };
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const event = (await request.json()) as PayPalWebhookEvent;
    const eventType = getString(event.event_type);

    if (!eventType) {
      return NextResponse.json({ error: 'Missing event_type' }, { status: 400 });
    }

    const verification = await verifyWebhookSignature(request, event);
    if (!verification.ok) {
      return NextResponse.json(
        {
          error: 'Invalid webhook signature',
          details: verification.reason || 'unknown',
        },
        { status: 400 },
      );
    }

    const idempotency = await markEventProcessed(event);
    if (idempotency.duplicate) {
      return NextResponse.json({ received: true, duplicate: true }, { status: 200 });
    }

    const resource = asRecord(event.resource);
    const result = await applyEventToBusiness(eventType, resource);

    console.log('[PayPal webhook]', {
      eventId: event.id,
      eventType,
      result,
    });

    return NextResponse.json({ received: true, ...result }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown webhook error';
    console.error('[PayPal webhook] processing error:', message);
    return NextResponse.json({ error: 'Webhook processing failed', details: message }, { status: 500 });
  }
}

export async function GET(): Promise<NextResponse> {
  return NextResponse.json(
    {
      message: 'CypAI PayPal webhook endpoint',
      method: 'POST required',
    },
    { status: 200 },
  );
}