// Booking History API Route
// Returns bookings and audit logs for a business
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(req: NextRequest) {
  const businessId = req.nextUrl.searchParams.get('businessId');
  if (!businessId) {
    return NextResponse.json({ error: 'Missing businessId' }, { status: 400 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Fetch bookings for business
  const { data: bookings, error: bookingsError } = await supabase
    .from('bookings')
    .select('id, customer_name, customer_phone, pickup_date, return_date, car_type, status, paypal_order_id, created_at')
    .eq('business_id', businessId)
    .order('created_at', { ascending: false });

  if (bookingsError) {
    return NextResponse.json({ error: bookingsError.message }, { status: 500 });
  }

  // Fetch audit logs for all bookings
  const bookingIds = bookings.map(b => b.id);
  const { data: auditLogs, error: auditError } = await supabase
    .from('booking_audit_logs')
    .select('booking_id, action, details, timestamp')
    .in('booking_id', bookingIds);

  if (auditError) {
    return NextResponse.json({ error: auditError.message }, { status: 500 });
  }

  return NextResponse.json({ bookings, auditLogs });
}
