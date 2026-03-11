import type { Metadata } from 'next';
import { createServerClient } from '@/lib/supabase';
import ChatWidget from '@/components/ChatWidget';

type Props = {
  params: Promise<{ businessId: string }>;
};

type Business = {
  id: string;
  business_name: string;
  widget_color: string | null;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { businessId } = await params;
  const supabase = createServerClient();
  const { data } = await supabase
    .from('businesses')
    .select('business_name')
    .eq('id', businessId)
    .maybeSingle();

  const name = data?.business_name ?? 'BizAI';
  return {
    title: `Chat with ${name}`,
    description: `Chat with the AI assistant for ${name}`,
  };
}

export default async function ChatPage({ params }: Props) {
  const { businessId } = await params;
  const supabase = createServerClient();

  const { data: business } = await supabase
    .from('businesses')
    .select('id, business_name, widget_color')
    .eq('id', businessId)
    .maybeSingle() as { data: Business | null };

  if (!business) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-6 text-center">
        <p className="text-2xl">🤖</p>
        <h1 className="mt-3 text-lg font-bold text-slate-900">Chat not found</h1>
        <p className="mt-1 text-sm text-slate-500">This QR code may be outdated. Please contact the business directly.</p>
      </div>
    );
  }

  const primaryColor = business.widget_color ?? '#2563eb';

  return (
    <div className="flex h-dvh flex-col bg-white">
      {/* Header bar */}
      <div
        className="flex shrink-0 items-center gap-3 px-4 py-3 shadow-sm"
        style={{ backgroundColor: primaryColor }}
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20 text-lg">
          🤖
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-white">{business.business_name}</p>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-300" />
            <span className="text-xs font-medium text-white/80">Online · AI Assistant</span>
          </div>
        </div>
      </div>

      {/* Full-screen chat */}
      <div className="min-h-0 flex-1 overflow-hidden">
        <ChatWidget
          businessId={business.id}
          businessName={business.business_name}
          primaryColor={primaryColor}
          welcomeMessage={`Hi! I'm the AI assistant for ${business.business_name}. How can I help you today?`}
          embedded
        />
      </div>
    </div>
  );
}
