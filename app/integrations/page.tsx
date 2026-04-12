import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Integrations | Website, WhatsApp, and Paddle',
  description:
    'See how CypAI integrates with your website, WhatsApp, and Paddle checkout flow for B2B SaaS operations and customer support.',
  alternates: {
    canonical: 'https://www.cypai.app/integrations',
  },
}

const integrations = [
  {
    name: 'Website Widget',
    summary: 'Install with one script tag and start capturing leads immediately.',
    value: 'No-code deployment and fast onboarding for teams without developers.',
  },
  {
    name: 'WhatsApp Business',
    summary: 'Handle customer conversations from your WhatsApp channel 24/7.',
    value: 'Reduce response delays and centralize chat operations.',
  },
  {
    name: 'Paddle Checkout',
    summary: 'Subscription payments processed securely via Paddle for trusted billing collection.',
    value: 'Secure card payments with automatic tax handling and global compliance.',
  },
  {
    name: 'Webhook Endpoints',
    summary: 'Send signed automation alerts to Slack, Discord, or custom systems.',
    value: 'Plug CypAI into your ops stack with secure, auditable notifications.',
  },
  {
    name: 'CRM and Analytics',
    summary: 'Every conversation and lead is recorded with conversion metrics.',
    value: 'Eliminate spreadsheet tracking and manual reporting overhead.',
  },
  {
    name: 'Multilingual AI Engine',
    summary: 'Serve English, Turkish, Arabic, Russian, and Greek automatically.',
    value: 'Expand reach without adding multilingual support staff.',
  },
]

export default function IntegrationsPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <section className="border-b border-zinc-800 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Integrations</p>
          <h1 className="mt-3 text-4xl font-black sm:text-5xl">Connect channels and systems without friction</h1>
          <p className="mt-5 max-w-3xl text-zinc-400">
            CypAI is designed for practical B2B SaaS teams who need fast deployment, less manual work, and stable billing operations.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto grid max-w-6xl gap-4 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          {integrations.map((item) => (
            <article key={item.name} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
              <h2 className="text-xl font-bold text-white">{item.name}</h2>
              <p className="mt-2 text-sm text-zinc-300">{item.summary}</p>
              <p className="mt-2 text-sm text-zinc-500">{item.value}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-zinc-800 bg-zinc-900 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black text-white">Self-connect checklist</h2>
          <ol className="mt-6 space-y-3 text-sm text-zinc-300">
            <li className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">1. Create account and configure your business data.</li>
            <li className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">2. Add widget code to your website and test your chat flow.</li>
            <li className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">3. Connect WhatsApp and validate message templates.</li>
            <li className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">4. Confirm Paddle checkout for subscriptions and billing.</li>
            <li className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">5. Enable automation alerts and monitor logs in dashboard.</li>
          </ol>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black text-white">WhatsApp chatbot with website sync (GHL-style)</h2>
          <p className="mt-3 max-w-3xl text-sm text-zinc-400">
            Yes, this is possible. We can run WhatsApp as a channel for the same AI agent and push every message, lead, and status update back into the website dashboard conversation stream.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              ['Channel ingest', 'Meta WhatsApp Cloud API webhook receives inbound WhatsApp messages in real time.'],
              ['Unified conversation layer', 'Messages are mapped to the same business and session model used by website chat.'],
              ['Central inbox and automation', 'Replies, tags, assignments, and automations update one shared timeline across channels.'],
            ].map(([title, text]) => (
              <article key={title} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
                <h3 className="text-base font-bold text-white">{title}</h3>
                <p className="mt-2 text-sm text-zinc-400">{text}</p>
              </article>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            <Link href="/whatsapp-sync" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500">
              View WhatsApp sync blueprint
            </Link>
            <Link href="/dashboard" className="rounded-lg border border-zinc-700 px-4 py-2 text-sm font-semibold hover:bg-zinc-900">
              Open dashboard
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto flex max-w-6xl flex-wrap gap-2 px-4 sm:px-6 lg:px-8">
          <Link href="/sign-up" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500">
            Start free trial
          </Link>
          <Link href="/how-it-works" className="rounded-lg border border-zinc-700 px-4 py-2 text-sm font-semibold hover:bg-zinc-900">
            How it works
          </Link>
          <Link href="/automation" className="rounded-lg border border-zinc-700 px-4 py-2 text-sm font-semibold hover:bg-zinc-900">
            Automation center
          </Link>
        </div>
      </section>
    </main>
  )
}

