import { NextRequest, NextResponse } from 'next/server';
import { assertSupabaseConfig, createServerClient } from '@/lib/supabase';

const supabase = createServerClient();

function getMonthStartIso() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
}

async function getBusinessByEmail(email: string) {
  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('owner_email', email)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

async function getBusinessById(businessId: string) {
  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('id', businessId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

export async function GET(request: NextRequest) {
  try {
    assertSupabaseConfig();

    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const businessId = searchParams.get('businessId');

    if (!email && !businessId) {
      return NextResponse.json(
        { error: 'Provide email or businessId' },
        { status: 400 }
      );
    }

    const business = email
      ? await getBusinessByEmail(email)
      : await getBusinessById(businessId as string);

    if (!business) {
      return NextResponse.json({ business: null, stats: null, leads: [] });
    }

    if (!email) {
      return NextResponse.json({ business });
    }

    const monthStart = getMonthStartIso();

    const [monthlyResult, leadsCountResult, leadsResult] = await Promise.all([
      supabase
        .from('conversations')
        .select('*', { count: 'exact', head: true })
        .eq('business_id', business.id)
        .gte('created_at', monthStart),
      supabase
        .from('conversations')
        .select('*', { count: 'exact', head: true })
        .eq('business_id', business.id)
        .eq('lead_captured', true),
      supabase
        .from('conversations')
        .select('id, created_at, customer_name, customer_phone, messages')
        .eq('business_id', business.id)
        .eq('lead_captured', true)
        .order('created_at', { ascending: false })
        .limit(50),
    ]);

    if (monthlyResult.error || leadsCountResult.error || leadsResult.error) {
      throw monthlyResult.error || leadsCountResult.error || leadsResult.error;
    }

    return NextResponse.json({
      business,
      stats: {
        monthlyConversations: monthlyResult.count ?? 0,
        leadsCaptured: leadsCountResult.count ?? 0,
      },
      leads: leadsResult.data ?? [],
    });
  } catch (error) {
    console.error('Business API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch business settings' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    assertSupabaseConfig();

    const body = await request.json();
    const { businessId, businessName, widgetColor, customInstructions } = body;

    if (!businessId) {
      return NextResponse.json(
        { error: 'businessId is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('businesses')
      .update({
        business_name: businessName,
        widget_color: widgetColor,
        system_prompt: customInstructions,
      })
      .eq('id', businessId)
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, business: data });
  } catch (error) {
    console.error('Business API error:', error);
    return NextResponse.json(
      { error: 'Failed to save business settings' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  return PATCH(request);
}
