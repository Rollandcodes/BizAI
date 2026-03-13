import { createServerClient } from '@/lib/supabase'

import ChatWidget from '@/components/ChatWidget'

type Business = {
  id: string
  business_name: string
  widget_color: string
}

export default async function WidgetPage({
  params,
}: {
  params: Promise<{ businessId: string }>
}) {
  const { businessId } = await params
  const supabase = createServerClient()

  const { data: business } = await supabase
    .from('businesses')
    .select('id, business_name, widget_color')
    .eq('id', businessId)
    .maybeSingle()

  if (!business || !businessId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-900 px-6 text-center text-sm text-zinc-500">
        This widget is not available.
      </div>
    )
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-zinc-900">
      <ChatWidget
        businessId={businessId}
        businessName={business.business_name}
        primaryColor={business.widget_color || '#2563eb'}
        welcomeMessage={`Hi, this is ${business.business_name}. How can I help you today?`}
        embedded
      />
    </div>
  )
}
