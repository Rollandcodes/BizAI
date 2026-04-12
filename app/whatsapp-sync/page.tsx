import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'WhatsApp to Website Sync | Unified AI Inbox',
  description:
    'Blueprint for running a WhatsApp AI chatbot and syncing all conversations, leads, and automations back to your website dashboard.',
  alternates: {
    canonical: 'https://www.cypai.app/whatsapp-sync',
  },
}

const phases = [
  {
    title: 'Phase 1: WhatsApp channel ingestion',
    points: [
      'Connect Meta WhatsApp Cloud API webhook endpoint to receive inbound events.',
      'Normalize WhatsApp payloads into the same conversation schema as website chat.',
      'Store sender, message direction, delivery state, and timestamps in one timeline.',
    ],
  },
  {
    title: 'Phase 2: Unified AI and reply pipeline',
    points: [
      'Run the same AI prompt and business rules for web and WhatsApp channels.',
      'Generate response via AI engine and send outbound reply through WhatsApp API.',
      'Persist both inbound and outbound messages to dashboard conversation history.',
    ],
  },
  {
    title: 'Phase 3: CRM and automation sync',
    points: [
      'Auto-create/update leads when WhatsApp intent or contact details are detected.',
      'Trigger follow-up and abandonment automations from WhatsApp events.',
      'Expose channel-specific analytics while preserving unified pipeline metrics.',
    ],
  },
  {
    title: 'Phase 4: Team inbox controls',
    points: [
      'Add assignment, tagging, SLA timers, and handoff to human agent.',
      'Support internal notes and channel-aware status tracking.',
      'Provide one inbox view similar to GoHighLevel conversation model.',
    ],
  },
]

const capabilities = [
  ['Unified inbox', 'Website and WhatsApp messages in one conversation feed'],
  ['AI channel continuity', 'Same business context and policy engine across channels'],
  ['Automation hooks', 'Retry, alerts, and follow-up flows triggered from WhatsApp events'],
  ['Operational reporting', 'End-to-end logs for delivery, response quality, and conversion'],
  ['Billing continuity', 'Paddle handles secure checkout while additional payment options are being added'],
]

export default function WhatsAppSyncPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <section className="border-b border-zinc-800 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">WhatsApp integration blueprint</p>
          <h1 className="mt-3 text-4xl font-black sm:text-5xl">Run a WhatsApp chatbot and sync everything back to your website</h1>
          <p className="mt-5 max-w-3xl text-zinc-400">
            This implementation model mirrors the unified inbox pattern used by platforms like GoHighLevel: one thread, one CRM record, one automation layer across channels.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto grid max-w-6xl gap-4 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          {phases.map((phase) => (
            <article key={phase.title} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
              <h2 className="text-xl font-bold text-white">{phase.title}</h2>
              <ul className="mt-3 space-y-2 text-sm text-zinc-400">
                {phase.points.map((point) => (
                  <li key={point}>- {point}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-zinc-800 bg-zinc-900 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black text-white">What this gives your B2B SaaS operations</h2>
          <div className="mt-6 overflow-hidden rounded-2xl border border-zinc-800">
            <div className="grid grid-cols-2 bg-zinc-950 text-xs font-semibold uppercase tracking-wide text-zinc-500">
              <div className="p-3">Capability</div>
              <div className="border-l border-zinc-800 p-3">Impact</div>
            </div>
            {capabilities.map(([capability, impact], i) => (
              <div key={capability} className={`grid grid-cols-2 text-sm ${i % 2 === 0 ? 'bg-zinc-900' : 'bg-zinc-950'}`}>
                <div className="border-t border-zinc-800 p-3 text-zinc-100">{capability}</div>
                <div className="border-l border-t border-zinc-800 p-3 text-zinc-400">{impact}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto flex max-w-6xl flex-wrap gap-2 px-4 sm:px-6 lg:px-8">
          <Link href="/integrations" className="rounded-lg border border-zinc-700 px-4 py-2 text-sm font-semibold hover:bg-zinc-900">
            Back to integrations
          </Link>
          <Link href="/dashboard" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500">
            Open dashboard
          </Link>
        </div>
      </section>
    </main>
  )
}

