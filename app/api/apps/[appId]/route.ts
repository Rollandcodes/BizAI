import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function DELETE(
  req: NextRequest,
  { params }: { params: { appId: string } }
) {
  try {
    const { businessId } = await req.json();
    if (!businessId) {
      return NextResponse.json({ error: 'businessId required' }, { status: 400 });
    }

    // Uninstall app
    await supabase
      .from('installed_apps')
      .delete()
      .eq('business_id', businessId)
      .eq('app_id', params.appId);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error uninstalling app:', err);
    return NextResponse.json({ error: 'Failed to uninstall app' }, { status: 500 });
  }
}
