import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Navigation } from '@/components/home/Navigation'
import { FAQAccordion } from '@/components/home/FAQAccordion'

export const metadata: Metadata = {
  metadataBase: new URL('https://www.cypai.app'),
  title: 'CypAI - AI Customer Service for Cyprus Businesses | Never Miss a Customer',
  description: 'AI-powered customer service for car rentals, barbershops, hotels and restaurants in Northern Cyprus. Handles WhatsApp and website chat in 5 languages, 24/7. Start free trial.',
  keywords: 'AI customer service, WhatsApp chatbot, Cyprus business AI, multilingual AI, 24/7 customer support, car rental AI, hotel AI, restaurant AI, barbershop AI, clinic AI',
  openGraph: {
    title: 'CypAI - Never Miss Another Customer',
    description: 'AI customer service for Cyprus businesses. 5 languages, 24/7, WhatsApp + website. Setup in 15 minutes.',
    url: 'https://www.cypai.app',
    siteName: 'CypAI',
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['tr_TR', 'ar_AR', 'ru_RU', 'el_GR'],
    images: [
      {
        url: '/images/cypai-logo.png',
        width: 512,
        height: 512,
        alt: 'CypAI logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@cypai',
    title: 'CypAI - AI for Cyprus Businesses',
    description: 'AI chat, CRM, bookings, and WhatsApp in one platform.',
    images: ['/images/cypai-logo.png'],
  },
  alternates: {
    canonical: 'https://www.cypai.app',
    languages: {
      en: 'https://www.cypai.app',
      tr: 'https://www.cypai.app',
      ar: 'https://www.cypai.app',
      ru: 'https://www.cypai.app',
      el: 'https://www.cypai.app',
      'x-default': 'https://www.cypai.app',
    },
  },
  robots: {
    index: true,
    follow: true,
  },
}

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SoftwareApplication',
      '@id': 'https://www.cypai.app/#software',
      name: 'CypAI',
      description: 'AI-powered customer service, lead generation, and booking automation for Cyprus and MENA businesses.',
      url: 'https://www.cypai.app',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      offers: [
        { '@type': 'Offer', name: 'Starter', price: '29', priceCurrency: 'USD' },
        { '@type': 'Offer', name: 'Pro', price: '79', priceCurrency: 'USD' },
        { '@type': 'Offer', name: 'Business', price: '149', priceCurrency: 'USD' },
      ],
      featureList: [
        'WhatsApp Integration',
        'Multilingual AI Chat (English, Turkish, Arabic, Russian, Greek)',
        'Booking System',
        'Lead CRM',
        'Analytics Dashboard',
        'QR Code Generator',
      ],
      areaServed: [
        { '@type': 'Country', name: 'Cyprus' },
        { '@type': 'DefinedRegion', name: 'Middle East and North Africa (MENA)' },
      ],
      knowsLanguage: ['en', 'tr', 'ar', 'ru', 'el'],
      softwareHelp: 'https://www.cypai.app/#faq',
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        ratingCount: '200',
      },
    },
    {
      '@type': 'LocalBusiness',
      '@id': 'https://www.cypai.app/#organization',
      name: 'CypAI',
      image: 'https://www.cypai.app/images/cypai-logo.png',
      url: 'https://www.cypai.app',
      telephone: '+905338425559',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Kyrenia',
        addressCountry: 'CY',
      },
      areaServed: [
        { '@type': 'Country', name: 'Cyprus' },
        { '@type': 'DefinedRegion', name: 'Middle East' },
      ],
      sameAs: [
        'https://www.linkedin.com/company/cypai',
      ],
    },
  ],
}

const industries = [
  { emoji: '🚗', title: 'Car Rentals', href: '/car-rentals', desc: 'Price quotes answered instantly' },
  { emoji: '🍽️', title: 'Restaurants', href: '/restaurants', desc: 'Reservations handled 24/7' },
  { emoji: '🏨', title: 'Hotels', href: '/hotels', desc: 'Guest inquiries in any language' },
  { emoji: '✂️', title: 'Barbershops', href: '/barbershops', desc: 'Appointment booking 24/7' },
  { emoji: '🏥', title: 'Clinics', href: '/clinics', desc: 'Patient scheduling simplified' },
  { emoji: '🎓', title: 'Student Housing', href: '/student-housing', desc: 'International student inquiries' },
]

const features = [
  { icon: '💬', title: 'AI Chat Widget', desc: 'Embed on your website in 60 seconds. Handles questions, captures leads, and books appointments automatically.' },
  { icon: '📱', title: 'WhatsApp Integration', desc: 'Your AI answers WhatsApp messages 24/7. Connects to your WhatsApp Business number instantly.' },
  { icon: '🌍', title: '5 Language Support', desc: 'Auto-detects English, Turkish, Arabic, Russian, and Greek. Responds in the customer language every time.' },
  { icon: '👥', title: 'CRM & Lead Management', desc: 'Every lead is saved automatically. Track from New to Converted in one view.' },
  { icon: '📅', title: 'Booking System', desc: 'Customers book through AI chat. You confirm with one click and they receive instant confirmation.' },
  { icon: '📨', title: 'Follow-up Tools', desc: 'Pre-built WhatsApp templates for reminders, promotions, and re-engagement.' },
  { icon: '📊', title: 'Analytics Dashboard', desc: 'See conversations, lead rates, peak hours, language breakdown, and conversion funnel in real time.' },
  { icon: '🔒', title: 'Agent Audit', desc: 'Review every AI response with compliance scoring and weekly report support.' },
  { icon: '📲', title: 'QR Code Generator', desc: 'Print a QR code for walk-in customers to start chatting instantly.' },
  { icon: '⚙️', title: 'Custom AI Training', desc: 'Add prices, FAQs, and custom rules. Your AI learns your business quickly.' },
  { icon: '🏢', title: 'Multi-location', desc: 'Manage multiple branches from one dashboard with unified analytics.' },
  { icon: '⚡', title: '15-Minute Setup', desc: 'Answer a few questions, copy one line of code, and go live.' },
]

const howItWorks = [
  {
    step: '01',
    title: 'Connect Your Business',
    desc: 'Add your business details, prices, FAQs, and service rules in minutes.',
    icon: '🔗',
  },
  {
    step: '02',
    title: 'Add Chat Channels',
    desc: 'Embed our widget on your website and connect your WhatsApp Business number.',
    icon: '💬',
  },
  {
    step: '03',
    title: 'AI Handles Inquiries',
    desc: 'Our AI answers questions, captures leads, and books appointments 24/7.',
    icon: '🤖',
  },
]

const comparisonData = [
  { feature: 'AI Chat (5 languages)', cypai: true, basic: true, none: false },
  { feature: 'Lead CRM', cypai: true, basic: false, none: false },
  { feature: 'Booking System', cypai: true, basic: false, none: false },
  { feature: 'WhatsApp Integration', cypai: true, basic: false, none: false },
  { feature: 'Follow-up Tools', cypai: true, basic: false, none: false },
  { feature: 'Analytics & Reports', cypai: true, basic: false, none: false },
  { feature: 'Agent Audit', cypai: true, basic: false, none: false },
  { feature: 'Multi-location', cypai: true, basic: false, none: false },
  { feature: 'Setup time', cypai: '15 min', basic: 'Days', none: '—' },
  { feature: 'Monthly cost', cypai: 'From $29', basic: '$100-300', none: '$0 lost' },
]

const pricingPlans = [
  {
    name: 'Starter',
    price: 29,
    desc: 'Perfect for small businesses',
    features: ['AI Chat Widget', '5 Language Support', 'Basic CRM', '50 conversations/mo', 'Email support'],
    cta: 'Start Free Trial',
    popular: false,
  },
  {
    name: 'Pro',
    price: 79,
    desc: 'Most popular for growing businesses',
    features: ['Everything in Starter', 'WhatsApp Integration', 'Booking System', 'Unlimited conversations', 'Follow-up Tools', 'Priority support', 'Analytics Dashboard'],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Business',
    price: 149,
    desc: 'For multi-location businesses',
    features: ['Everything in Pro', 'Multi-location', 'Agent Audit', 'Custom AI Training', 'Dedicated account manager', 'SLA guarantee'],
    cta: 'Contact Sales',
    popular: false,
  },
]

const faqs = [
  { question: 'How long does setup take?', answer: 'Most businesses are live in about 15 minutes. Add your details, prices, and FAQs, then paste one line of code.' },
  { question: 'Which languages does the AI speak?', answer: 'English, Turkish, Arabic, Russian, and Greek. It detects language automatically and replies in the same language.' },
  { question: 'Does it really work with WhatsApp?', answer: 'Yes. Pro and Business plans connect to your WhatsApp Business number and reply to customers 24/7.' },
  { question: 'Can I control what the AI says?', answer: 'Yes. You can define your own prices, FAQs, and instructions so replies follow your business rules.' },
  { question: 'What is the CRM feature?', answer: 'Every lead is stored with contact details and status so your team can track progress from new to converted.' },
  { question: 'What happens when trial ends?', answer: 'You choose a paid plan to continue. If you do not upgrade, the AI pauses with no automatic charge.' },
  { question: 'Do I need a website?', answer: 'No. You can run through WhatsApp only or use a hosted chat page if you do not have a website.' },
  { question: 'Can I cancel anytime?', answer: 'Yes. No contracts and no cancellation fees. Cancel from your dashboard in one click.' },
]

const languages = [
  { name: 'English', flag: '🇬🇧' },
  { name: 'Türkçe', flag: '🇹🇷' },
  { name: 'العربية', flag: '🇸🇦' },
  { name: 'Русский', flag: '🇷🇺' },
  { name: 'Ελληνικά', flag: '🇬🇷' },
]

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <main className="min-h-screen bg-[#0a0f1e] text-white">
        {/* Amber top border */}
        <div className="h-1 w-full bg-[#e8a020]" />

        {/* Section 1: Navigation */}
        <Navigation />

        {/* Section 2: Hero */}
        <section className="relative min-h-screen overflow-hidden bg-[#0a0f1e] pt-16">
          {/* Floating Orbs */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="animate-float-orb absolute -left-20 top-20 h-72 w-72 rounded-full bg-[#e8a020]/20 blur-3xl" />
            <div className="animate-float-orb absolute left-1/3 top-40 h-96 w-96 rounded-full bg-blue-500/15 blur-3xl" style={{ animationDelay: '5s' }} />
            <div className="animate-float-orb absolute -right-20 top-60 h-80 w-80 rounded-full bg-[#e8a020]/10 blur-3xl" style={{ animationDelay: '10s' }} />
          </div>

          <div className="relative z-10 mx-auto max-w-7xl px-4 pb-24 pt-20 sm:px-6 lg:px-8">
            {/* Trust Badge */}
            <div className="mb-8 inline-flex animate-fade-up items-center gap-2 rounded-full border border-[#e8a020]/20 bg-[#e8a020]/10 px-4 py-2 text-sm font-medium text-[#e8a020]">
              <span className="animate-blink-dot">●</span>
              Trusted by 200+ Cyprus businesses
            </div>

            {/* Headline */}
            <h1 className="mb-6 text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              <span className="text-white">Never Miss</span>
              <br />
              <span className="animate-shimmer">Another Customer</span>
            </h1>

            {/* Subheadline */}
            <p className="mx-auto mb-10 max-w-2xl text-xl leading-relaxed text-white/70">
              AI customer service for Cyprus businesses. Handles WhatsApp and website chat in 5 languages, 24/7.
            </p>

            {/* CTAs */}
            <div className="mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/signup?plan=pro"
                className="rounded-full bg-[#e8a020] px-8 py-4 text-lg font-bold text-[#1a1a2e] shadow-[0_0_30px_rgba(232,160,32,0.4)] transition-all hover:bg-[#f59e0b] hover:shadow-[0_0_50px_rgba(232,160,32,0.7)] hover:scale-105"
              >
                Start Free Trial — Free for 7 Days
              </Link>
              <Link
                href="/demo"
                className="rounded-full border border-white/20 bg-white/10 px-8 py-4 text-lg font-semibold text-white backdrop-blur-sm transition-all hover:scale-105 hover:bg-white/20"
              >
                Watch Live Demo →
              </Link>
            </div>

            {/* Trust Line */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/60">
              <span>✓ No credit card</span>
              <span className="hidden sm:block">·</span>
              <span>✓ Setup in 15 minutes</span>
              <span className="hidden sm:block">·</span>
              <span>✓ Cancel anytime</span>
            </div>

            {/* Dashboard Mockup */}
            <div className="animate-float-card mx-auto mt-16 max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-[#1a1a2e]/80 shadow-2xl shadow-black/50">
              <div className="flex items-center gap-2 border-b border-white/10 bg-[#16213e] px-4 py-3">
                <div className="h-3 w-3 rounded-full bg-red-500/70" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/70" />
                <div className="h-3 w-3 rounded-full bg-green-500/70" />
                <span className="ml-4 text-xs font-mono text-white/40">cypai.app - dashboard</span>
              </div>

              <div className="grid grid-cols-2 gap-4 p-6 sm:grid-cols-4">
                {[
                  ['247', 'Conversations', '+12%'],
                  ['89', 'Leads captured', '+8%'],
                  ['34', 'Bookings', '+15%'],
                  ['38%', 'Conversion', '+3%'],
                ].map(([val, label, change]) => (
                  <div key={label} className="rounded-xl border border-white/5 bg-white/5 p-4">
                    <div className="mb-1 text-2xl font-bold text-white">{val}</div>
                    <div className="mb-2 text-xs text-white/50">{label}</div>
                    <div className="text-xs font-medium text-green-400">{change} this month</div>
                  </div>
                ))}
              </div>

              <div className="px-6 pb-6">
                <div className="rounded-xl border border-white/5 bg-white/5 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-medium text-white/70">Live conversations</span>
                    <span className="rounded-full bg-green-500/20 px-2 py-0.5 text-xs text-green-400">● 3 active</span>
                  </div>
                  {[
                    ['Ahmed K.', 'How much for SUV 3 days?', '2m ago'],
                    ['Maria S.', 'Do you have rooms for July?', '5m ago'],
                    ['Yusuf T.', 'What time do you open?', '8m ago'],
                  ].map(([name, msg, time], idx) => (
                    <div key={name as string} className="flex items-start gap-3 border-t border-white/5 py-2.5">
                      <div className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                        idx === 0 ? 'bg-blue-600/30 text-blue-400' :
                        idx === 1 ? 'bg-pink-600/30 text-pink-400' :
                        'bg-green-600/30 text-green-400'
                      }`}>
                        {(name as string).charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-medium text-white">{name}</div>
                        <div className="truncate text-xs text-white/50">{msg}</div>
                      </div>
                      <span className="flex-shrink-0 text-xs text-white/30">{time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Stats Bar */}
        <section className="border-y border-white/10 bg-[#16213e] py-12">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 text-center sm:px-6 md:grid-cols-4 lg:px-8">
            {[
              { value: '200+', label: 'Cyprus Businesses', suffix: '' },
              { value: '5', label: 'Languages', suffix: '' },
              { value: '<3s', label: 'AI Response Time', suffix: '' },
              { value: '15min', label: 'Average Setup', suffix: '' },
            ].map((stat) => (
              <div key={stat.label} className="border-l-2 border-[#e8a020] pl-4">
                <div className="mb-1 text-4xl font-black text-[#e8a020]">{stat.value}{stat.suffix}</div>
                <div className="text-sm text-white/60">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4: Industries */}
        <section id="features" className="bg-[#0a0f1e] py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-[#e8a020]">WHO IT'S FOR</p>
            <h2 className="mt-3 text-center text-3xl font-black text-white sm:text-4xl">
              Built for Cyprus businesses that talk to customers
            </h2>

            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {industries.map((industry) => (
                <Link
                  key={industry.href}
                  href={industry.href}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#16213e] p-6 transition-all hover:-translate-y-1 hover:border-[#e8a020]/50"
                >
                  <div className="mb-4 text-4xl">{industry.emoji}</div>
                  <h3 className="text-lg font-semibold text-white group-hover:text-[#e8a020]">
                    {industry.title}
                  </h3>
                  <p className="mt-1 text-sm text-white/60">{industry.desc}</p>
                  <div className="absolute bottom-4 right-4 opacity-0 transition-opacity group-hover:opacity-100">
                    <span className="text-[#e8a020]">→</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Section 5: How It Works */}
        <section id="how-it-works" className="bg-[#16213e] py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-[#e8a020]">HOW IT WORKS</p>
            <h2 className="mt-3 text-center text-3xl font-black text-white sm:text-4xl">
              Get started in 3 simple steps
            </h2>

            <div className="mt-16 relative">
              {/* Connecting Lines */}
              <div className="absolute top-1/2 left-0 hidden h-0.5 w-full -translate-y-1/2 transform lg:block">
                <div className="mx-auto max-w-3xl border-t-2 border-dashed border-white/10" />
              </div>

              <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-12">
                {howItWorks.map((item, idx) => (
                  <div key={item.step} className="relative flex flex-col items-center text-center">
                    <div className="absolute -top-8 left-1/2 z-0 -translate-x-1/2 transform text-8xl font-black text-white/[0.03] lg:-top-12">
                      {item.step}
                    </div>
                    <div className="relative z-10 mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-white/10 bg-[#0a0f1e] text-4xl shadow-lg">
                      {item.icon}
                    </div>
                    <h3 className="text-xl font-bold text-white">{item.title}</h3>
                    <p className="mt-2 max-w-xs text-white/60">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-16 text-center">
              <Link
                href="/signup"
                className="inline-block rounded-full border border-white/20 bg-white/10 px-8 py-3 text-lg font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20"
              >
                Start Free — Takes 15 Minutes
              </Link>
            </div>
          </div>
        </section>

        {/* Section 6: Features */}
        <section className="bg-[#0a0f1e] py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-[#e8a020]">FEATURES</p>
            <h2 className="mt-3 text-center text-3xl font-black text-white sm:text-4xl">
              Everything your business needs
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-white/60">
              One platform. Every tool your business needs to capture leads and convert customers.
            </p>

            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-white/10 bg-[#16213e] p-6 transition-all hover:border-[#e8a020]/30"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#e8a020]/10 text-2xl">
                    {feature.icon}
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-white">{feature.title}</h3>
                  <p className="text-sm leading-relaxed text-white/60">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 7: Language Showcase */}
        <section className="bg-[#16213e] py-24">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#e8a020]">MULTILINGUAL AI</p>
              <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">
                Your customers speak many languages. CypAI speaks them all.
              </h2>
              <p className="mt-4 text-white/60">
                Our AI automatically detects and responds in the same language as your customer. No setup required.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                {languages.map((lang, idx) => (
                  <span
                    key={lang.name}
                    className={`animate-fade-up inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white`}
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    <span>{lang.flag}</span>
                    {lang.name}
                  </span>
                ))}
              </div>
            </div>

            {/* WhatsApp Mockup */}
            <div className="mx-auto w-full max-w-sm overflow-hidden rounded-3xl border border-white/10 bg-[#0a0f1e] shadow-2xl">
              <div className="flex items-center gap-3 border-b border-white/10 bg-[#16213e] p-4">
                <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center">
                  <span className="text-lg">💬</span>
                </div>
                <div>
                  <div className="font-medium text-white">Your Business</div>
                  <div className="text-xs text-green-400">Online</div>
                </div>
              </div>
              <div className="p-4 space-y-4">
                <div className="flex gap-3">
                  <div className="h-8 w-8 flex-shrink-0 rounded-full bg-blue-500/20" />
                  <div className="rounded-2xl rounded-tl-md border border-white/10 bg-white/10 p-3 max-w-[80%]">
                    <p className="text-sm text-white">Hello! Do you have availability for next week?</p>
                  </div>
                </div>
                <div className="flex flex-row-reverse gap-3">
                  <div className="rounded-2xl rounded-tr-md bg-[#e8a020] p-3 max-w-[80%]">
                    <p className="text-sm font-medium text-[#1a1a2e]">Hello Ahmed! Yes, we have great availability. What dates work for you?</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="h-8 w-8 flex-shrink-0 rounded-full bg-blue-500/20" />
                  <div className="rounded-2xl rounded-tl-md border border-white/10 bg-white/10 p-3 max-w-[80%]">
                    <p className="text-sm text-white">Στις 15-17 Ιουνίου. Έχετε δίκλινα δωμάτια;</p>
                  </div>
                </div>
                <div className="flex flex-row-reverse gap-3">
                  <div className="rounded-2xl rounded-tr-md bg-[#e8a020] p-3 max-w-[80%]">
                    <p className="text-sm font-medium text-[#1a1a2e]">Yes! We have twin rooms available. Would you like me to book it for you?</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 8: Comparison */}
        <section className="bg-[#0a0f1e] py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-[#e8a020]">COMPARISON</p>
            <h2 className="mt-3 text-center text-3xl font-black text-white sm:text-4xl">
              Why 200+ businesses chose CypAI
            </h2>

            <div className="mt-10 overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="pb-4 text-left text-sm font-medium text-white/60">Feature</th>
                    <th className="pb-4 text-center text-sm font-bold text-[#e8a020]">CypAI</th>
                    <th className="pb-4 text-center text-sm font-medium text-white/60">Basic Chatbot</th>
                    <th className="pb-4 text-center text-sm font-medium text-white/60">No AI</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((row, idx) => (
                    <tr key={idx} className="border-b border-white/5">
                      <td className="py-4 text-sm text-white/70">{row.feature}</td>
                      <td className="py-4 text-center">
                        {typeof row.cypai === 'boolean' ? (
                          <span className={row.cypai ? 'text-[#e8a020]' : 'text-red-400'}>
                            {row.cypai ? '✓' : '✗'}
                          </span>
                        ) : (
                          <span className="text-sm font-bold text-[#e8a020]">{row.cypai}</span>
                        )}
                      </td>
                      <td className="py-4 text-center">
                        {typeof row.basic === 'boolean' ? (
                          <span className={row.basic ? 'text-white/70' : 'text-red-400'}>
                            {row.basic ? '✓' : '✗'}
                          </span>
                        ) : (
                          <span className="text-sm text-white/70">{row.basic}</span>
                        )}
                      </td>
                      <td className="py-4 text-center">
                        {typeof row.none === 'boolean' ? (
                          <span className="text-red-400">{row.none ? '✓' : '✗'}</span>
                        ) : (
                          <span className="text-sm text-white/50">{row.none}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-10 text-center">
              <Link
                href="/signup?plan=pro"
                className="inline-block rounded-full bg-[#e8a020] px-8 py-3 text-lg font-bold text-[#1a1a2e] shadow-[0_0_30px_rgba(232,160,32,0.4)] transition-all hover:bg-[#f59e0b] hover:shadow-[0_0_50px_rgba(232,160,32,0.7)] hover:scale-105"
              >
                Start Free — See Why 200+ Businesses Chose CypAI
              </Link>
            </div>
          </div>
        </section>

        {/* Section 9: Pricing */}
        <section id="pricing" className="bg-[#16213e] py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-[#e8a020]">PRICING</p>
            <h2 className="mt-3 text-center text-3xl font-black text-white sm:text-4xl">
              Simple, transparent pricing
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-white/60">
              No hidden fees. No surprises. Choose the plan that fits your business.
            </p>

            <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
              {pricingPlans.map((plan) => (
                <div
                  key={plan.name}
                  className={`relative rounded-2xl border p-6 transition-all ${
                    plan.popular
                      ? 'border-[#e8a020] bg-[#0a0f1e] shadow-[0_0_30px_rgba(232,160,32,0.2)]'
                      : 'border-white/10 bg-white/5'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#e8a020] px-3 py-1 text-xs font-bold text-[#1a1a2e]">
                      Most Popular
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-4xl font-black text-white">${plan.price}</span>
                    <span className="ml-1 text-white/60">/month</span>
                  </div>
                  <p className="mt-2 text-sm text-white/60">{plan.desc}</p>

                  <ul className="mt-6 space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center text-sm text-white/70">
                        <span className="mr-2 text-[#e8a020]">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={plan.name === 'Business' ? '/contact' : '/signup?plan=pro'}
                    className={`mt-6 block w-full rounded-full py-3 text-center text-sm font-semibold transition-all ${
                      plan.popular
                        ? 'bg-[#e8a020] text-[#1a1a2e] hover:bg-[#f59e0b]'
                        : 'border border-white/20 bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              ))}
            </div>

            <p className="mt-8 text-center text-sm text-white/40">
              🔒 Secure card payment powered by Paddle · 30-day money-back guarantee · Cancel anytime
            </p>
          </div>
        </section>

        {/* Section 10: FAQ */}
        <section className="bg-[#0a0f1e] py-24">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-[#e8a020]">FAQ</p>
            <h2 className="mt-3 text-center text-3xl font-black text-white sm:text-4xl">
              Frequently asked questions
            </h2>

            <div className="mt-10">
              <FAQAccordion faqs={faqs} />
            </div>
          </div>
        </section>

        {/* Section 11: Final CTA */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#16213e] to-[#0a0f1e] py-24">
          {/* Background Orbs */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="animate-float-orb absolute -left-20 top-10 h-64 w-64 rounded-full bg-[#e8a020]/20 blur-3xl" />
            <div className="animate-float-orb absolute right-0 top-20 h-72 w-72 rounded-full bg-[#e8a020]/15 blur-3xl" style={{ animationDelay: '7s' }} />
            <div className="animate-float-orb absolute bottom-0 left-1/3 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl" style={{ animationDelay: '3s' }} />
          </div>

          <div className="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#e8a020]/20 bg-[#e8a020]/10 px-4 py-2 text-sm font-medium text-[#e8a020]">
              <span>🚀</span>
              Start your free trial today
            </div>
            
            <h2 className="text-4xl font-black text-white sm:text-5xl">
              Ready to never miss a{' '}
              <span className="text-[#e8a020]">customer</span> again?
            </h2>
            
            <p className="mx-auto mt-4 max-w-xl text-lg text-white/60">
              Join 200+ Cyprus businesses that use CypAI to capture leads, 
              bookings, and grow their business 24/7.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/signup?plan=pro"
                className="rounded-full bg-[#e8a020] px-8 py-4 text-lg font-bold text-[#1a1a2e] shadow-[0_0_30px_rgba(232,160,32,0.4)] transition-all hover:bg-[#f59e0b] hover:shadow-[0_0_50px_rgba(232,160,32,0.7)] hover:scale-105"
              >
                Start Free Trial
              </Link>
              <Link
                href="/demo"
                className="flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-8 py-4 text-lg font-semibold text-green-400 backdrop-blur-sm transition-all hover:bg-green-500/20"
              >
                <span>💬</span>
                Chat on WhatsApp
              </Link>
            </div>

            <p className="mt-6 text-sm text-white/40">
              ✓ No credit card required · ✓ 7-day free trial · ✓ Cancel anytime
            </p>
          </div>
        </section>

        {/* Mini Contact Strip */}
        <section className="bg-[#16213e] border-t border-white/5 py-12">
          <div className="mx-auto max-w-4xl px-4 text-center">
            <p className="text-lg text-white/80 mb-6">
              Questions? We reply within a few hours.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="mailto:cypai.app@cypai.app"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
              >
                <span>📧</span>
                Email
              </a>
              <a
                href="https://wa.me/905338425559"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
              >
                <span>💬</span>
                WhatsApp
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 text-sm font-semibold text-black hover:bg-amber-400 transition-colors"
              >
                Send a message
                <span>→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Section 12: Footer */}
        <footer className="border-t border-white/10 bg-[#0a0f1e] py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              {/* Brand */}
              <div className="col-span-2 md:col-span-1">
                <Link href="/" className="flex items-center" aria-label="CypAI Home">
                  <Image
                    src="/images/cypai-logo.png"
                    alt="CypAI"
                    width={200}
                    height={60}
                    className="h-9 w-auto"
                  />
                </Link>
                <p className="mt-4 text-sm text-white/60">
                  AI customer service for Cyprus businesses. Never miss another customer.
                </p>
              </div>

              {/* Product */}
              <div>
                <h4 className="font-semibold text-white">Product</h4>
                <ul className="mt-4 space-y-2">
                  <li><Link href="#features" className="text-sm text-white/60 hover:text-[#e8a020]">Features</Link></li>
                  <li><Link href="#how-it-works" className="text-sm text-white/60 hover:text-[#e8a020]">How It Works</Link></li>
                  <li><Link href="#pricing" className="text-sm text-white/60 hover:text-[#e8a020]">Pricing</Link></li>
                  <li><Link href="/demo" className="text-sm text-white/60 hover:text-[#e8a020]">Demo</Link></li>
                </ul>
              </div>

              {/* Industries */}
              <div>
                <h4 className="font-semibold text-white">Industries</h4>
                <ul className="mt-4 space-y-2">
                  <li><Link href="/car-rentals" className="text-sm text-white/60 hover:text-[#e8a020]">Car Rentals</Link></li>
                  <li><Link href="/restaurants" className="text-sm text-white/60 hover:text-[#e8a020]">Restaurants</Link></li>
                  <li><Link href="/hotels" className="text-sm text-white/60 hover:text-[#e8a020]">Hotels</Link></li>
                  <li><Link href="/barbershops" className="text-sm text-white/60 hover:text-[#e8a020]">Barbershops</Link></li>
                  <li><Link href="/clinics" className="text-sm text-white/60 hover:text-[#e8a020]">Clinics</Link></li>
                  <li><Link href="/student-housing" className="text-sm text-white/60 hover:text-[#e8a020]">Student Housing</Link></li>
                </ul>
              </div>

              {/* Company */}
              <div>
                <h4 className="font-semibold text-white">Company</h4>
                <ul className="mt-4 space-y-2">
                  <li><Link href="/login" className="text-sm text-white/60 hover:text-[#e8a020]">Log In</Link></li>
                  <li><Link href="/blog" className="text-sm text-white/60 hover:text-[#e8a020]">Blog</Link></li>
                  <li><Link href="/contact" className="text-sm text-white/60 hover:text-[#e8a020]">Contact</Link></li>
                  <li><Link href="/privacy-policy" className="text-sm text-white/60 hover:text-[#e8a020]">Privacy Policy</Link></li>
                  <li><Link href="/terms-of-service" className="text-sm text-white/60 hover:text-[#e8a020]">Terms of Service</Link></li>
                  <li><Link href="/refund-policy" className="text-sm text-white/60 hover:text-[#e8a020]">Refund Policy</Link></li>
                </ul>
              </div>

              {/* Connect */}
              <div>
                <h4 className="font-semibold text-white">Connect</h4>
                <ul className="mt-4 space-y-2">
                  <li>
                    <a href="https://form.jotform.com/260776520378060" target="_blank" rel="noopener noreferrer" className="text-sm text-white/60 hover:text-[#e8a020]">
                      Request Services ↗
                    </a>
                  </li>
                  <li>
                    <a href="https://www.linkedin.com/in/rolland-muhanguzi-507b6136a" target="_blank" rel="noopener noreferrer" className="text-sm text-white/60 hover:text-[#e8a020]">
                      LinkedIn ↗
                    </a>
                  </li>
                  <li>
                    <a href="https://whop.com/joined/cynosurescales" target="_blank" rel="noopener noreferrer" className="text-sm text-white/60 hover:text-[#e8a020]">
                      WHOP ↗
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row">
              <p className="text-sm text-white/40">
                © {new Date().getFullYear()} CypAI. All rights reserved.
              </p>
              <p className="text-sm text-white/40">
                Made with ❤️ for Cyprus businesses
              </p>
            </div>
          </div>
        </footer>

        {/* Floating WhatsApp Button */}
        <a
          href="https://wa.me/905338425559"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 left-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 shadow-lg transition-all hover:scale-110 hover:shadow-green-500/30"
          aria-label="Chat on WhatsApp"
        >
          <svg className="h-7 w-7 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </a>
      </main>
    </>
  )
}
