import { NextRequest, NextResponse } from 'next/server';

import { assertSupabaseConfig, createServerClient } from '@/lib/supabase';

const supabase = createServerClient();

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  try {
    assertSupabaseConfig();

    const { conversationId } = await params;
    const body = (await request.json()) as {
      businessId?: string;
      leadContacted?: boolean;
    };

    if (!conversationId || !body.businessId || typeof body.leadContacted !== 'boolean') {
      return NextResponse.json(
        { error: 'conversationId, businessId, and leadContacted are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('conversations')
      .update({ lead_contacted: body.leadContacted })
      .eq('id', conversationId)
      .eq('business_id', body.businessId)
      .select('id, lead_contacted')
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, conversation: data });
  } catch (error) {
    console.error('Conversation update API error:', error);
    return NextResponse.json(
      { error: 'Failed to update conversation' },
      { status: 500 }
    );
  }
}