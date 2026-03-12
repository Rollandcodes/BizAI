import { NextRequest, NextResponse } from 'next/server';

import { assertSupabaseConfig, createServerClient } from '@/lib/supabase';

const supabase = createServerClient();

export async function POST(request: NextRequest) {
  try {
    assertSupabaseConfig();

    const body = (await request.json()) as {
      businessId?: string;
      sessionId?: string;
      rating?: number;
    };

    if (
      !body.businessId ||
      !body.sessionId ||
      typeof body.rating !== 'number' ||
      !Number.isInteger(body.rating) ||
      body.rating < 1 ||
      body.rating > 5
    ) {
      return NextResponse.json(
        { error: 'businessId, sessionId, and rating (integer 1-5) are required' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('conversations')
      .update({ customer_rating: body.rating })
      .eq('business_id', body.businessId)
      .eq('session_id', body.sessionId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Rating API error:', error);
    return NextResponse.json({ error: 'Failed to save rating' }, { status: 500 });
  }
}
