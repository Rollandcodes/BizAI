// Audit Log Utility for Booking Actions
// Strict TypeScript, production-ready

import { createClient } from '@supabase/supabase-js';

export type AuditLogAction =
  | 'booking_created'
  | 'booking_updated'
  | 'booking_cancelled'
  | 'paypal_order_created'
  | 'paypal_order_failed'
  | 'calendar_event_created'
  | 'webhook_dispatched'
  | 'webhook_failed';

export interface AuditLogEntry {
  bookingId: string;
  action: AuditLogAction;
  details?: unknown;
  timestamp?: string;
}

export async function createBookingAuditLog(entry: AuditLogEntry): Promise<void> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  await supabase.from('booking_audit_logs').insert({
    booking_id: entry.bookingId,
    action: entry.action,
    details: entry.details ? JSON.stringify(entry.details) : null,
    timestamp: entry.timestamp || new Date().toISOString(),
  });
}
