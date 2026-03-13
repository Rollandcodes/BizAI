'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

// ─── Types ───────────────────────────────────────────────────────────────────

interface FaqItem {
  q: string
  a: string
}

// ─── Data ────────────────────────────────────────────────────────────────────

const FAQS: FaqItem[] = [
  {
    q: 'How long does setup take?',
    a: 'Most businesses are live within 15 minutes. Fill in your business details, add your prices and FAQs, copy one line of code to your website. No developer needed.',
  },
  {
    q: 'Which languages does the AI speak?',
    a: 'English, Turkish, Arabic, Russian, and Greek. The AI automatically detects which language your customer is writing in and responds in the same language.',
  },
  {
    q: 'Does it work with WhatsApp?',
    a: "Yes, on Pro and Business plans. Your AI connects to your WhatsApp Business number and responds to customers automatically, 24/7 — even when you're closed.",
  },
  {
    q: 'Can I customize what the AI says?',
    a: 'Fully. From your dashboard you write custom instructions, add your prices, set your hours, and add FAQs. The AI learns your exact business.',
  },
  {
    q: 'How is customer data protected?',
    a: 'All data is encrypted and stored securely. We never share your customer data with third parties. Business plan includes full audit logs and compliance reports.',
  },
  {
    q: 'What happens after the 7-day trial?',
    a: "After your trial, choose a paid plan from $29/month. If you don't upgrade, your widget pauses but your data is kept safe for 30 days.",
  },
  {
    q: 'Do I need a website?',
    a: "No. Use our QR code feature — print it and place it in your shop. Customers scan and chat instantly, no website needed.",
  },
  {
    q: 'Can I cancel anytime?',
    a: "Yes. No contracts, no cancellation fees. Cancel from your dashboard and you won't be charged again.",
  },
]

// ─── Component ───────────────────────────────────────────────────────────────

export default function HomePage() {
  const [bannerDismissed, setBannerDismissed] = useState(false)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)

  // Restore banner dismiss state from localStorage
  useEffect(() => {
    try {
      if (localStorage.getItem('cypai_banner_dismissed') === '1') {
        setBannerDismissed(true)
      }
    } catch {
      // ignore
    }
  }, [])

  function dismissBanner() {
    setBannerDismissed(true)
    try {
      localStorage.setItem('cypai_banner_dismissed', '1')
    } catch {
      // ignore
    }
  }

  function toggleFaq(index: number) {
    setOpenFaqIndex(prev => (prev === index ? null : index))
  }

  return (
    <>
      {/* ── Sticky top banner ─────────────────────────────────────────────── */}
      {!bannerDismissed && (
        <div className="relative bg-blue-600 text-white text-center py-2 text-sm z-[60]">
          🎉 7-day free trial on all plans — No credit card required →
          <Link href="/signup?plan=pro" className="underline font-bold ml-1">
            Start Free Today
          </Link>
          <button
            onClick={dismissBanner}
            aria-label="Dismiss banner"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      <Navbar />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 py-12 sm:py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Left column */}
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-600/20 px-4 py-1.5 text-sm font-medium text-blue-300">
                🇨🇾 Built for Cyprus Businesses
              </div>

              <h1 className="mb-4 text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl xl:text-6xl">
                Your AI Agent That Never Misses a Customer
              </h1>

              <p className="mb-6 text-sm leading-relaxed text-slate-300 sm:text-base lg:text-lg">
                24/7 AI assistant for car rentals, barbershops, hotels, and restaurants. Handles WhatsApp + website chat in 5 languages.
              </p>

              {/* Trust points */}
              <div className="flex flex-wrap gap-x-6 gap-y-2 mb-8">
                {['Setup in 15 minutes', 'No technical skills needed', '7-day free trial', 'Cancel anytime'].map(point => (
                  <span key={point} className="text-slate-300 text-sm flex items-center gap-1.5">
                    <span className="text-green-400 font-bold">✓</span> {point}
                  </span>
                ))}
              </div>

              {/* CTA buttons */}
              <div className="flex flex-wrap gap-4 mb-4">
                <Link
                  href="/signup?plan=pro"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-xl text-lg transition-colors"
                >
                  Start Free Trial →
                </Link>
                <Link
                  href="/demo"
                  className="border border-slate-600 text-slate-300 hover:border-slate-400 hover:text-white font-semibold px-8 py-4 rounded-xl text-lg transition-colors"
                >
                  See Live Demo
                </Link>
              </div>

              <p className="text-gray-600 text-sm">
                No credit card required for trial • Cancel anytime • Secure payment
              </p>
            </div>

            {/* Right column — live chat preview */}
            <div className="bg-slate-800 rounded-2xl overflow-hidden shadow-2xl border border-slate-700">
              {/* Chat header */}
              <div className="bg-blue-600 px-4 py-3 flex items-center gap-3">
                <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center text-lg">🤖</div>
                <div>
                  <div className="text-white font-semibold text-sm">Kyrenia Car Rentals AI</div>
                  <div className="flex items-center gap-1 text-blue-200 text-xs">
                    <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
                    Online 24/7
                  </div>
                </div>
              </div>

              {/* Chat messages */}
              <div className="px-4 py-4 flex flex-col gap-3 min-h-[280px]">
                {/* Bot message */}
                <div className="flex gap-2 items-end">
                  <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-xs flex-shrink-0">🤖</div>
                  <div className="bg-slate-700 text-slate-100 rounded-2xl rounded-bl-none px-4 py-2.5 text-sm max-w-[80%]">
                    Merhaba! 👋 Hi! How can I help? I can help with cars, prices, and bookings.
                  </div>
                </div>
                {/* User message */}
                <div className="flex justify-end">
                  <div className="bg-blue-600 text-white rounded-2xl rounded-br-none px-4 py-2.5 text-sm max-w-[80%]">
                    How much for an SUV for 3 days?
                  </div>
                </div>
                {/* Bot message */}
                <div className="flex gap-2 items-end">
                  <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-xs flex-shrink-0">🤖</div>
                  <div className="bg-slate-700 text-slate-100 rounded-2xl rounded-bl-none px-4 py-2.5 text-sm max-w-[80%]">
                    Our SUV is $55/day — 3 days = $165 total 🚙 Shall I take your details to confirm the booking?
                  </div>
                </div>
                {/* User message */}
                <div className="flex justify-end">
                  <div className="bg-blue-600 text-white rounded-2xl rounded-br-none px-4 py-2.5 text-sm max-w-[80%]">
                    Yes! Ahmed, +90 533 xxx xxxx
                  </div>
                </div>
                {/* Bot confirmation */}
                <div className="flex gap-2 items-end">
                  <div className="w-7 h-7 bg-green-500 rounded-full flex items-center justify-center text-xs flex-shrink-0">🤖</div>
                  <div className="bg-green-600/30 border border-green-500/40 text-green-200 rounded-2xl rounded-bl-none px-4 py-2.5 text-sm max-w-[80%]">
                    ✅ Perfect Ahmed! Your booking request is saved. The owner will confirm within 1 hour!
                  </div>
                </div>
              </div>

              {/* Lead captured badge */}
              <div className="mx-4 mb-3 bg-green-500/10 border border-green-500/30 rounded-xl px-3 py-2 text-green-300 text-xs font-medium">
                📩 Lead captured automatically — Ahmed&apos;s contact saved to your CRM
              </div>

              {/* Input bar */}
              <div className="border-t border-slate-700 px-4 py-3">
                <Link
                  href="/demo"
                  className="w-full flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white rounded-xl py-2.5 text-sm font-medium transition-colors"
                >
                  💬 Try the live demo yourself →
                </Link>
              </div>
            </div>
          </div>

          {/* Stats bar */}
          <div className="border-t border-white/10 pt-8 mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
              { value: '24/7', label: 'Always online' },
              { value: '5', label: 'Languages spoken' },
              { value: '15min', label: 'Setup time' },
                { value: '$0', label: 'To start (7-day trial)' },
            ].map(stat => (
              <div key={stat.label}>
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Social proof bar ──────────────────────────────────────────────── */}
      <section className="bg-gray-50 py-8">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-gray-600 text-sm font-medium mb-4">Trusted by businesses in</p>
          <div className="flex flex-wrap justify-center gap-3">
            {['📍 Kyrenia', '📍 Nicosia', '📍 Famagusta', '📍 Güzelyurt', '📍 Lefke', '📍 Worldwide'].map(loc => (
              <span
                key={loc}
                className="bg-white border border-gray-200 text-gray-600 text-sm font-medium px-4 py-1.5 rounded-full shadow-sm"
              >
                {loc}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────────────────── */}
      <section id="features" className="bg-white py-12 sm:py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-14">
            <span className="inline-block bg-blue-50 text-blue-600 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
              Everything you need
            </span>
            <h2 className="mb-4 text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
              One Platform. Every Tool Your<br className="hidden sm:block" /> Business Needs.
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Stop using 5 different apps. CypAI combines AI chat, CRM, bookings, and analytics in one simple dashboard.
            </p>
          </div>

          {/* Feature cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: '💬',
                title: 'AI Chat (Website + WhatsApp)',
                desc: 'One AI handles your website widget AND WhatsApp Business. Customers reach you wherever they prefer — you never miss a message.',
              },
              {
                icon: '👥',
                title: 'CRM & Lead Management',
                desc: 'Every lead the AI captures goes straight into your CRM. Track status, add notes, see full conversation history. Like GoHighLevel but simpler.',
              },
              {
                icon: '📅',
                title: 'Booking System',
                desc: 'AI collects booking details automatically. You confirm or decline from your dashboard. Works for car rentals, appointments, room reservations.',
              },
              {
                icon: '📨',
                title: 'Follow-up Tools',
                desc: "Send WhatsApp follow-ups to leads using smart templates. Re-engage cold leads, send booking reminders, run promotions.",
              },
              {
                icon: '📊',
                title: 'Analytics Dashboard',
                desc: 'See conversations, lead capture rate, peak hours, language breakdown, and conversion funnel. Know exactly how your AI is performing.',
              },
              {
                icon: '🌍',
                title: '5 Languages Automatically',
                desc: "Detects and responds in English, Turkish, Arabic, Russian, and Greek. Your AI speaks your customer's language automatically.",
              },
              {
                icon: '⚡',
                title: '15-Minute Setup',
                desc: "Answer a few questions about your business, set your prices and hours, copy one line of code. You're live. No developer needed.",
              },
              {
                icon: '🏢',
                title: 'Agency Mode',
                desc: 'Manage multiple business locations or client accounts from one dashboard. Perfect for marketing agencies reselling CypAI to their clients.',
              },
            ].map(feature => (
              <div
                key={feature.title}
                className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-shadow"
              >
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────────────────────── */}
      <section className="bg-gray-50 py-12 sm:py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="mb-3 text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">Up and Running in 15 Minutes</h2>
            <p className="text-sm text-gray-600 sm:text-base">No technical skills required</p>
          </div>

          <div className="flex flex-nowrap overflow-x-auto gap-6 pb-4 md:grid md:grid-cols-5 md:overflow-visible">
            {[
              { num: 1, title: 'Sign Up', desc: 'Choose your plan and create your account in 2 minutes.' },
              { num: 2, title: 'Train Your AI', desc: 'Tell it your prices, hours, and FAQs. It learns your business.' },
              { num: 3, title: 'Customize Widget', desc: 'Pick your colors and set your welcome message.' },
              { num: 4, title: 'Add to Your Website', desc: 'Copy one line of code. Paste it on your site.' },
              { num: 5, title: 'Go Live 🎉', desc: 'Your AI starts answering customers 24/7 immediately.' },
            ].map(step => (
              <div key={step.num} className="flex flex-col items-center text-center min-w-[180px] md:min-w-0">
                <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm mb-3 flex-shrink-0">
                  {step.num}
                </div>
                <h3 className="font-bold text-gray-900 mb-1 text-sm">{step.title}</h3>
                <p className="text-gray-600 text-xs leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Comparison table ──────────────────────────────────────────────── */}
      <section className="bg-white py-12 sm:py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="mb-4 text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">CypAI vs Basic Chatbots</h2>
            <p className="text-sm text-gray-600 sm:text-base">See why businesses choose CypAI over simple chatbot tools</p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
            <table className="w-full text-sm min-w-[640px]">
              <thead>
                <tr>
                  <th className="bg-gray-50 text-gray-700 font-semibold text-left px-6 py-4 border-b border-gray-200">
                    Feature
                  </th>
                  <th className="text-center px-6 py-5 border-b border-gray-200 relative bg-blue-600">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-white text-blue-600 text-xs font-bold px-3 py-0.5 rounded-full shadow-sm">
                        Most Popular
                      </span>
                    </div>
                    <span className="text-white font-bold">CypAI</span>
                  </th>
                  <th className="bg-gray-50 text-gray-600 font-semibold text-center px-6 py-4 border-b border-gray-200">
                    Basic Chatbot
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: 'AI Chat (5 languages)', cypai: '✅', other: '✅' },
                  { feature: 'Lead CRM', cypai: '✅', other: '❌' },
                  { feature: 'Booking Management', cypai: '✅', other: '❌' },
                  { feature: 'Follow-up Tools', cypai: '✅', other: '❌' },
                  { feature: 'Analytics & Reports', cypai: '✅', other: '❌' },
                  { feature: 'WhatsApp Integration', cypai: '✅', other: '❌' },
                  { feature: 'Agency/Multi-location', cypai: '✅', other: '❌' },
                  { feature: 'Setup time', cypai: '15 min', other: 'Hours' },
                  { feature: 'Support', cypai: 'Priority', other: 'Email only' },
                  { feature: 'Price', cypai: 'From $29/mo', other: '$50–200/mo' },
                ].map((row, i) => (
                  <tr key={row.feature} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-3 text-gray-700 font-medium">{row.feature}</td>
                    <td className="px-6 py-3 text-center font-medium bg-blue-50">
                      <span className={row.cypai === '✅' ? 'text-green-500 text-lg font-bold' : row.cypai === '❌' ? 'text-red-400 text-lg' : 'text-blue-700'}>
                        {row.cypai}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-center">
                      <span className={row.other === '✅' ? 'text-green-500 text-lg font-bold' : row.other === '❌' ? 'text-red-400 text-lg' : 'text-gray-600'}>
                        {row.other}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Pricing ───────────────────────────────────────────────────────── */}
      <section id="pricing" className="bg-gray-50 py-12 sm:py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block bg-blue-50 text-blue-600 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
              Simple, transparent pricing
            </span>
            <h2 className="mb-4 text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">Choose Your Plan</h2>
            <p className="text-sm text-gray-600 sm:text-base">
              7-day free trial on all plans. Cancel anytime. No contracts.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 items-start">
            {/* Starter */}
            <div className="bg-white border border-gray-200 rounded-2xl p-8">
              <h3 className="mb-1 text-xl font-bold text-gray-900 sm:text-2xl">Starter</h3>
              <p className="text-gray-600 text-sm mb-4">Perfect for small local businesses</p>
              <div className="text-4xl font-bold text-gray-900 mb-6">
                $29<span className="text-lg font-normal text-gray-600">/mo</span>
              </div>
              <ul className="space-y-2.5 mb-8">
                {[
                  '500 messages/month',
                  'Website chat widget',
                  'Lead capture (name + phone)',
                  'Basic CRM (view leads)',
                  'Email support',
                  'QR code for walk-ins',
                  '5 languages supported',
                  '7-day free trial',
                ].map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-green-500 font-bold mt-0.5">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/signup?plan=starter"
                className="block w-full text-center border border-gray-300 hover:border-blue-400 text-gray-700 hover:text-blue-600 font-semibold py-3 rounded-xl transition-colors"
              >
                Start Free Trial
              </Link>
            </div>

            {/* Pro — Most Popular */}
            <div className="relative bg-white border-2 border-blue-600 rounded-2xl p-8 shadow-xl shadow-blue-100">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-full">
                  MOST POPULAR
                </span>
              </div>
              <h3 className="mb-1 text-xl font-bold text-gray-900 sm:text-2xl">Pro</h3>
              <p className="text-gray-600 text-sm mb-4">For growing businesses</p>
              <div className="text-4xl font-bold text-gray-900 mb-6">
                $79<span className="text-lg font-normal text-gray-600">/mo</span>
              </div>
              <ul className="space-y-2.5 mb-8">
                {[
                  'Unlimited messages',
                  'Website + WhatsApp chat',
                  'Full CRM & lead management',
                  'Booking system',
                  'Follow-up tools',
                  'Advanced analytics',
                  'Priority support (24h)',
                  'Custom AI training',
                  'QR code + broadcasts',
                  'Customer satisfaction ratings',
                  '5 languages supported',
                  '7-day free trial',
                ].map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-green-500 font-bold mt-0.5">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/signup?plan=pro"
                className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors"
              >
                Start Free Trial
              </Link>
            </div>

            {/* Business */}
            <div className="bg-white border border-gray-200 rounded-2xl p-8">
              <h3 className="mb-1 text-xl font-bold text-gray-900 sm:text-2xl">Business</h3>
              <p className="text-gray-600 text-sm mb-4">Full suite for serious businesses</p>
              <div className="text-4xl font-bold text-gray-900 mb-6">
                $149<span className="text-lg font-normal text-gray-600">/mo</span>
              </div>
              <ul className="space-y-2.5 mb-8">
                {[
                  'Everything in Pro',
                  'Agent Audit & compliance',
                  'AI safety scoring',
                  'Weekly PDF compliance report',
                  'Agency mode (manage clients)',
                  'Multi-location support',
                  'Phone support',
                  'Dedicated onboarding call',
                  'SLA guarantee',
                  '7-day free trial',
                ].map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-green-500 font-bold mt-0.5">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/signup?plan=business"
                className="block w-full text-center border border-gray-300 hover:border-blue-400 text-gray-700 hover:text-blue-600 font-semibold py-3 rounded-xl transition-colors"
              >
                Start Free Trial
              </Link>
            </div>
          </div>

          <p className="text-center text-sm text-gray-500 mt-8">
            All plans include: SSL security • GDPR compliant • 99.9% uptime SLA • Setup assistance
          </p>
        </div>
      </section>

      {/* ── Niche section ─────────────────────────────────────────────────── */}
      <section className="bg-white py-12 sm:py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="mb-4 text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">Built for Your Industry</h2>
            <p className="text-sm text-gray-600 sm:text-base">
              Pre-configured AI for the most common local business types
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: '🚗',
                title: 'Car Rentals',
                uses: ['Answers pricing questions 24/7', 'Collects booking details', 'Handles airport pickup requests'],
              },
              {
                icon: '💈',
                title: 'Barbershops & Salons',
                uses: ['Books appointments automatically', 'Shares services and prices', 'Sends reminder messages'],
              },
              {
                icon: '🏠',
                title: 'Student Accommodation',
                uses: ['Helps students in 5 languages', 'Answers room and availability questions', 'Collects move-in inquiries'],
              },
              {
                icon: '🍽️',
                title: 'Restaurants',
                uses: ['Shares menu and hours', 'Takes reservation requests', 'Answers location questions'],
              },
              {
                icon: '🏨',
                title: 'Hotels & Guesthouses',
                uses: ['Handles room inquiries', 'Shares amenities and rates', 'Collects booking requests'],
              },
              {
                icon: '🏥',
                title: 'Clinics & Gyms',
                uses: ['Books appointments', 'Answers service questions', 'Captures new patient/member leads'],
              },
            ].map(niche => (
              <div
                key={niche.title}
                className="border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-shadow"
              >
                <div className="text-3xl mb-3">{niche.icon}</div>
                <h3 className="font-bold text-gray-900 mb-3">{niche.title}</h3>
                <ul className="space-y-1.5 mb-4">
                  {niche.uses.map(u => (
                    <li key={u} className="text-gray-600 text-sm flex items-start gap-2">
                      <span className="text-blue-400 mt-0.5">→</span> {u}
                    </li>
                  ))}
                </ul>
                <Link href="/demo" className="text-blue-600 hover:text-blue-700 text-sm font-semibold">
                  See Demo →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────────────────────────── */}
      <section className="bg-gray-50 py-12 sm:py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">What Businesses Are Saying</h2>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {[
              {
                stars: 5,
                quote: 'Before CypAI, I was answering WhatsApp at midnight for price quotes. Now the AI handles everything. I wake up to confirmed bookings.',
                author: 'Mehmet A.',
                business: 'Kyrenia Car Rentals',
                badge: 'Bookings up 40% in first month',
              },
              {
                stars: 5,
                quote: "Our guests speak English, Russian and Arabic. CypAI answers all of them instantly in their language. We haven't missed a single inquiry.",
                author: 'Anastasia K.',
                business: 'Bellapais Accommodation',
                badge: 'Zero missed inquiries in 3 months',
              },
              {
                stars: 5,
                quote: 'I spent 2 hours a day answering basic questions. CypAI handles all of that now. I just focus on my work.',
                author: 'Yusuf Ö.',
                business: 'Studio One Barbershop',
                badge: 'Saved 2+ hours every day',
              },
            ].map(t => (
              <div
                key={t.author}
                className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm"
              >
                <div className="text-yellow-400 text-lg mb-3">{'★'.repeat(t.stars)}</div>
                <p className="text-gray-700 mb-4 leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                <div className="mb-3">
                  <div className="font-semibold text-gray-900 text-sm">— {t.author}</div>
                  <div className="text-gray-600 text-xs">{t.business}</div>
                </div>
                <span className="inline-block bg-green-50 text-green-700 text-xs font-medium px-3 py-1 rounded-full">
                  {t.badge}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <section id="faq" className="bg-white py-12 sm:py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
                <button
                  className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                  onClick={() => toggleFaq(i)}
                  aria-expanded={openFaqIndex === i ? 'true' : 'false'}
                >
                  <span className="font-semibold text-gray-900 text-sm pr-4">{faq.q}</span>
                  <span className="text-blue-600 font-bold text-xl flex-shrink-0">
                    {openFaqIndex === i ? '−' : '+'}
                  </span>
                </button>
                {openFaqIndex === i && (
                  <div className="px-6 pb-4 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────────────────── */}
      <section className="bg-blue-600 py-12 sm:py-16 lg:py-24 text-center text-white">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="mb-4 text-2xl font-bold sm:text-3xl lg:text-4xl">Ready to Never Miss a Customer Again?</h2>
          <p className="mb-8 text-sm text-blue-100 sm:text-base lg:text-lg">
            Join local businesses already using AI to capture leads while they sleep.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Link
              href="/signup?plan=pro"
              className="bg-white text-blue-600 font-bold px-8 py-4 rounded-xl text-lg hover:bg-blue-50 transition-colors"
            >
              Start Free 7-Day Trial
            </Link>
            <a
              href="https://wa.me/905338425559"
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-white text-white font-bold px-8 py-4 rounded-xl text-lg hover:bg-white/10 transition-colors"
            >
              💬 Chat With Us First
            </a>
          </div>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-blue-100 text-sm">
            {['No credit card required', 'Setup in 15 minutes', 'Cancel anytime', 'Secure payment'].map(t => (
              <span key={t} className="flex items-center gap-1.5">
                <span className="text-white font-bold">✓</span> {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer className="bg-slate-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-10 mb-10">
            {/* Col 1 — Brand (spans 2) */}
            <div className="md:col-span-2">
              <div className="text-white font-bold text-xl mb-3">🤖 CypAI</div>
              <p className="text-sm leading-relaxed mb-4">
                AI agents for local businesses worldwide. 24/7 customer service in 5 languages — on WhatsApp and your website.
              </p>
              <div className="space-y-1 text-sm">
                <div>📍 Serving businesses in Northern Cyprus and globally 🌍</div>
                <div>
                  ✉️{' '}
                  <a href="mailto:cypai.app@cypai.app" className="hover:text-white transition-colors">
                    cypai.app@cypai.app
                  </a>
                </div>
                <div>
                  💬 WhatsApp:{' '}
                  <a
                    href="https://wa.me/905338425559"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    +90 533 842 5559
                  </a>
                </div>
              </div>
            </div>

            {/* Col 2 — Product */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><Link href="/demo" className="hover:text-white transition-colors">Live Demo</Link></li>
                <li><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>

            {/* Col 3 — Company */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="/login" className="hover:text-white transition-colors">Client Login</Link></li>
                <li><Link href="/affiliate" className="hover:text-white transition-colors">Affiliate Program</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-6 text-xs text-gray-600 flex flex-col md:flex-row items-center justify-between gap-2">
            <span>© 2026 CypAI. All rights reserved</span>
            <span className="text-center">
              Serving businesses across Northern Cyprus — Kyrenia · Nicosia · Famagusta · Güzelyurt · Lefke · and worldwide 🌍
            </span>
          </div>
        </div>
      </footer>

      {/* ── Floating WhatsApp button ───────────────────────────────────────── */}
      <a
        href="https://wa.me/905338425559?text=Hi%2C%20I%20want%20to%20learn%20more%20about%20CypAI"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-6 left-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center text-2xl shadow-lg transition-all hover:scale-110"
      >
        💬
      </a>
    </>
  )
}




