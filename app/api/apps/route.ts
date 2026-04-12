import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  try {
    const businessId = req.nextUrl.searchParams.get('businessId');
    if (!businessId) {
      return NextResponse.json({ error: 'businessId required' }, { status: 400 });
    }

    // Fetch installed apps
    const { data: installedApps } = await supabase
      .from('installed_apps')
      .select('*')
      .eq('business_id', businessId);

    return NextResponse.json({ apps: installedApps || [] });
  } catch (err) {
    console.error('Error fetching apps:', err);
    return NextResponse.json({ error: 'Failed to fetch apps' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { businessId, appId } = await req.json();
    if (!businessId || !appId) {
      return NextResponse.json({ error: 'businessId and appId required' }, { status: 400 });
    }

    // Check if already installed
    const { data: existing } = await supabase
      .from('installed_apps')
      .select('id')
      .eq('business_id', businessId)
      .eq('app_id', appId)
      .single();

    if (existing) {
      return NextResponse.json({ error: 'App already installed' }, { status: 400 });
    }

    // Install app
    const { data: installed } = await supabase
      .from('installed_apps')
      .insert([{ business_id: businessId, app_id: appId }])
      .select()
      .single();

    return NextResponse.json({ app: installed });
  } catch (err) {
    console.error('Error installing app:', err);
    return NextResponse.json({ error: 'Failed to install app' }, { status: 500 });
  }
}
