import { createHmac, timingSafeEqual } from 'node:crypto';

export const CYPAI_WEBHOOK_SIGNATURE_VERSION = 'v1';

export type CypaiWebhookHeaders = {
  timestamp: string | null;
  signature: string | null;
  version: string | null;
};

export type VerifyWebhookOptions = {
  maxSkewMs?: number;
  nowMs?: number;
};

export function signCypaiWebhookPayload(input: {
  secret: string;
  timestamp: string;
  rawBody: string;
}): string {
  return createHmac('sha256', input.secret)
    .update(`${input.timestamp}.${input.rawBody}`)
    .digest('hex');
}

export function verifyCypaiWebhookSignature(input: {
  secret: string;
  rawBody: string;
  headers: CypaiWebhookHeaders;
  options?: VerifyWebhookOptions;
}): { ok: boolean; reason?: string } {
  const maxSkewMs = input.options?.maxSkewMs ?? 5 * 60 * 1000;
  const nowMs = input.options?.nowMs ?? Date.now();

  if (!input.headers.timestamp || !input.headers.signature || !input.headers.version) {
    return { ok: false, reason: 'missing_signature_headers' };
  }

  if (input.headers.version !== CYPAI_WEBHOOK_SIGNATURE_VERSION) {
    return { ok: false, reason: 'unsupported_signature_version' };
  }

  const timestampMs = Number(input.headers.timestamp);
  if (!Number.isFinite(timestampMs)) {
    return { ok: false, reason: 'invalid_signature_timestamp' };
  }

  if (Math.abs(nowMs - timestampMs) > maxSkewMs) {
    return { ok: false, reason: 'signature_timestamp_outside_window' };
  }

  const expected = signCypaiWebhookPayload({
    secret: input.secret,
    timestamp: input.headers.timestamp,
    rawBody: input.rawBody,
  });

  const expectedBuf = Buffer.from(expected, 'utf8');
  const receivedBuf = Buffer.from(input.headers.signature, 'utf8');

  if (expectedBuf.length !== receivedBuf.length) {
    return { ok: false, reason: 'invalid_signature' };
  }

  if (!timingSafeEqual(expectedBuf, receivedBuf)) {
    return { ok: false, reason: 'invalid_signature' };
  }

  return { ok: true };
}
