import { createServerClient } from '@/lib/supabase';

type WebhookEndpointRow = {
  id: string;
  tenant_id: string;
  url: string;
  event_type: string;
  is_active: boolean;
};

function getTimeoutSignal(ms: number): AbortSignal {
  if (typeof AbortSignal !== 'undefined' && typeof AbortSignal.timeout === 'function') {
    return AbortSignal.timeout(ms);
  }

  const controller = new AbortController();
  setTimeout(() => controller.abort(), ms);
  return controller.signal;
}

async function logDispatchAttempt(input: {
  eventType: string;
  tenantId: string;
  endpointId: string;
  endpointUrl: string;
  payload: unknown;
  ok: boolean;
  statusCode?: number;
  errorMessage?: string;
}) {
  try {
    // Reuse existing operational alert log table to keep a Supabase audit trail
    // for outbound webhook dispatches without introducing a new migration.
    await createServerClient().from('marketing_automation_alert_logs').insert({
      triggered_by: 'automatic',
      event_scope: input.eventType,
      sent_webhook: input.ok,
      dispatch_error: input.errorMessage ?? null,
      payload: {
        kind: 'outbound_webhook_dispatch',
        tenantId: input.tenantId,
        endpointId: input.endpointId,
        endpointUrl: input.endpointUrl,
        eventType: input.eventType,
        statusCode: input.statusCode ?? null,
        delivered: input.ok,
        body: input.payload,
        loggedAt: new Date().toISOString(),
      },
    });
  } catch {
    // Silent on purpose: webhook dispatch should not fail because logging failed.
  }
}

export async function dispatchOutboundWebhook(
  eventType: string,
  payload: any,
  tenantId: string
): Promise<void> {
  try {
    if (!eventType?.trim()) return;
    if (!tenantId?.trim()) return;

    const supabase = createServerClient();

    const { data: endpoints, error } = await supabase
      .from('webhook_endpoints')
      .select('id, tenant_id, url, event_type, is_active')
      .eq('tenant_id', tenantId)
      .eq('event_type', eventType)
      .eq('is_active', true);

    if (error || !endpoints?.length) {
      return;
    }

    const rows = endpoints as WebhookEndpointRow[];

    for (const endpoint of rows) {
      let ok = false;
      let statusCode: number | undefined;
      let errorMessage: string | undefined;

      try {
        const response = await fetch(endpoint.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
          signal: getTimeoutSignal(5000),
        });

        statusCode = response.status;
        ok = response.ok;

        if (!response.ok) {
          errorMessage = `http_${response.status}`;
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'request_failed';
        errorMessage = message;
      }

      await logDispatchAttempt({
        eventType,
        tenantId,
        endpointId: endpoint.id,
        endpointUrl: endpoint.url,
        payload,
        ok,
        statusCode,
        errorMessage,
      });
    }
  } catch {
    // Silent by design: this fan-out should never block core product flows.
  }
}
