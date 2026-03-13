'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [openFaq, setOpenFaq] = useState<number|null>(null)
  const [bannerClosed, setBannerClosed] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="min-h-screen bg-white font-sans">

      {/* ── ANNOUNCEMENT BANNER ── */}
      {!bannerClosed && (
        <div className="bg-blue-600 text-white text-sm 
          text-center py-2.5 px-4 flex items-center 
          justify-center gap-2 relative">
          <span>🎉 7-day free trial on all plans — 
            No credit card required →</span>
          <Link href="/signup?plan=pro" 
            className="underline font-semibold 
            hover:text-blue-200">
            Start Free Today
          </Link>
          <button 
            onClick={() => setBannerClosed(true)}
            className="absolute right-4 top-1/2 
            -translate-y-1/2 hover:text-blue-200 
            text-lg leading-none">
            ×
          </button>
        </div>
      )}

      {/* ── NAVBAR ── */}
      <nav className={`sticky top-0 z-50 bg-white 
        transition-shadow duration-300
        ${scrolled ? 'shadow-md' : 'shadow-sm'}`}>
        <div className="max-w-7xl mx-auto px-4 
          sm:px-6 lg:px-8">
          <div className="flex items-center 
            justify-between h-16">

            {/* Logo */}
            <Link href="/" 
              className="flex items-center gap-2 
              flex-shrink-0">
              <span className="text-2xl">🤖</span>
              <span className="font-bold text-xl 
                text-gray-900">CypAI</span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center 
              gap-8">
              {[
                ['#features','Features'],
                ['#pricing','Pricing'],
                ['/demo','Live Demo'],
                ['#contact','Contact'],
              ].map(([href, label]) => (
                <a key={href} href={href}
                  className="text-gray-600 
                  hover:text-blue-600 text-sm 
                  font-medium transition-colors">
                  {label}
                </a>
              ))}
            </div>

            {/* Right */}
            <div className="flex items-center gap-3">
              <Link href="/login"
                className="hidden sm:block text-sm 
                text-gray-600 hover:text-gray-900 
                font-medium transition-colors">
                Login
              </Link>
              <Link href="/signup?plan=pro"
                className="bg-blue-600 hover:bg-blue-700 
                text-white text-sm font-semibold px-4 
                py-2 rounded-xl transition-all 
                hover:scale-105 whitespace-nowrap">
                Start Free Trial
              </Link>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden p-2 rounded-lg 
                hover:bg-gray-100 text-gray-600 
                transition-colors text-xl">
                {menuOpen ? '✕' : '☰'}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {menuOpen && (
            <div className="md:hidden border-t 
              border-gray-100 py-3 space-y-1 pb-4">
              {[
                ['#features','Features'],
                ['#pricing','Pricing'],
                ['/demo','Live Demo'],
                ['#contact','Contact'],
                ['/login','Login'],
              ].map(([href, label]) => (
                <a key={href} href={href}
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-2.5 
                  text-gray-700 hover:bg-gray-50 
                  rounded-lg text-sm font-medium">
                  {label}
                </a>
              ))}
              <div className="px-4 pt-2">
                <Link href="/signup?plan=pro"
                  className="block bg-blue-600 
                  text-white text-center py-3 
                  rounded-xl font-semibold 
                  hover:bg-blue-700 text-sm">
                  Start Free Trial
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="bg-gradient-to-br 
        from-slate-900 via-slate-800 to-blue-950 
        text-white">
        <div className="max-w-7xl mx-auto px-4 
          sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 
            gap-12 items-center">

            {/* Left */}
            <div>
              <div className="inline-flex items-center 
                gap-2 bg-blue-600/20 border 
                border-blue-500/30 text-blue-300 
                text-sm font-medium px-4 py-2 
                rounded-full mb-6">
                🇨🇾 Built for Cyprus Businesses
              </div>

              <h1 className="text-4xl sm:text-5xl 
                lg:text-6xl font-bold leading-tight 
                mb-6">
                Your AI Agent That{' '}
                <span className="text-blue-400">
                  Never Misses
                </span>{' '}
                a Customer
              </h1>

              <p className="text-lg text-slate-300 
                mb-8 leading-relaxed">
                24/7 AI assistant for car rentals, 
                barbershops, hotels, and restaurants. 
                Handles WhatsApp + website chat in 
                English, Turkish, Arabic, Russian 
                & Greek.
              </p>

              <div className="flex flex-col 
                sm:flex-row gap-3 mb-8">
                {[
                  '✓ Setup in 15 minutes',
                  '✓ No technical skills needed',
                  '✓ 7-day free trial',
                  '✓ Cancel anytime',
                ].map(t => (
                  <span key={t} 
                    className="text-sm 
                    text-slate-300 flex items-center 
                    gap-1">
                    {t}
                  </span>
                ))}
              </div>

              <div className="flex flex-col 
                sm:flex-row gap-4">
                <Link href="/signup?plan=pro"
                  className="bg-blue-600 
                  hover:bg-blue-500 text-white 
                  font-bold px-8 py-4 rounded-xl 
                  transition-all hover:scale-105 
                  text-center shadow-lg 
                  shadow-blue-900/40">
                  Start Free Trial →
                </Link>
                <Link href="/demo"
                  className="border border-slate-500 
                  hover:border-blue-400 text-white 
                  font-semibold px-8 py-4 
                  rounded-xl transition-all 
                  hover:bg-white/5 text-center">
                  See Live Demo
                </Link>
              </div>
            </div>

            {/* Right — Chat preview */}
            <div className="hidden lg:block">
              <div className="bg-white rounded-2xl 
                shadow-2xl overflow-hidden max-w-sm 
                mx-auto">
                <div className="bg-blue-600 px-4 
                  py-3 flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 
                    rounded-full flex items-center 
                    justify-center text-sm">🤖</div>
                  <div>
                    <p className="text-white text-sm 
                      font-semibold">
                      Kyrenia Car Rentals AI
                    </p>
                    <p className="text-blue-200 
                      text-xs flex items-center gap-1">
                      <span className="w-1.5 h-1.5 
                        bg-green-400 rounded-full 
                        inline-block"/>
                      Online 24/7
                    </p>
                  </div>
                </div>
                <div className="p-4 space-y-3 
                  bg-gray-50 min-h-48">
                  {[
                    { bot: true, text: 'Merhaba! 👋 Hi! How can I help? I can help with cars, prices, and bookings.' },
                    { bot: false, text: 'How much for an SUV for 3 days?' },
                    { bot: true, text: 'Our SUV is $55/day — 3 days = $165 total 🚙 Shall I take your details?' },
                    { bot: false, text: 'Yes! Ahmed, +90 533 xxx xxxx' },
                    { bot: true, text: '✅ Perfect Ahmed! Your booking is saved. Owner confirms within 1 hour!' },
                  ].map((m, i) => (
                    <div key={i} className={`flex 
                      ${m.bot ? 'justify-start' 
                               : 'justify-end'}`}>
                      <div className={`px-3 py-2 
                        rounded-xl text-xs max-w-xs 
                        leading-relaxed
                        ${m.bot 
                          ? 'bg-white text-gray-800 shadow-sm' 
                          : 'bg-blue-600 text-white'}`}>
                        {m.text}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Stats bar */}
          <div className="grid grid-cols-2 
            sm:grid-cols-4 gap-6 mt-16 pt-12 
            border-t border-slate-700">
            {[
              ['24/7', 'Always online'],
              ['5', 'Languages spoken'],
              ['15min', 'Setup time'],
              ['$0', 'To start'],
            ].map(([val, label]) => (
              <div key={label} className="text-center">
                <div className="text-3xl font-bold 
                  text-white mb-1">{val}</div>
                <div className="text-slate-400 
                  text-sm">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHO IT IS FOR ── */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 
          sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl 
              font-bold text-gray-900 mb-4">
              Perfect for Every Local Business
            </h2>
            <p className="text-gray-600 text-lg 
              max-w-2xl mx-auto">
              Any business that talks to customers 
              can save hours every day with CypAI
            </p>
          </div>
          <div className="grid grid-cols-2 
            md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              ['🚗', 'Car Rentals', 'Price quotes & bookings automatically'],
              ['✂️', 'Barbershops', 'Appointments & availability 24/7'],
              ['🏨', 'Hotels', 'Multilingual guest support'],
              ['🍽️', 'Restaurants', 'Reservations & menu questions'],
              ['🎓', 'Student Housing', 'International student inquiries'],
              ['🏥', 'Clinics & Gyms', 'Appointment scheduling'],
            ].map(([icon, title, desc]) => (
              <div key={title} 
                className="bg-white rounded-2xl 
                p-5 text-center shadow-sm 
                hover:shadow-md hover:-translate-y-1 
                transition-all border 
                border-gray-100">
                <div className="text-4xl mb-3">
                  {icon}
                </div>
                <h3 className="font-bold text-gray-900 
                  text-sm mb-1">{title}</h3>
                <p className="text-gray-500 text-xs 
                  leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="features" 
        className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 
          sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl 
              font-bold text-gray-900 mb-4">
              Up and Running in 15 Minutes
            </h2>
            <p className="text-gray-600 text-lg">
              No coding. No tech skills. Just fill 
              in your business details and go live.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 
            lg:grid-cols-5 gap-6">
            {[
              ['1', '📝', 'Sign Up', 'Choose your plan and create your account in 2 minutes'],
              ['2', '🏪', 'Add Your Business', 'Tell the AI your prices, hours, and services'],
              ['3', '🤖', 'Train Your AI', 'Add custom FAQs and instructions for your business'],
              ['4', '🔗', 'Add to Website', 'Copy one line of code to your website'],
              ['5', '🚀', 'Go Live', 'Your AI handles customers 24/7 automatically'],
            ].map(([num, icon, title, desc]) => (
              <div key={num} 
                className="text-center relative">
                <div className="w-14 h-14 bg-blue-600 
                  text-white rounded-2xl flex items-center 
                  justify-center text-2xl mx-auto mb-4 
                  shadow-lg shadow-blue-200">
                  {icon}
                </div>
                <div className="absolute -top-2 
                  left-1/2 -translate-x-1/2 
                  w-6 h-6 bg-blue-100 text-blue-600 
                  rounded-full flex items-center 
                  justify-center text-xs font-bold">
                  {num}
                </div>
                <h3 className="font-bold text-gray-900 
                  mb-2">{title}</h3>
                <p className="text-gray-500 text-sm 
                  leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES GRID ── */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 
          sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl 
              font-bold text-gray-900 mb-4">
              Everything Your Business Needs
            </h2>
            <p className="text-gray-600 text-lg 
              max-w-2xl mx-auto">
              Not just a chatbot — a complete 
              AI business platform
            </p>
          </div>
          <div className="grid sm:grid-cols-2 
            lg:grid-cols-4 gap-5">
            {[
              ['💬', 'AI Chat Widget', 'Embed on your website in seconds. Answers questions, captures leads, takes bookings automatically.'],
              ['📱', 'WhatsApp Integration', 'Your AI answers WhatsApp messages 24/7. Never miss a customer message again.'],
              ['🌍', '5 Language Support', 'Automatically detects and responds in English, Turkish, Arabic, Russian, and Greek.'],
              ['👥', 'CRM & Lead Management', 'Every lead is saved. Track status from New → Contacted → Converted.'],
              ['📅', 'Booking System', 'Customers book through the AI. Confirm with one click and they get a WhatsApp notification.'],
              ['📨', 'Follow-up Tools', 'Send WhatsApp follow-ups to leads using ready-made templates. Never lose a prospect.'],
              ['📊', 'Analytics Dashboard', 'See conversations, languages, peak hours, and conversion rates in real time.'],
              ['🔒', 'Agent Audit', 'Review every AI response. Get a compliance score and weekly PDF report (Business plan).'],
              ['📲', 'QR Code Generator', 'Print a QR code for walk-in customers to chat with your AI instantly.'],
              ['⚙️', 'Custom AI Training', 'Add your own prices, FAQs, and instructions. The AI learns your business completely.'],
              ['🏢', 'Agency Mode', 'Manage multiple client businesses from one dashboard (Business plan).'],
              ['⚡', '15-Minute Setup', 'From signup to live in 15 minutes. No coding or technical skills needed.'],
            ].map(([icon, title, desc]) => (
              <div key={title} 
                className="bg-white rounded-2xl p-6 
                shadow-sm hover:shadow-md 
                hover:-translate-y-1 transition-all 
                border border-gray-100">
                <div className="text-3xl mb-3">
                  {icon}
                </div>
                <h3 className="font-bold text-gray-900 
                  mb-2">{title}</h3>
                <p className="text-gray-500 text-sm 
                  leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMPARISON ── */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 
          sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl 
              font-bold text-gray-900 mb-4">
              More Than Just a Chatbot
            </h2>
          </div>
          <div className="rounded-2xl overflow-hidden 
            border border-gray-200 shadow-sm">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-6 py-4 
                    text-gray-600 font-semibold text-sm">
                    Feature
                  </th>
                  <th className="px-6 py-4 text-center 
                    bg-blue-600 text-white font-bold">
                    CypAI
                  </th>
                  <th className="px-6 py-4 text-center 
                    text-gray-500 font-semibold text-sm">
                    Basic Chatbot
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['AI Chat (5 languages)', true, true],
                  ['Lead CRM', true, false],
                  ['Booking System', true, false],
                  ['Follow-up Tools', true, false],
                  ['Analytics', true, false],
                  ['WhatsApp Integration', true, false],
                  ['Agency Mode', true, false],
                  ['Setup Time', '15 min', 'Hours'],
                ].map(([feat, cypai, basic], i) => (
                  <tr key={String(feat)} 
                    className={i % 2 === 0 
                      ? 'bg-white' 
                      : 'bg-gray-50'}>
                    <td className="px-6 py-3.5 
                      text-gray-700 text-sm font-medium">
                      {feat}
                    </td>
                    <td className="px-6 py-3.5 
                      text-center bg-blue-50">
                      {typeof cypai === 'boolean' 
                        ? (cypai 
                          ? <span className="text-green-600 font-bold">✓</span> 
                          : <span className="text-red-400">✕</span>)
                        : <span className="text-blue-700 font-semibold text-sm">{cypai}</span>
                      }
                    </td>
                    <td className="px-6 py-3.5 
                      text-center">
                      {typeof basic === 'boolean'
                        ? (basic
                          ? <span className="text-green-600 font-bold">✓</span>
                          : <span className="text-red-400">✕</span>)
                        : <span className="text-gray-500 text-sm">{basic}</span>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── DEMO CTA ── */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 
          text-center">
          <h2 className="text-3xl sm:text-4xl 
            font-bold text-white mb-4">
            See It In Action
          </h2>
          <p className="text-blue-100 text-lg mb-8">
            Try a live demo of a car rental AI, 
            barbershop AI, or student housing AI
          </p>
          <Link href="/demo"
            className="inline-block bg-white 
            text-blue-600 font-bold px-10 py-4 
            rounded-xl hover:bg-blue-50 
            transition-all hover:scale-105 
            shadow-lg text-lg">
            Try Live Demo →
          </Link>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" 
        className="py-16 sm:py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 
          sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl 
              font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-gray-600 text-lg">
              7-day free trial on all plans. 
              No credit card required. 
              Cancel anytime.
            </p>
          </div>

          <div className="grid md:grid-cols-3 
            gap-8 items-stretch">
            {[
              {
                name: 'Starter',
                price: 29,
                desc: 'Perfect for small businesses just getting started',
                popular: false,
                features: [
                  '500 messages/month',
                  'Website chat widget',
                  'Lead capture (name + phone)',
                  'Basic analytics',
                  'QR code for walk-ins',
                  '5 language support',
                  'Email support',
                ],
                plan: 'starter',
              },
              {
                name: 'Pro',
                price: 79,
                desc: 'Most popular for growing businesses',
                popular: true,
                features: [
                  'Unlimited messages',
                  'Website chat widget',
                  'WhatsApp integration',
                  'CRM & lead management',
                  'Booking system',
                  'Follow-up tools',
                  'Advanced analytics',
                  'Custom AI training',
                  'QR code + broadcasts',
                  '5 language support',
                  'Priority support (24h)',
                ],
                plan: 'pro',
              },
              {
                name: 'Business',
                price: 149,
                desc: 'For agencies and multi-location businesses',
                popular: false,
                features: [
                  'Everything in Pro',
                  'Agent Audit & compliance',
                  'AI safety scoring',
                  'Weekly PDF reports',
                  'Multi-location support',
                  'Agency mode',
                  'Dedicated onboarding call',
                  'SLA guarantee',
                  'Phone support',
                ],
                plan: 'business',
              },
            ].map((p) => (
              <div key={p.name}
                className={`rounded-2xl p-8 flex 
                  flex-col relative
                  ${p.popular 
                    ? 'bg-blue-600 text-white shadow-2xl shadow-blue-200 scale-105' 
                    : 'bg-white border border-gray-200 shadow-sm'
                  }`}>
                {p.popular && (
                  <div className="absolute -top-4 
                    left-1/2 -translate-x-1/2 
                    bg-yellow-400 text-yellow-900 
                    text-xs font-bold px-4 py-1.5 
                    rounded-full">
                    ⭐ MOST POPULAR
                  </div>
                )}
                <div className="mb-6">
                  <h3 className={`text-xl font-bold mb-1
                    ${p.popular ? 'text-white' 
                                : 'text-gray-900'}`}>
                    {p.name}
                  </h3>
                  <p className={`text-sm mb-4
                    ${p.popular ? 'text-blue-100' 
                                : 'text-gray-500'}`}>
                    {p.desc}
                  </p>
                  <div className="flex items-baseline 
                    gap-1">
                    <span className={`text-5xl font-black
                      ${p.popular ? 'text-white' 
                                  : 'text-gray-900'}`}>
                      ${p.price}
                    </span>
                    <span className={p.popular 
                      ? 'text-blue-200' 
                      : 'text-gray-400'}>
                      /mo
                    </span>
                  </div>
                </div>

                <ul className="space-y-2.5 
                  flex-1 mb-8">
                  {p.features.map(f => (
                    <li key={f} 
                      className="flex items-start 
                      gap-2.5 text-sm">
                      <span className={`mt-0.5 
                        flex-shrink-0 font-bold
                        ${p.popular 
                          ? 'text-blue-200' 
                          : 'text-green-500'}`}>
                        ✓
                      </span>
                      <span className={p.popular 
                        ? 'text-blue-50' 
                        : 'text-gray-600'}>
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link href={`/signup?plan=${p.plan}`}
                  className={`block text-center 
                  font-bold py-3.5 rounded-xl 
                  transition-all hover:scale-105
                  ${p.popular 
                    ? 'bg-white text-blue-600 hover:bg-blue-50' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}>
                  Start Free Trial
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 
          sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl 
              font-bold text-gray-900 mb-4">
              Trusted by Cyprus Businesses
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Mehmet Aydın',
                business: 'Kyrenia Car Rentals',
                text: 'Before CypAI I answered WhatsApp at midnight for price quotes. Now the AI handles everything. I wake up to confirmed bookings.',
                result: 'Bookings up 40% in first month',
                avatar: '🚗',
              },
              {
                name: 'Anastasia K.',
                business: 'Bellapais Accommodation',
                text: 'Our guests speak English, Russian and Arabic. CypAI answers all of them instantly. We have not missed a single inquiry since setup.',
                result: 'Zero missed inquiries in 3 months',
                avatar: '🏨',
              },
              {
                name: 'Yusuf Özkan',
                business: 'Studio One Barbershop',
                text: 'I spent 2 hours a day answering basic questions. CypAI handles all of that now. I just focus on my work.',
                result: 'Saved 2+ hours every day',
                avatar: '✂️',
              },
            ].map((t) => (
              <div key={t.name} 
                className="bg-gray-50 rounded-2xl 
                p-7 border border-gray-100 
                hover:shadow-md transition-all">
                <div className="text-yellow-400 
                  text-xl mb-4">
                  ★★★★★
                </div>
                <p className="text-gray-700 
                  leading-relaxed mb-6 italic">
                  "{t.text}"
                </p>
                <div className="flex items-center 
                  gap-3 mb-4">
                  <div className="w-11 h-11 
                    bg-blue-100 rounded-full 
                    flex items-center justify-center 
                    text-2xl flex-shrink-0">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-bold 
                      text-gray-900 text-sm">
                      {t.name}
                    </p>
                    <p className="text-gray-500 
                      text-xs">{t.business}</p>
                  </div>
                </div>
                <div className="bg-green-50 
                  text-green-700 text-xs font-semibold 
                  px-3 py-1.5 rounded-full 
                  inline-block">
                  ✓ {t.result}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" 
        className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 
          sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl 
              font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-3">
            {[
              ['How long does setup take?', 'Most businesses are live in 15 minutes. Fill in your details, add your prices and FAQs, and your AI is ready. No coding needed.'],
              ['Which languages does the AI speak?', 'English, Turkish, Arabic, Russian, and Greek. The AI detects the customer language automatically and responds in the same language.'],
              ['How does WhatsApp integration work?', 'On Pro and Business plans your AI connects to your WhatsApp Business number and responds to customers 24/7 automatically.'],
              ['Can I edit what the AI says?', 'Yes fully. From your dashboard add custom instructions, prices, hours, and FAQs. The AI learns your business completely.'],
              ['What is the CRM feature?', 'Every lead the AI captures is saved to your CRM. You can track status (New, Contacted, Interested, Converted), add notes, and manage all your contacts.'],
              ['How does the booking system work?', 'The AI collects booking details from customers and saves them to your dashboard. You confirm or decline with one click and the customer gets a WhatsApp notification.'],
              ['How is customer data protected?', 'All data is stored securely in encrypted databases. Business plan includes compliance reports and audit logs for full transparency.'],
              ['Can I cancel anytime?', 'Yes. No contracts, no fees. Cancel from your dashboard at any time.'],
            ].map(([q, a], i) => (
              <div key={String(q)} 
                className="bg-white rounded-xl 
                border border-gray-200 
                overflow-hidden">
                <button
                  onClick={() => setOpenFaq(
                    openFaq === i ? null : i
                  )}
                  className="w-full flex items-center 
                  justify-between px-6 py-4 
                  text-left hover:bg-gray-50 
                  transition-colors">
                  <span className="font-semibold 
                    text-gray-900 text-sm 
                    sm:text-base pr-4">
                    {q}
                  </span>
                  <span className={`text-blue-600 
                    text-xl flex-shrink-0 transition-transform
                    ${openFaq === i 
                      ? 'rotate-45' 
                      : ''}`}>
                    +
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4 
                    text-gray-600 text-sm 
                    leading-relaxed border-t 
                    border-gray-100 pt-3">
                    {a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-20 bg-gradient-to-br 
        from-slate-900 to-blue-950 text-white">
        <div className="max-w-3xl mx-auto px-4 
          text-center">
          <h2 className="text-3xl sm:text-4xl 
            font-bold mb-4">
            Ready to never miss a customer again?
          </h2>
          <p className="text-slate-300 text-lg mb-10">
            Join Cyprus businesses already using 
            CypAI to handle customers 24/7.
            Start your free 7-day trial today.
          </p>
          <div className="flex flex-col sm:flex-row 
            gap-4 justify-center">
            <Link href="/signup?plan=pro"
              className="bg-blue-600 hover:bg-blue-500 
              text-white font-bold px-10 py-4 
              rounded-xl transition-all 
              hover:scale-105 text-lg shadow-lg">
              Start Free Trial →
            </Link>
            <a href="https://wa.me/905338425559?text=Hi! I want to learn more about CypAI"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-slate-500 
              hover:border-green-400 text-white 
              font-semibold px-10 py-4 rounded-xl 
              transition-all hover:bg-green-500/10 
              text-lg flex items-center 
              justify-center gap-2">
              💬 WhatsApp Us
            </a>
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" 
        className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 
          sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold 
            text-gray-900 mb-8">
            Get in Touch
          </h2>
          <div className="flex flex-col sm:flex-row 
            gap-6 justify-center">
            <a href="mailto:cypai.app@cypai.app"
              className="flex items-center gap-3 
              bg-gray-50 hover:bg-blue-50 
              border border-gray-200 
              hover:border-blue-300 rounded-xl 
              px-6 py-4 transition-all group">
              <span className="text-2xl">📧</span>
              <div className="text-left">
                <p className="text-xs text-gray-500">
                  Email
                </p>
                <p className="font-semibold 
                  text-gray-900 group-hover:text-blue-600 
                  text-sm">
                  cypai.app@cypai.app
                </p>
              </div>
            </a>
            <a href="https://wa.me/905338425559"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 
              bg-gray-50 hover:bg-green-50 
              border border-gray-200 
              hover:border-green-300 rounded-xl 
              px-6 py-4 transition-all group">
              <span className="text-2xl">💬</span>
              <div className="text-left">
                <p className="text-xs text-gray-500">
                  WhatsApp
                </p>
                <p className="font-semibold 
                  text-gray-900 group-hover:text-green-600 
                  text-sm">
                  +90 533 842 5559
                </p>
              </div>
            </a>
          </div>
          <p className="text-gray-400 text-sm mt-6">
            Usually replies within 1 hour
          </p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-slate-900 text-white 
        py-12">
        <div className="max-w-7xl mx-auto px-4 
          sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 
            lg:grid-cols-4 gap-8 mb-10">
            <div className="lg:col-span-2">
              <div className="flex items-center 
                gap-2 mb-4">
                <span className="text-2xl">🤖</span>
                <span className="font-bold text-xl">
                  CypAI
                </span>
              </div>
              <p className="text-slate-400 text-sm 
                leading-relaxed mb-4 max-w-xs">
                The complete AI platform for local 
                businesses in Northern Cyprus. 
                Never miss a customer again.
              </p>
              <div className="flex gap-3 text-xl">
                {['🇬🇧','🇹🇷','🇸🇦','🇷🇺','🇬🇷'].map(f => (
                  <span key={f} title="Supported language">
                    {f}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4 
                text-sm uppercase tracking-wider 
                text-slate-400">
                Product
              </h4>
              <ul className="space-y-2.5">
                {[
                  ['#features','Features'],
                  ['#pricing','Pricing'],
                  ['/demo','Live Demo'],
                  ['/dashboard','Dashboard'],
                ].map(([href, label]) => (
                  <li key={href}>
                    <a href={href}
                      className="text-slate-400 
                      hover:text-white text-sm 
                      transition-colors">
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 
                text-sm uppercase tracking-wider 
                text-slate-400">
                Company
              </h4>
              <ul className="space-y-2.5">
                {[
                  ['#contact','Contact'],
                  ['/privacy','Privacy Policy'],
                  ['/terms','Terms of Service'],
                  ['/login','Client Login'],
                ].map(([href, label]) => (
                  <li key={href}>
                    <a href={href}
                      className="text-slate-400 
                      hover:text-white text-sm 
                      transition-colors">
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 
            pt-8 flex flex-col sm:flex-row 
            justify-between items-center gap-4">
            <p className="text-slate-500 text-sm">
              © 2026 CypAI. All rights reserved.
            </p>
            <p className="text-slate-500 text-sm">
              Made for Northern Cyprus 🇨🇾 · 
              Kyrenia · Nicosia · Famagusta · 
              Güzelyurt · Lefke
            </p>
          </div>
        </div>
      </footer>

      {/* ── WHATSAPP FLOATING BUTTON ── */}
      <a href="https://wa.me/905338425559?text=Hi! I want to learn more about CypAI"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 left-6 z-50 
        w-14 h-14 bg-green-500 hover:bg-green-600 
        rounded-full flex items-center justify-center 
        shadow-lg hover:scale-110 transition-all"
        title="Chat on WhatsApp">
        <svg viewBox="0 0 24 24" 
          className="w-7 h-7 fill-white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>

    </div>
  )
}
