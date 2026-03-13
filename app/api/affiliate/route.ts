import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

const supabase = createServerClient();

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function generateReferralCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let out = '';
  for (let i = 0; i < 8; i += 1) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get('email');
  if (!email) {
    return NextResponse.json({ error: 'email is required' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('affiliates')
    .select('id, email, name, referral_code, total_referrals, total_earnings, payout_requested, created_at')
    .eq('email', normalizeEmail(email))
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: 'Failed to load affiliate' }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: 'Affiliate not found' }, { status: 404 });
  }

  return NextResponse.json({ affiliate: data });
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { name?: string; email?: string };
  const name = body.name?.trim() || '';
  const email = body.email?.trim() || '';

  if (!name || !email) {
    return NextResponse.json({ error: 'name and email are required' }, { status: 400 });
  }

  const normalizedEmail = normalizeEmail(email);

  const { data: existing, error: existingError } = await supabase
    .from('affiliates')
    .select('id, email, name, referral_code, total_referrals, total_earnings, payout_requested, created_at')
    .eq('email', normalizedEmail)
    .maybeSingle();

  if (existingError) {
    return NextResponse.json({ error: 'Failed to create affiliate' }, { status: 500 });
  }

  if (existing) {
    return NextResponse.json({ affiliate: existing });
  }

  let created = null as null | {
    id: string;
    email: string;
    name: string;
    referral_code: string;
    total_referrals: number;
    total_earnings: number;
    payout_requested: boolean;
    created_at: string;
  };

  for (let attempt = 0; attempt < 10; attempt += 1) {
    const referralCode = generateReferralCode();
    const { data, error } = await supabase
      .from('affiliates')
      .insert({
        email: normalizedEmail,
        name,
        referral_code: referralCode,
      })
      .select('id, email, name, referral_code, total_referrals, total_earnings, payout_requested, created_at')
      .single();

    if (!error && data) {
      created = data;
      break;
    }
  }

  if (!created) {
    return NextResponse.json({ error: 'Failed to create unique referral code' }, { status: 500 });
  }

  return NextResponse.json({ affiliate: created });
}
