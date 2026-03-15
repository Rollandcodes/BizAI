import { createServerClient } from '@/lib/supabase'

import ChatWidget from '@/components/ChatWidget'

type Business = {
  id: string
  business_name: string
  widget_color: string
  whatsapp: string | null
}

function normalizeWhatsAppPhone(value: string | null | undefined): string {
  if (!value) return ''
  return value.replace(/[^\d]/g, '')
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
    .select('id, business_name, widget_color, whatsapp')
    .eq('id', businessId)
    .maybeSingle()

  if (!business || !businessId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-900 px-6 text-center text-sm text-zinc-500">
        This widget is not available.
      </div>
    )
  }

  const waDigits = normalizeWhatsAppPhone(business.whatsapp)
  const waUrl = waDigits ? `https://wa.me/${waDigits}` : ''
  const qrSrc = waUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(waUrl)}`
    : ''

  return (
    <div className="h-screen w-screen overflow-hidden bg-zinc-900">
      <div className={`h-full w-full ${waUrl ? 'grid lg:grid-cols-[minmax(0,1fr)_320px]' : ''}`}>
        <div className="min-h-0">
          <ChatWidget
            businessId={businessId}
            businessName={business.business_name}
            primaryColor={business.widget_color || '#2563eb'}
            welcomeMessage={`Hi, this is ${business.business_name}. How can I help you today?`}
            embedded
          />
        </div>

        {waUrl && (
          <aside className="hidden border-l border-zinc-800 bg-zinc-950 p-5 lg:flex lg:flex-col lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">WhatsApp Quick Chat</p>
              <h2 className="mt-1 text-lg font-bold text-zinc-100">Scan to start chatting</h2>
              <p className="mt-2 text-sm text-zinc-400">Customers can scan this QR code to open WhatsApp instantly.</p>

              <div className="mt-5 rounded-2xl border border-zinc-700 bg-white p-3">
                <img src={qrSrc} alt="WhatsApp QR code" className="h-[220px] w-[220px]" />
              </div>
            </div>

            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center justify-center rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white hover:bg-green-500"
            >
              Open WhatsApp
            </a>
          </aside>
        )}
      </div>
    </div>
  )
}
