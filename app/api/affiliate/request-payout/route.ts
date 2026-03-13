import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

const supabase = createServerClient();

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { email?: string };
  const email = body.email?.trim().toLowerCase();

  if (!email) {
    return NextResponse.json({ error: 'email is required' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('affiliates')
    .update({ payout_requested: true })
    .eq('email', email)
    .select('id, email, payout_requested')
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'Failed to request payout' }, { status: 500 });
  }

  return NextResponse.json({ success: true, affiliate: data });
}
