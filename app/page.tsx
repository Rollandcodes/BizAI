'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Analytics } from '@/lib/analytics'

type FAQ = { q: string; a: string }

const whoItsFor = [
  {
    emoji: '🚗',
    title: 'Car Rentals',
    points: ['Price quotes answered instantly', 'Bookings captured automatically'],
  },
  {
    emoji: '✂️',
    title: 'Barbershops & Salons',
    points: ['Appointment booking 24/7', 'Service prices in any language'],
  },
  {
    emoji: '🏨',
    title: 'Hotels & Guesthouses',
    points: ['Room availability and rates', 'Multilingual guest support'],
  },
  {
    emoji: '🍽️',
    title: 'Restaurants',
    points: ['Reservations and menu questions', 'Opening hours and location'],
  },
  {
    emoji: '🎓',
    title: 'Student Housing',
    points: ['International student inquiries', 'Room options in 5 languages'],
  },
  {
    emoji: '🏥',
    title: 'Clinics & Gyms',
    points: ['Appointment scheduling', 'Service and pricing questions'],
  },
]

const featureCards = [
  ['💬', 'AI Chat Widget', 'Embed on your website in 60 seconds. Handles questions, captures leads, and books appointments automatically.'],
  ['📱', 'WhatsApp Integration', 'Your AI answers WhatsApp messages 24/7. Connects to your WhatsApp Business number instantly.'],
  ['🌍', '5 Language Support', 'Auto-detects English, Turkish, Arabic, Russian, and Greek. Responds in the customer language every time.'],
  ['👥', 'CRM & Lead Management', 'Every lead is saved automatically. Track from New to Converted in one view.'],
  ['📅', 'Booking System', 'Customers book through AI chat. You confirm with one click and they receive instant confirmation.'],
  ['📨', 'Follow-up Tools', 'Pre-built WhatsApp templates for reminders, promotions, and re-engagement.'],
  ['📊', 'Analytics Dashboard', 'See conversations, lead rates, peak hours, language breakdown, and conversion funnel in real time.'],
  ['🔒', 'Agent Audit', 'Review every AI response with compliance scoring and weekly report support.'],
  ['📲', 'QR Code Generator', 'Print a QR code for walk-in customers to start chatting instantly.'],
  ['⚙️', 'Custom AI Training', 'Add prices, FAQs, and custom rules. Your AI learns your business quickly.'],
  ['🏢', 'Agency Mode', 'Manage multiple businesses from one login, perfect for agencies.'],
  ['⚡', '15-Minute Setup', 'Answer a few questions, copy one line of code, and go live.'],
] as const

const faqs: FAQ[] = [
  {
    q: 'How long does setup take?',
    a: 'Most businesses are live in about 15 minutes. Add your details, prices, and FAQs, then paste one line of code.',
  },
  {
    q: 'Which languages does the AI speak?',
    a: 'English, Turkish, Arabic, Russian, and Greek. It detects language automatically and replies in the same language.',
  },
  {
    q: 'Does it really work with WhatsApp?',
    a: 'Yes. Pro and Business plans connect to your WhatsApp Business number and reply to customers 24/7.',
  },
  {
    q: 'Can I control what the AI says?',
    a: 'Yes. You can define your own prices, FAQs, and instructions so replies follow your business rules.',
  },
  {
    q: 'What is the CRM feature?',
    a: 'Every lead is stored with contact details and status so your team can track progress from new to converted.',
  },
  {
    q: 'What happens when trial ends?',
    a: 'You choose a paid plan to continue. If you do not upgrade, the AI pauses with no automatic charge.',
  },
  {
    q: 'Do I need a website?',
    a: 'No. You can run through WhatsApp only or use a hosted chat page if you do not have a website.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. No contracts and no cancellation fees. Cancel from your dashboard in one click.',
  },
]

const comparisonRows = [
  ['AI Chat (5 languages)', '✓', '✓', '✗'],
  ['Lead CRM', '✓', '✗', '✗'],
  ['Booking System', '✓', '✗', '✗'],
  ['WhatsApp Integration', '✓', '✗', '✗'],
  ['Follow-up Tools', '✓', '✗', '✗'],
  ['Analytics & Reports', '✓', '✗', '✗'],
  ['Agent Audit', '✓', '✗', '✗'],
  ['Agency Mode', '✓', '✗', '✗'],
  ['5 Language Support', '✓', 'sometimes', '✗'],
  ['Setup time', '15 min', 'Days', '—'],
  ['Monthly cost', 'From $29', '$100-300', '$0 lost'],
]

const shippedUpgrades = [
  {
    title: 'Recovery Automation Dashboard',
    detail: 'Track queued, sent, failed, and conversion lift with timeline and drill-down logs.',
  },
  {
    title: 'Retry Policies by Event',
    detail: 'Set retry limits and recovery windows independently for signup and payment abandonment.',
  },
  {
    title: 'Failure Spike Alerting',
    detail: 'Automatic alerting to email/webhook with cooldown controls and one-click test alerts.',
  },
  {
    title: 'Signed Webhook Security',
    detail: 'Webhook payloads can be signed and verified to secure automation workflows.',
  },
  {
    title: 'Alert Log Analytics',
    detail: 'Filter, paginate, date-range, and export alert logs to CSV without manual reporting.',
  },
  {
    title: 'PayPal Billing Flow',
    detail: 'Subscription checkout is kept on PayPal so payout collection stays in your PayPal receiver.',
  },
]

const growthModules = [
  {
    title: 'Programmatic SEO pages',
    detail: 'City, niche, and use-case landing pages to compound long-tail organic traffic.',
  },
  {
    title: 'Competitor alternatives hub',
    detail: 'Create high-intent comparison pages to capture bottom-funnel search demand.',
  },
  {
    title: 'A/B testing engine',
    detail: 'Run controlled experiments on headline, CTA, pricing, and signup flow variants.',
  },
  {
    title: 'Signup and onboarding CRO',
    detail: 'Reduce friction from registration to first lead captured with guided activation.',
  },
  {
    title: 'Referral and affiliate automation',
    detail: 'Add partner and customer referral loops with tracked payouts and attribution.',
  },
  {
    title: 'Analytics tracking standardization',
    detail: 'Unify product and marketing events across GA4, Mixpanel, and ad channels.',
  },
]

const workflowTabs = {
  how: {
    title: 'How the system works',
    points: [
      'CypAI captures website and WhatsApp conversations 24/7 in 5 languages.',
      'Each conversation is analyzed, qualified, and saved into CRM automatically.',
      'Booking and follow-up workflows run from one dashboard without switching tools.',
    ],
  },
  connect: {
    title: 'How you connect it yourself',
    points: [
      'Create your account and add business FAQs, pricing, and service rules.',
      'Paste one widget script into your site and optionally connect WhatsApp.',
      'Activate automations and alerts to reduce manual recovery and support work.',
    ],
  },
  solves: {
    title: 'What each feature solves',
    points: [
      'AI Chat Widget: stops missed website leads outside business hours.',
      'Automation + Alerts: stops revenue leaks from abandoned signup/payment flows.',
      'CRM + Analytics: stops manual tracking and gives clear conversion visibility.',
    ],
  },
} as const

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [faqOpen, setFaqOpen] = useState<number | null>(0)
  const [showAnnouncement, setShowAnnouncement] = useState(true)
  const [scrolled, setScrolled] = useState(false)
  const [activeWorkflowTab, setActiveWorkflowTab] = useState<'how' | 'connect' | 'solves'>('how')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const mockupColors = [
    'bg-blue-600/30 text-blue-400',
    'bg-pink-600/30 text-pink-400',
    'bg-green-600/30 text-green-400',
  ]

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50">
      {showAnnouncement ? (
        <div className="border-b border-blue-500/20 bg-blue-600/10 px-4 py-2.5 text-center text-xs text-blue-200">
          <span>7-day free trial - No credit card required</span>
          <Link
            href="/signup?plan=pro"
            className="ml-2 font-semibold underline hover:text-blue-100"
            onClick={() => Analytics.heroCtaClicked('pro')}
          >
            Start free today →
          </Link>
          <button
            aria-label="Close announcement"
            onClick={() => setShowAnnouncement(false)}
            className="ml-3 rounded-sm text-blue-200 hover:text-blue-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-200"
          >
            ✕
          </button>
        </div>
      ) : null}

      <header
        className={`sticky top-0 z-50 border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-xl transition-shadow ${
          scrolled ? 'shadow-lg shadow-black/30' : ''
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center" aria-label="CypAI Home">
            <Image
              src="/images/cypai-logo.png"
              alt="CypAI"
              width={200}
              height={60}
              priority
              className="h-9 w-auto sm:h-11"
            />
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {[
              ['#features', 'Features'],
              ['#how-it-works', 'How It Works'],
              ['#automation', 'Automation'],
              ['#roadmap', 'Growth Modules'],
              ['#pricing', 'Pricing'],
              ['/how-it-works', 'Docs'],
              ['/whatsapp-sync', 'WhatsApp Sync'],
              ['/demo', 'Demo'],
              ['#faq', 'FAQ'],
              ['/contact', 'Contact'],
            ].map(([href, label]) => (
              <a key={href} href={href} className="text-sm text-zinc-400 transition-colors hover:text-white">
                {label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden text-sm text-zinc-400 transition-colors hover:text-white sm:block">
              Log in
            </Link>
            <Link
              href="/signup?plan=pro"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-500"
            >
              Start Free Trial
            </Link>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="rounded-lg border border-zinc-700 px-2 py-1 text-zinc-300 md:hidden"
              aria-label="Toggle menu"
            >
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {menuOpen ? (
          <div className="border-t border-zinc-800 px-4 py-3 md:hidden">
            {[
              ['#features', 'Features'],
              ['#how-it-works', 'How It Works'],
              ['#automation', 'Automation'],
              ['#roadmap', 'Growth Modules'],
              ['#pricing', 'Pricing'],
              ['/how-it-works', 'Docs'],
              ['/whatsapp-sync', 'WhatsApp Sync'],
              ['/demo', 'Demo'],
              ['#faq', 'FAQ'],
              ['/contact', 'Contact'],
            ].map(([href, label]) => (
              <a
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="block rounded-lg px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-900"
              >
                {label}
              </a>
            ))}
          </div>
        ) : null}
      </header>

      <section className="relative overflow-hidden bg-zinc-950">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-blue-600/5 blur-3xl" />
        <div className="pointer-events-none absolute left-1/4 top-32 h-[400px] w-[400px] rounded-full bg-blue-600/5 blur-3xl" />

        <div className="mx-auto max-w-7xl px-4 pb-16 pt-24 text-center sm:px-6 lg:px-8">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-600/10 px-4 py-2 text-xs font-medium text-blue-400">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-400" />
            Built for Cyprus and MENA businesses
          </div>

          <h1 className="mb-6 text-5xl font-black leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
            Never Miss
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              Another Customer
            </span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-xl leading-relaxed text-zinc-400">
            AI-powered customer service for car rentals, barbershops, hotels and restaurants in Northern Cyprus.
            Handles WhatsApp and website chat in 5 languages, 24/7.
          </p>

          <div className="mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/signup?plan=pro"
              onClick={() => Analytics.heroCtaClicked('pro')}
              className="rounded-xl bg-blue-600 px-8 py-4 text-lg font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-500 hover:shadow-xl hover:shadow-blue-500/20"
            >
              Start Free Trial →
            </Link>
            <Link
              href="/demo"
              onClick={() => Analytics.demoViewed()}
              className="rounded-xl border border-zinc-700 bg-zinc-800 px-8 py-4 text-lg font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-zinc-700"
            >
              Try Live Demo
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-zinc-500">
            <span>✓ Setup in 15 minutes</span>
            <span className="hidden sm:block">·</span>
            <span>✓ No credit card required</span>
            <span className="hidden sm:block">·</span>
            <span>✓ Cancel anytime</span>
          </div>

          <div className="mx-auto mt-16 max-w-4xl overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl shadow-black/50">
            <div className="flex items-center gap-2 border-b border-zinc-700/50 bg-zinc-800/50 px-4 py-3">
              <div className="h-3 w-3 rounded-full bg-red-500/70" />
              <div className="h-3 w-3 rounded-full bg-yellow-500/70" />
              <div className="h-3 w-3 rounded-full bg-green-500/70" />
              <span className="ml-4 text-xs font-mono text-zinc-500">cypai.app - dashboard</span>
            </div>

            <div className="grid grid-cols-2 gap-4 p-6 sm:grid-cols-4">
              {[
                ['247', 'Conversations', '+12%'],
                ['89', 'Leads captured', '+8%'],
                ['34', 'Bookings', '+15%'],
                ['38%', 'Conversion', '+3%'],
              ].map(([val, label, change]) => (
                <div key={label} className="rounded-xl bg-zinc-800/50 p-4">
                  <div className="mb-1 text-2xl font-bold text-white">{val}</div>
                  <div className="mb-2 text-xs text-zinc-500">{label}</div>
                  <div className="text-xs font-medium text-green-400">{change} this month</div>
                </div>
              ))}
            </div>

            <div className="px-6 pb-6">
              <div className="rounded-xl border border-zinc-700/30 bg-zinc-800/30 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-medium text-zinc-400">Live conversations</span>
                  <span className="rounded-full bg-green-500/20 px-2 py-0.5 text-xs text-green-400">● 3 active</span>
                </div>
                {[
                  ['Ahmed K.', 'How much for SUV 3 days?', '2m ago'],
                  ['Maria S.', 'Do you have rooms for July?', '5m ago'],
                  ['Yusuf T.', 'What time do you open?', '8m ago'],
                ].map(([name, msg, time], idx) => (
                  <div key={name} className="flex items-start gap-3 border-t border-zinc-700/30 py-2.5">
                    <div className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${mockupColors[idx]}`}>
                      {name.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-medium text-white">{name}</div>
                      <div className="truncate text-xs text-zinc-500">{msg}</div>
                    </div>
                    <span className="flex-shrink-0 text-xs text-zinc-600">{time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-zinc-800 bg-zinc-900 py-12">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-zinc-800 px-4 text-center sm:px-6 md:grid-cols-4 md:divide-x lg:px-8">
          {[
            ['24/7', 'Always online, zero downtime'],
            ['5', 'Languages auto-detected'],
            ['15min', 'Average setup time'],
            ['< 3s', 'AI response time'],
          ].map(([stat, label]) => (
            <div key={stat} className="px-4 py-4">
              <div className="mb-2 text-4xl font-black text-white">{stat}</div>
              <div className="text-sm text-zinc-500">{label}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="features" className="bg-zinc-950 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Who it&apos;s for</p>
          <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">Built for Cyprus businesses that talk to customers</h2>

          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3">
            {whoItsFor.map((card) => (
              <article
                key={card.title}
                className="cursor-pointer rounded-2xl border border-zinc-800 bg-zinc-900 p-6 transition-all duration-200 hover:-translate-y-1 hover:border-zinc-600"
              >
                <div className="mb-4 text-4xl">{card.emoji}</div>
                <h3 className="text-lg font-semibold text-white">{card.title}</h3>
                <ul className="mt-3 space-y-1 text-sm text-zinc-500">
                  {card.points.map((point) => (
                    <li key={point}>→ {point}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-zinc-950 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Features</p>
          <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">One platform. Every tool your business needs.</h2>
          <p className="mt-4 max-w-3xl text-base text-zinc-400">
            Stop using five different apps. CypAI combines AI chat, CRM, bookings, and analytics into one dashboard.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featureCards.map(([icon, title, desc]) => (
              <article
                key={title}
                className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 transition-all hover:border-blue-500/30 hover:bg-zinc-900/80"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600/20 text-xl text-blue-400">
                  {icon}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">{title}</h3>
                <p className="text-sm leading-relaxed text-zinc-400">{desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="border-y border-zinc-800 bg-zinc-900 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">How it works</p>
          <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">Live in 15 minutes</h2>

          <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              ['01', '📝', 'Sign Up & Tell Us Your Business', 'Create account, add your details, prices, hours, and FAQ. The AI learns quickly.'],
              ['02', '🔗', 'Add Widget to Your Website', 'Copy one line of code, paste it into your site, and your AI chat goes live instantly.'],
              ['03', '🚀', 'Watch Leads Come In', 'Your AI handles questions 24/7 and every lead appears in your dashboard automatically.'],
            ].map(([step, icon, title, desc]) => (
              <article key={step} className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
                <div className="mb-2 text-6xl font-black text-zinc-800">{step}</div>
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600/20 text-xl text-blue-400">{icon}</div>
                <h3 className="text-xl font-bold text-white">{title}</h3>
                <p className="mt-2 text-sm text-zinc-400">{desc}</p>
              </article>
            ))}
          </div>

          <div className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
            <div className="flex flex-wrap gap-2">
              {[
                ['how', 'System Flow'],
                ['connect', 'Connect It Yourself'],
                ['solves', 'Problem-Solution Map'],
              ].map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveWorkflowTab(key as 'how' | 'connect' | 'solves')}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                    activeWorkflowTab === key
                      ? 'border-blue-500 bg-blue-500/20 text-blue-200'
                      : 'border-zinc-700 text-zinc-300 hover:bg-zinc-900'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <h3 className="mt-5 text-xl font-bold text-white">{workflowTabs[activeWorkflowTab].title}</h3>
            <ul className="mt-3 space-y-2 text-sm text-zinc-400">
              {workflowTabs[activeWorkflowTab].points.map((point) => (
                <li key={point}>• {point}</li>
              ))}
            </ul>
            <div className="mt-5 flex flex-wrap gap-3 text-xs">
              <Link href="/how-it-works" className="rounded-full border border-zinc-700 px-3 py-1.5 text-zinc-300 hover:bg-zinc-900">
                Full setup guide
              </Link>
              <Link href="/automation" className="rounded-full border border-zinc-700 px-3 py-1.5 text-zinc-300 hover:bg-zinc-900">
                Automation playbook
              </Link>
              <Link href="/integrations" className="rounded-full border border-zinc-700 px-3 py-1.5 text-zinc-300 hover:bg-zinc-900">
                Integrations and connectors
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="automation" className="bg-zinc-950 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">No manual work</p>
          <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">Automation-first operations for B2B SaaS teams</h2>
          <p className="mt-4 max-w-3xl text-zinc-400">
            Run lead recovery, follow-ups, and failure monitoring automatically. Your team focuses on deals, not repetitive admin tasks.
          </p>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              ['Abandonment Recovery', 'Automatically retries failed signup/payment flows based on policy rules.'],
              ['Spike Monitoring', 'Triggers alerts to webhook/email when failure-rate thresholds are crossed.'],
              ['Delivery Logs', 'Tracks every alert attempt with filters, date ranges, and CSV export.'],
              ['Retry Controls', 'Per-event retry windows and max retries to reduce noisy manual intervention.'],
              ['Policy Testing', 'Send test alerts and validate channels before production issues happen.'],
              ['Secure Webhooks', 'HMAC-signed outgoing webhooks with verification support on your receiver.'],
            ].map(([title, text]) => (
              <article key={title} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
                <h3 className="text-lg font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm text-zinc-400">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-zinc-800 bg-zinc-900 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">What we implemented</p>
          <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">Recent platform upgrades shipped</h2>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {shippedUpgrades.map((item) => (
              <article key={item.title} className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
                <h3 className="text-base font-bold text-white">{item.title}</h3>
                <p className="mt-2 text-sm text-zinc-400">{item.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="roadmap" className="bg-zinc-950 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Based on your growth skill stack</p>
          <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">High-impact modules we can add next</h2>
          <p className="mt-4 max-w-3xl text-zinc-400">
            These are aligned with your B2B SaaS goals: more organic traffic, less manual work, and stronger conversion performance.
          </p>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {growthModules.map((item) => (
              <article key={item.title} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
                <h3 className="text-base font-bold text-white">{item.title}</h3>
                <p className="mt-2 text-sm text-zinc-400">{item.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-zinc-950 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Why CypAI</p>
          <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">More than just a chatbot</h2>

          <div className="mt-10 overflow-hidden rounded-2xl border border-zinc-800">
            <div className="grid grid-cols-4 bg-zinc-900 text-sm">
              <div className="p-4 font-semibold text-zinc-300">Feature</div>
              <div className="border-l border-zinc-800 bg-blue-600/10 p-4 font-bold text-blue-400">CypAI ✦</div>
              <div className="border-l border-zinc-800 p-4 font-semibold text-zinc-400">Basic Chatbot</div>
              <div className="border-l border-zinc-800 p-4 font-semibold text-zinc-400">No AI</div>
            </div>

            {comparisonRows.map((row, i) => (
              <div key={row[0]} className={`grid grid-cols-4 text-sm ${i % 2 === 0 ? 'bg-zinc-950' : 'bg-zinc-900/30'}`}>
                <div className="border-t border-zinc-800 p-4 text-zinc-300">{row[0]}</div>
                <div className="border-l border-t border-zinc-800 bg-blue-600/5 p-4 font-semibold text-green-400">{row[1]}</div>
                <div className="border-l border-t border-zinc-800 p-4 text-zinc-400">{row[2]}</div>
                <div className="border-l border-t border-zinc-800 p-4 text-zinc-700">{row[3]}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="bg-zinc-950 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Pricing</p>
          <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">Simple pricing, no surprises</h2>
          <p className="mt-4 text-zinc-400">7-day free trial on all plans. No credit card required. Cancel anytime.</p>
          <p className="mt-2 text-sm text-blue-300">We accept all major card payments via PayPal checkout. Stripe direct checkout is marked as coming soon.</p>
          <p className="mt-1 text-xs text-zinc-500">Current receiver: PayPal. Coming soon: native Stripe checkout option.</p>

          <div className="mt-10 grid grid-cols-1 items-stretch gap-6 md:grid-cols-3">
            {[
              {
                name: 'Starter',
                price: '$29',
                desc: 'Perfect for small local businesses just getting started',
                featured: false,
                plan: 'starter',
                list: ['500 messages/month', 'Website chat widget', 'Lead capture', 'Basic CRM', 'QR code for walk-ins', '5 language support', 'Basic analytics', 'Email support', '7-day free trial'],
              },
              {
                name: 'Pro',
                price: '$79',
                desc: 'For growing businesses that want full control',
                featured: true,
                plan: 'pro',
                list: ['Unlimited messages', 'Website chat widget', 'WhatsApp integration', 'Full CRM', 'Booking system', 'Follow-up tools', 'Advanced analytics', 'Custom AI training', 'Priority support', '7-day free trial'],
              },
              {
                name: 'Business',
                price: '$149',
                desc: 'For agencies and serious multi-location businesses',
                featured: false,
                plan: 'business',
                list: ['Everything in Pro', 'Agent audit and compliance scoring', 'Weekly PDF reports', 'Multi-location support', 'Agency mode', 'Dedicated onboarding call', 'Phone support', 'SLA guarantee', '7-day free trial'],
              },
            ].map((plan) => (
              <article
                key={plan.name}
                className={`relative flex flex-col rounded-2xl bg-zinc-900 p-8 ${
                  plan.featured
                    ? 'border-2 border-blue-500 shadow-xl shadow-blue-500/10'
                    : 'border border-zinc-800'
                }`}
              >
                {plan.featured ? (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-4 py-1.5 text-xs font-bold text-white">
                    ⭐ Most Popular
                  </span>
                ) : null}
                <p className="mb-1 text-sm font-semibold uppercase tracking-wider text-zinc-400">{plan.name}</p>
                <div className="text-5xl font-black text-white">
                  {plan.price}
                  <span className="ml-1 text-lg text-zinc-500">/mo</span>
                </div>
                <p className="mb-6 mt-3 text-sm text-zinc-500">{plan.desc}</p>
                <div className="mb-6 border-t border-zinc-800" />
                <ul className="space-y-2 text-sm text-zinc-300">
                  {plan.list.map((item) => (
                    <li key={item}>✓ {item}</li>
                  ))}
                  <li>✓ All major cards via PayPal checkout</li>
                  <li>✓ Stripe direct checkout (coming soon)</li>
                </ul>
                <Link
                  href={`/signup?plan=${plan.plan}`}
                  className={`mt-auto rounded-xl px-6 py-3 text-center text-sm font-semibold transition-all ${
                    plan.featured
                      ? 'bg-blue-600 text-white hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/25'
                      : 'border border-zinc-700 bg-zinc-800 text-zinc-100 hover:bg-zinc-700'
                  }`}
                >
                  Start Free Trial
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-zinc-800 bg-zinc-900 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Testimonials</p>
          <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">Trusted by Cyprus businesses</h2>
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              ['Kyrenia Car Rentals', 'Before CypAI I answered messages at midnight. Now bookings are handled automatically.', 'M.A.', 'Bookings up 40%'],
              ['Bellapais Hotel', 'Guests message in multiple languages and CypAI handles each one perfectly.', 'A.K.', 'Zero missed inquiries'],
              ['Studio One Barbershop', 'Saved me hours each week by handling repetitive questions instantly.', 'Y.O.', '2+ hours saved daily'],
            ].map(([business, quote, initials, result]) => (
              <article key={business} className="rounded-2xl border border-zinc-800 bg-zinc-950 p-7 transition-colors hover:border-zinc-700">
                <div className="mb-4 text-lg text-yellow-400">★★★★★</div>
                <p className="mb-6 text-sm italic leading-relaxed text-zinc-300">{quote}</p>
                <div className="mb-5 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 text-sm font-bold text-zinc-200">{initials}</span>
                  <div>
                    <p className="text-sm font-semibold text-white">{business}</p>
                    <p className="text-xs text-zinc-500">Local business</p>
                  </div>
                </div>
                <span className="rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-400">{result}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="bg-zinc-950 py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">FAQ</p>
          <h2 className="mt-3 text-center text-3xl font-black text-white sm:text-4xl">Common questions</h2>

          <div className="mt-10">
            {faqs.map((item, idx) => {
              const open = faqOpen === idx
              return (
                <article key={item.q} className="border-b border-zinc-800 py-5">
                  <button
                    className="flex w-full items-center justify-between text-left font-medium text-white transition-colors hover:text-blue-400"
                    onClick={() => setFaqOpen(open ? null : idx)}
                  >
                    <span>{item.q}</span>
                    <span className="text-zinc-500">{open ? '−' : '+'}</span>
                  </button>
                  {open ? <p className="pt-3 text-sm leading-relaxed text-zinc-400">{item.a}</p> : null}
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="border-t border-zinc-800 bg-gradient-to-b from-zinc-950 to-zinc-900 py-32">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-600/10 px-4 py-2 text-xs font-medium text-blue-400">
            🇨🇾 Serving businesses across Northern Cyprus
          </div>
          <h2 className="text-5xl font-black leading-tight text-white sm:text-6xl">Ready to never miss a customer again?</h2>
          <p className="mb-10 mt-6 text-xl text-zinc-400">
            Join businesses using AI to capture leads and handle customers 24/7. Start your free 7-day trial.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/signup?plan=pro"
              className="rounded-xl bg-blue-600 px-8 py-4 text-lg font-bold text-white transition-all duration-200 hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/25"
            >
              Start Free Trial →
            </Link>
            <a
              href="https://wa.me/905338425559?text=Hi! I want to learn more about CypAI"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-green-600 px-8 py-4 text-lg font-bold text-white transition-all duration-200 hover:bg-green-500"
            >
              Chat on WhatsApp
            </a>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm text-zinc-500">
            <span>✓ No credit card required</span>
            <span>✓ Setup in 15 minutes</span>
            <span>✓ Cancel anytime</span>
            <span>✓ 5 language support</span>
          </div>
        </div>
      </section>

      <footer className="border-t border-zinc-800 bg-zinc-950 pb-8 pt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-sm">🤖</span>
                <span className="text-lg font-bold text-white">CypAI</span>
              </div>
              <p className="mt-4 text-sm text-zinc-500">
                AI customer service for local businesses. Chat, CRM, bookings, and WhatsApp in one platform.
              </p>
              <div className="mt-4 text-lg">🇬🇧 🇹🇷 🇸🇦 🇷🇺 🇬🇷</div>
              <a href="mailto:cypai.app@cypai.app" className="mt-4 block text-sm text-zinc-500 hover:text-white">
                cypai.app@cypai.app
              </a>
              <a href="https://wa.me/905338425559" className="mt-2 block text-sm text-zinc-500 hover:text-white">
                +90 533 842 5559
              </a>
            </div>

            <div>
              <p className="text-sm font-semibold text-white">Product</p>
              <div className="mt-3 space-y-2 text-sm text-zinc-500">
                <a href="#features" className="block hover:text-white">Features</a>
                <Link href="/how-it-works" className="block hover:text-white">How It Works</Link>
                <Link href="/automation" className="block hover:text-white">Automation</Link>
                <Link href="/integrations" className="block hover:text-white">Integrations</Link>
                <Link href="/whatsapp-sync" className="block hover:text-white">WhatsApp Sync</Link>
                <a href="#pricing" className="block hover:text-white">Pricing</a>
                <Link href="/demo" className="block hover:text-white">Live Demo</Link>
                <Link href="/dashboard" className="block hover:text-white">Dashboard</Link>
                <Link href="/blog" className="block hover:text-white">Blog</Link>
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-white">Company</p>
              <div className="mt-3 space-y-2 text-sm text-zinc-500">
                <Link href="/contact" className="block hover:text-white">Contact</Link>
                <Link href="/privacy" className="block hover:text-white">Privacy Policy</Link>
                <Link href="/terms" className="block hover:text-white">Terms</Link>
                <Link href="/login" className="block hover:text-white">Client Login</Link>
                <Link href="/affiliate" className="block hover:text-white">Affiliate Program</Link>
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-white">Languages</p>
              <div className="mt-3 space-y-2 text-sm text-zinc-500">
                <p>🇬🇧 English</p>
                <p>🇹🇷 Türkçe</p>
                <p>🇸🇦 العربية</p>
                <p>🇷🇺 Русский</p>
                <p>🇬🇷 Ελληνικά</p>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-2 border-t border-zinc-800 pt-8 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 CypAI. All rights reserved.</p>
            <p>Made for Northern Cyprus 🇨🇾 · Kyrenia · Nicosia · Famagusta</p>
          </div>
        </div>
      </footer>

      <a
        href="https://wa.me/905338425559?text=Hi! I want to learn more about CypAI"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        title="Chat on WhatsApp"
        className="fixed bottom-6 left-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 shadow-lg shadow-green-500/30 transition-all duration-200 hover:scale-110 hover:bg-green-400"
      >
        <svg viewBox="0 0 24 24" className="h-7 w-7 fill-white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
    </main>
  )
}
