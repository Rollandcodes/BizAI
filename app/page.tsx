'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

type FeatureTab = {
  title: string
  description: string
  previewTitle: string
  previewBody: string
}

type PlatformItem = {
  icon: string
  title: string
  description: string
}

type Testimonial = {
  company: string
  quote: string
  name: string
  role: string
  result: string
}

const featureTabs: FeatureTab[] = [
  {
    title: 'AI Chat & WhatsApp',
    description:
      'Our AI handles your website chat AND WhatsApp Business simultaneously. Customers get instant responses 24/7 in their own language.',
    previewTitle: 'Unified Inbox',
    previewBody:
      'One stream for web + WhatsApp conversations with smart auto-replies, lead capture, and handoff alerts.',
  },
  {
    title: 'CRM & Lead Management',
    description:
      'Every lead the AI captures goes straight into your CRM. Track from New → Contacted → Converted. Never lose a prospect again.',
    previewTitle: 'Lead Pipeline',
    previewBody:
      'Visual pipeline with owner notes, follow-up reminders, and conversion stage tracking in one place.',
  },
  {
    title: 'Booking System',
    description:
      'AI collects booking details automatically. Confirm with one click. Customer gets WhatsApp confirmation instantly.',
    previewTitle: 'Booking Console',
    previewBody:
      'Review requests, approve in one click, and trigger customer confirmations with no manual back-and-forth.',
  },
  {
    title: 'Follow-up Tools',
    description:
      'Send WhatsApp follow-ups using smart templates. Re-engage cold leads and send booking reminders.',
    previewTitle: 'Follow-up Templates',
    previewBody:
      'Reusable campaign templates for reminders, promotions, and reactivation flows with send-time control.',
  },
  {
    title: 'Analytics Dashboard',
    description:
      'See conversations, lead capture rate, peak hours, language breakdown in real time.',
    previewTitle: 'Performance Snapshot',
    previewBody:
      'Understand growth with channel performance, response quality, conversion trend, and hourly demand charts.',
  },
  {
    title: '5 Languages',
    description:
      'Detects and responds in English, Turkish, Arabic, Russian, and Greek automatically.',
    previewTitle: 'Multilingual AI Engine',
    previewBody:
      'Auto-detection ensures customers get natural replies in their language from the first message onward.',
  },
]

const platformItems: PlatformItem[] = [
  {
    icon: '🤖',
    title: 'AI Chat Widget',
    description: 'Embed on your website in seconds',
  },
  {
    icon: '📱',
    title: 'WhatsApp Integration',
    description: 'Auto-respond to messages',
  },
  {
    icon: '👥',
    title: 'CRM & Leads',
    description: 'Track every contact automatically',
  },
  {
    icon: '📅',
    title: 'Booking System',
    description: 'Confirm appointments with one click',
  },
  {
    icon: '📊',
    title: 'Analytics',
    description: 'See exactly how your AI performs',
  },
  {
    icon: '🔒',
    title: 'Agent Audit',
    description: 'Review every AI response (Business plan)',
  },
]

const testimonials: Testimonial[] = [
  {
    company: 'Kyrenia Car Rentals',
    quote:
      'Before CypAI I was answering WhatsApp at midnight for price quotes. Now I wake up to confirmed bookings.',
    name: 'Mehmet Aydın',
    role: 'Owner',
    result: 'Bookings up 40%',
  },
  {
    company: 'Bellapais Accommodation',
    quote:
      'Our guests speak 3 different languages. CypAI handles all of them instantly. Zero missed inquiries in 3 months.',
    name: 'Anastasia K.',
    role: 'Manager',
    result: 'Zero missed inquiries',
  },
  {
    company: 'Studio One Barbershop',
    quote:
      'Saved me 2 hours every day. The AI handles all the basic questions. I just focus on my work now.',
    name: 'Yusuf Özkan',
    role: 'Founder',
    result: '2+ hours saved daily',
  },
]

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [barClosed, setBarClosed] = useState(false)
  const [activeFeature, setActiveFeature] = useState(0)
  const [activePlatform, setActivePlatform] = useState(0)
  const [testimonialIndex, setTestimonialIndex] = useState(0)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const id = window.setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % testimonials.length)
    }, 4000)
    return () => window.clearInterval(id)
  }, [])

  const activeFeatureData = featureTabs[activeFeature]
  const activePlatformData = platformItems[activePlatform]

  const desktopTestimonials = [
    testimonials[testimonialIndex % testimonials.length],
    testimonials[(testimonialIndex + 1) % testimonials.length],
    testimonials[(testimonialIndex + 2) % testimonials.length],
  ]

  return (
    <div
      className="min-h-screen bg-white text-[#0a0a0a]"
      style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" }}
    >
      {!barClosed && (
        <div className="relative bg-black px-4 py-2.5 text-center text-xs text-white">
          🎉 7-day free trial on all plans — No credit card required →{' '}
          <Link href="/signup?plan=pro" className="font-semibold underline">
            Start Free Today
          </Link>
          <button
            onClick={() => setBarClosed(true)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-base leading-none text-white/80 hover:text-white"
            aria-label="Dismiss announcement"
          >
            ×
          </button>
        </div>
      )}

      <nav
        className={`sticky top-0 z-50 border-b border-gray-100 bg-white ${
          scrolled ? 'backdrop-blur-sm' : ''
        }`}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 text-base font-semibold text-[#0a0a0a]">
            <span>🤖</span>
            <span>CypAI</span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {[
              ['#features', 'Features'],
              ['/pricing', 'Pricing'],
              ['/demo', 'Demo'],
              ['/contact', 'Company'],
            ].map(([href, label]) => (
              <a key={href} href={href} className="text-sm text-gray-500 transition hover:text-[#0a0a0a]">
                {label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden text-sm text-gray-600 hover:text-[#0a0a0a] sm:block">
              Log In
            </Link>
            <Link
              href="/signup?plan=pro"
              className="rounded-full bg-black px-5 py-2 text-sm font-medium text-white transition hover:bg-[#1a1a1a]"
            >
              Start Free Trial
            </Link>
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="rounded-full p-2 text-gray-600 hover:bg-gray-100 md:hidden"
              aria-label="Toggle menu"
            >
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="border-t border-gray-100 px-4 pb-4 pt-2 md:hidden">
            {[
              ['#features', 'Features'],
              ['/pricing', 'Pricing'],
              ['/demo', 'Demo'],
              ['/contact', 'Company'],
              ['/login', 'Log In'],
            ].map(([href, label]) => (
              <a
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="block rounded-xl px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
              >
                {label}
              </a>
            ))}
          </div>
        )}
      </nav>

      <section className="bg-white py-24 lg:py-32">
        <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
          <span className="text-xs font-medium uppercase tracking-widest text-gray-400">
            AI PLATFORM FOR CYPRUS BUSINESSES
          </span>
          <h1 className="mx-auto mt-6 max-w-5xl text-5xl font-black leading-none tracking-tight text-[#0a0a0a] sm:text-6xl lg:text-8xl">
            The AI Platform For Local Businesses
          </h1>
          <p className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-gray-500">
            Replace your scattered tools with one smart AI that handles chat, leads, bookings, and
            follow-ups — 24/7.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/signup?plan=pro"
              className="rounded-full bg-black px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-[#1a1a1a]"
            >
              Start Free Trial
            </Link>
            <Link
              href="/demo"
              className="rounded-full border border-gray-300 px-8 py-3.5 text-sm font-semibold text-gray-700 transition hover:border-gray-400"
            >
              See Live Demo
            </Link>
          </div>
          <p className="mt-10 text-xs uppercase tracking-widest text-gray-400">Trusted by businesses in</p>

          <div className="mt-6 overflow-hidden border-y border-gray-100 py-4">
            <div className="animate-marquee items-center gap-3">
              {[
                '📍 Kyrenia',
                '📍 Nicosia',
                '📍 Famagusta',
                '📍 Güzelyurt',
                '📍 Lefke',
                '📍 Worldwide',
                '📍 Kyrenia',
                '📍 Nicosia',
                '📍 Famagusta',
                '📍 Güzelyurt',
                '📍 Lefke',
                '📍 Worldwide',
              ].map((city, index) => (
                <span
                  key={`${city}-${index}`}
                  className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600"
                >
                  {city}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-24 lg:py-32">
        <div className="mx-auto grid max-w-6xl gap-5 px-4 sm:grid-cols-3 sm:px-6">
          {[
            ['#features', '🧠', 'An AI Agent', 'Empowered by Technology'],
            ['#platform', '⚙️', 'A Complete Platform', 'To Run Your Business'],
            ['#dashboard', '📊', 'One Simple Dashboard', 'To Manage Everything'],
          ].map(([href, icon, label, title]) => (
            <a
              href={href}
              key={title}
              className="group flex min-h-[240px] flex-col rounded-2xl bg-gray-50 p-8 transition hover:bg-gray-100"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-3xl">
                {icon}
              </div>
              <p className="mt-7 text-xs font-medium uppercase tracking-widest text-gray-400">{label}</p>
              <h3 className="mt-2 text-xl font-bold text-[#0a0a0a]">{title}</h3>
              <span className="mt-auto text-xl text-gray-500 transition group-hover:translate-x-1">→</span>
            </a>
          ))}
        </div>
      </section>

      <section id="features" className="bg-white py-24 lg:py-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-gray-400">Core Features</p>
              <h2 className="mt-3 text-4xl font-black leading-tight text-[#0a0a0a]">Built to run every customer interaction</h2>

              <div className="mt-8 space-y-5">
                {featureTabs.map((tab, index) => (
                  <button
                    key={tab.title}
                    onClick={() => setActiveFeature(index)}
                    className={`w-full border-l-2 pl-4 text-left transition ${
                      activeFeature === index ? 'border-black' : 'border-transparent'
                    }`}
                  >
                    <h3
                      className={`text-base ${
                        activeFeature === index ? 'font-semibold text-[#0a0a0a]' : 'font-medium text-gray-400'
                      }`}
                    >
                      {tab.title}
                    </h3>
                    <p className={`mt-1 text-sm leading-relaxed ${activeFeature === index ? 'text-gray-600' : 'text-gray-400'}`}>
                      {tab.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
              <p className="text-xs font-medium uppercase tracking-widest text-gray-400">Live Preview</p>
              <h3 className="mt-3 text-2xl font-bold text-[#0a0a0a]">{activeFeatureData.previewTitle}</h3>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-gray-600">{activeFeatureData.previewBody}</p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-gray-200 bg-white p-4">
                  <p className="text-xs text-gray-400">Response time</p>
                  <p className="mt-1 text-2xl font-black text-[#0a0a0a]">&lt; 3s</p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-4">
                  <p className="text-xs text-gray-400">Handled automatically</p>
                  <p className="mt-1 text-2xl font-black text-[#0a0a0a]">92%</p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-4 sm:col-span-2">
                  <p className="text-xs text-gray-400">Recent activity</p>
                  <div className="mt-3 space-y-2 text-sm text-gray-600">
                    <p>• New inquiry captured from website</p>
                    <p>• Booking request confirmed via WhatsApp</p>
                    <p>• Follow-up reminder sent automatically</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="platform" className="bg-gray-50 py-24 lg:py-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-center text-xs font-medium uppercase tracking-widest text-gray-400">Simple Process</p>
          <h2 className="mt-3 text-center text-4xl font-black leading-tight text-[#0a0a0a]">Up and Running in 15 Minutes</h2>

          <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_1fr]">
            <div className="space-y-8">
              {[
                ['01', '📝', 'Sign Up & Train', 'Create your account, tell the AI your prices, hours, and services. Takes 5 minutes.'],
                ['02', '🔗', 'Add to Your Website', 'Copy one line of code to your site. Your AI widget goes live immediately.'],
                ['03', '🚀', 'Grow Your Business', 'AI handles customers 24/7. You wake up to captured leads and confirmed bookings.'],
              ].map(([num, icon, title, desc]) => (
                <div key={num} className="grid grid-cols-[56px_1fr] gap-4">
                  <div className="pt-1 text-sm font-medium text-gray-400">{num}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{icon}</span>
                      <h3 className="text-xl font-bold text-[#0a0a0a]">{title}</h3>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-gray-600">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-widest text-gray-400">Dashboard Overview</p>
              <h3 className="mt-2 text-2xl font-bold text-[#0a0a0a]">Real-time business snapshot</h3>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  ['247', 'conversations this month', '↑12%'],
                  ['89', 'leads captured', '↑8%'],
                  ['34', 'bookings confirmed', '↑15%'],
                  ['38%', 'conversion rate', '↑3%'],
                ].map(([value, label, delta]) => (
                  <div key={label} className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                    <p className="text-2xl font-black text-[#0a0a0a]">{value}</p>
                    <p className="mt-1 text-xs text-gray-500">{label}</p>
                    <p className="mt-2 text-xs font-medium text-[#0a0a0a]">{delta}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-12">
        <div className="mx-auto flex max-w-6xl flex-wrap justify-center gap-3 px-4 sm:px-6">
          {[
            'Never miss a lead',
            '24/7 AI responses',
            '5 languages',
            'WhatsApp + website',
            '15-min setup',
            'Cancel anytime',
            'No coding needed',
            'Auto lead capture',
          ].map((pill) => (
            <span key={pill} className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-800">
              {pill}
            </span>
          ))}
        </div>
      </section>

      <section id="dashboard" className="bg-gray-50 py-24 lg:py-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-gray-400">Platform</p>
              <h2 className="mt-3 text-4xl font-black leading-tight text-[#0a0a0a]">One dashboard for everything</h2>

              <div className="mt-8 space-y-4">
                {platformItems.map((item, index) => (
                  <button
                    key={item.title}
                    onClick={() => setActivePlatform(index)}
                    className={`w-full border-l-2 pl-4 text-left ${
                      activePlatform === index ? 'border-black' : 'border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>{item.icon}</span>
                      <h3 className={`text-base ${activePlatform === index ? 'font-semibold text-[#0a0a0a]' : 'text-gray-500'}`}>
                        {item.title}
                      </h3>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">{item.description}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
              <div className="border-b border-gray-200 px-5 py-4">
                <p className="text-sm font-semibold text-[#0a0a0a]">CypAI Dashboard</p>
                <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-500">
                  {['Overview', 'Conversations', 'CRM', 'Bookings'].map((tab) => (
                    <span key={tab} className="rounded-full bg-gray-100 px-3 py-1">
                      {tab}
                    </span>
                  ))}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-[#0a0a0a]">{activePlatformData.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{activePlatformData.description}</p>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                    <p className="text-xs text-gray-400">Today</p>
                    <p className="mt-1 text-lg font-black text-[#0a0a0a]">57 conversations</p>
                  </div>
                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                    <p className="text-xs text-gray-400">Auto-resolved</p>
                    <p className="mt-1 text-lg font-black text-[#0a0a0a]">84%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="company" className="bg-white py-24 lg:py-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-center text-xs font-medium uppercase tracking-widest text-gray-400">Testimonials</p>
          <h2 className="mt-3 text-center text-4xl font-black leading-tight text-[#0a0a0a]">Trusted by Cyprus businesses</h2>

          <div className="mt-12 md:hidden">
            <TestimonialCard item={testimonials[testimonialIndex]} />
          </div>

          <div className="mt-12 hidden gap-6 md:grid md:grid-cols-3">
            {desktopTestimonials.map((item, index) => (
              <TestimonialCard key={`${item.name}-${index}`} item={item} />
            ))}
          </div>

          <div className="mt-8 flex justify-center gap-3">
            <button
              onClick={() =>
                setTestimonialIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
              }
              className="rounded-full border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:border-gray-400"
            >
              ←
            </button>
            <button
              onClick={() => setTestimonialIndex((prev) => (prev + 1) % testimonials.length)}
              className="rounded-full border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:border-gray-400"
            >
              →
            </button>
          </div>
        </div>
      </section>

      <section id="pricing" className="bg-gray-50 py-24 lg:py-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-center text-xs font-medium uppercase tracking-widest text-gray-400">Pricing</p>
          <h2 className="mt-3 text-center text-4xl font-black leading-tight text-[#0a0a0a]">Simple, transparent pricing</h2>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              {
                name: 'Starter',
                price: '$29',
                desc: 'Perfect for small businesses',
                popular: false,
                plan: 'starter',
                features: [
                  '500 messages/month',
                  'Website chat widget',
                  'Lead capture',
                  'Basic analytics',
                  'Email support',
                ],
              },
              {
                name: 'Pro',
                price: '$79',
                desc: 'Most popular for growing businesses',
                popular: true,
                plan: 'pro',
                features: [
                  'Unlimited messages',
                  'WhatsApp integration',
                  'CRM & lead management',
                  'Booking system',
                  'Follow-up tools',
                  'Advanced analytics',
                ],
              },
              {
                name: 'Business',
                price: '$149',
                desc: 'For agencies and multi-location teams',
                popular: false,
                plan: 'business',
                features: [
                  'Everything in Pro',
                  'Agent audit tools',
                  'Weekly compliance reports',
                  'Multi-location setup',
                  'Priority support',
                ],
              },
            ].map((card) => (
              <div
                key={card.name}
                className={`rounded-2xl bg-white p-8 ${card.popular ? 'border-2 border-black' : 'border border-gray-200'}`}
              >
                {card.popular ? (
                  <span className="inline-block rounded-full bg-black px-3 py-1 text-xs font-medium uppercase tracking-wide text-white">
                    Most Popular
                  </span>
                ) : null}
                <p className="mt-3 text-xs font-medium uppercase tracking-widest text-gray-400">{card.name}</p>
                <p className="mt-3 text-5xl font-black text-[#0a0a0a]">{card.price}</p>
                <p className="mt-1 text-sm text-gray-500">/mo</p>
                <p className="mt-4 text-sm text-gray-600">{card.desc}</p>

                <ul className="mt-6 space-y-2 text-sm text-gray-600">
                  {card.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <span className="font-bold text-[#0a0a0a]">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/signup?plan=${card.plan}`}
                  className={`mt-8 block rounded-full px-5 py-3 text-center text-sm font-semibold transition ${
                    card.popular
                      ? 'bg-black text-white hover:bg-[#1a1a1a]'
                      : 'border border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  Start Free Trial
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-black py-24 text-center text-white lg:py-32">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="text-4xl font-black leading-tight sm:text-5xl">Ready to Never Miss a Customer Again?</h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-400">
            Join local businesses in Cyprus already using AI to handle customers while they sleep.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/signup?plan=pro"
              className="rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-black transition hover:bg-gray-100"
            >
              Start Free Trial
            </Link>
            <a
              href="https://wa.me/905338425559?text=Hi! I want to learn more about CypAI"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-gray-600 px-8 py-3.5 text-sm font-semibold text-white transition hover:border-gray-400"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>

      <footer className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-2 text-lg font-semibold text-[#0a0a0a]">
                <span>🤖</span>
                <span>CypAI</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-gray-500">
                AI platform for local businesses to manage chat, leads, bookings, and growth in one place.
              </p>
              <p className="mt-4 text-xl">🇬🇧 🇹🇷 🇸🇦 🇷🇺 🇬🇷</p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-gray-400">Product</p>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li><a href="#features" className="hover:text-[#0a0a0a]">Features</a></li>
                <li><a href="#pricing" className="hover:text-[#0a0a0a]">Pricing</a></li>
                <li><Link href="/demo" className="hover:text-[#0a0a0a]">Live Demo</Link></li>
                <li><Link href="/dashboard" className="hover:text-[#0a0a0a]">Dashboard</Link></li>
              </ul>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-gray-400">Company</p>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li><a href="#company" className="hover:text-[#0a0a0a]">Company</a></li>
                <li><Link href="/privacy" className="hover:text-[#0a0a0a]">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-[#0a0a0a]">Terms</Link></li>
                <li><Link href="/login" className="hover:text-[#0a0a0a]">Log In</Link></li>
              </ul>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-gray-400">Contact</p>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li>
                  <a href="mailto:cypai.app@cypai.app" className="hover:text-[#0a0a0a]">
                    cypai.app@cypai.app
                  </a>
                </li>
                <li>
                  <a href="https://wa.me/905338425559" target="_blank" rel="noopener noreferrer" className="hover:text-[#0a0a0a]">
                    +90 533 842 5559
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-2 border-t border-gray-100 pt-6 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 CypAI</p>
            <p>Made for Northern Cyprus 🇨🇾</p>
          </div>
        </div>
      </footer>

      <a
        href="https://wa.me/905338425559?text=Hi! I want to learn more about CypAI"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 left-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 shadow-lg transition hover:scale-110 hover:bg-green-600"
        title="Chat on WhatsApp"
      >
        <svg viewBox="0 0 24 24" className="h-7 w-7 fill-white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
    </div>
  )
}

function TestimonialCard({ item }: { item: Testimonial }) {
  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-6">
      <p className="text-xs font-medium uppercase tracking-widest text-gray-400">{item.company}</p>
      <p className="mt-4 text-lg italic leading-relaxed text-gray-700">“{item.quote}”</p>
      <div className="mt-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-[#0a0a0a]">
          {item.name.charAt(0)}
        </div>
        <div>
          <p className="text-sm font-semibold text-[#0a0a0a]">{item.name}</p>
          <p className="text-xs text-gray-500">{item.role}</p>
        </div>
      </div>
      <span className="mt-5 inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
        {item.result}
      </span>
    </article>
  )
}
