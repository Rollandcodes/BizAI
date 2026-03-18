'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function ClinicsPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center" aria-label="CypAI Home">
            <Image
              src="/images/cypai-logo.png"
              alt="CypAI"
              width={160}
              height={48}
              className="h-8 w-auto"
            />
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm text-gray-600 transition-colors hover:text-[#1a1a2e]">Features</a>
            <a href="#pricing" className="text-sm text-gray-600 transition-colors hover:text-[#1a1a2e]">Pricing</a>
            <Link href="/demo" className="text-sm text-gray-600 transition-colors hover:text-[#1a1a2e]">Demo</Link>
          </nav>
          <Link
            href="/signup?plan=pro"
            className="rounded-lg bg-[#e8a020] px-4 py-2 text-sm font-semibold text-[#1a1a2e] transition-colors hover:bg-[#d4920a]"
          >
            Start Free Trial
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-[#1a1a2e] py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="mb-6 text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
            Your clinic answers patients<br />
            <span className="text-[#e8a020]">24/7. Your staff stays focused on care.</span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-300">
            Reduce admin. See more patients. CypAI handles appointment booking and FAQs automatically. GDPR-compliant.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/signup?plan=pro"
              className="rounded-xl bg-[#e8a020] px-8 py-4 text-lg font-bold text-[#1a1a2e] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#d4920a] hover:shadow-lg hover:shadow-[#e8a020]/20"
            >
              Start Free Trial — No Credit Card →
            </Link>
            <Link
              href="/demo"
              className="rounded-xl border border-gray-600 bg-transparent px-8 py-4 text-lg font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-gray-800"
            >
              See Live Demo →
            </Link>
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-gray-400">
            <span>✓ 7-day free trial</span>
            <span>·</span>
            <span>✓ Setup in 15 minutes</span>
            <span>·</span>
            <span>✓ GDPR Compliant</span>
          </div>
          <p className="mt-4 text-sm text-gray-400">
            Join [X] Cyprus businesses already using CypAI
          </p>
        </div>
      </section>

      {/* Pain Section */}
      <section className="bg-[#f8f9fb] py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-10 text-center text-3xl font-bold text-[#1a1a2e]">Sound familiar?</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4 rounded-xl bg-white p-5 shadow-sm">
              <span className="text-2xl">📞</span>
              <div>
                <p className="font-semibold text-[#1a1a2e]">Staff distracted from clinical work</p>
                <p className="mt-1 text-gray-600">Your team spends hours answering "opening hours, prices, which doctor is available" — instead of helping patients.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-xl bg-white p-5 shadow-sm">
              <span className="text-2xl">🌍</span>
              <div>
                <p className="font-semibold text-[#1a1a2e]">International patients struggle to communicate</p>
                <p className="mt-1 text-gray-600">Medical tourism patients from Russia, Middle East, Europe — they struggle in English or Greek.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-xl bg-white p-5 shadow-sm">
              <span className="text-2xl">💸</span>
              <div>
                <p className="font-semibold text-[#1a1a2e]">Costly no-shows</p>
                <p className="mt-1 text-gray-600">A missed 30-minute consultation = lost revenue. No system to remind patients.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-xl bg-white p-5 shadow-sm">
              <span className="text-2xl">🌙</span>
              <div>
                <p className="font-semibold text-[#1a1a2e]">After-hours silence</p>
                <p className="mt-1 text-gray-600">Evening and weekend enquiries go unanswered. Patients go elsewhere.</p>
              </div>
            </div>
          </div>
          <p className="mt-8 text-center text-lg font-semibold text-[#1a1a2e]">
            CypAI fixes all of this. <span className="text-[#e8a020]">Automatically.</span>
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-12 text-center text-3xl font-bold text-[#1a1a2e]">How it works</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#e8a020]/20 text-3xl mx-auto">1</div>
              <h3 className="text-xl font-bold text-[#1a1a2e]">Tell CypAI about your practice</h3>
              <p className="mt-2 text-gray-600">Add services, prices, doctors, hours, policies. GDPR-compliant setup.</p>
            </div>
            <div className="text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#e8a020]/20 text-3xl mx-auto">2</div>
              <h3 className="text-xl font-bold text-[#1a1a2e]">Connect WhatsApp and website</h3>
              <p className="mt-2 text-gray-600">Link your WhatsApp Business. Add chat widget to your site.</p>
            </div>
            <div className="text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#e8a020]/20 text-3xl mx-auto">3</div>
              <h3 className="text-xl font-bold text-[#1a1a2e]">Focus on patient care</h3>
              <p className="mt-2 text-gray-600">AI handles bookings and FAQs. Your staff focuses on patients who need human help.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-[#f8f9fb] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-4 text-center text-3xl font-bold text-[#1a1a2e]">Everything clinics need</h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-gray-600">Built specifically for clinics and gyms in Cyprus — GDPR compliant</p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md">
              <div className="mb-4 text-3xl">❓</div>
              <h3 className="text-lg font-bold text-[#1a1a2e]">FAQ Automation</h3>
              <p className="mt-2 text-gray-600">Opening hours, prices, location, parking, what to bring — answered instantly.</p>
            </div>
            <div className="rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md">
              <div className="mb-4 text-3xl">📅</div>
              <h3 className="text-lg font-bold text-[#1a1a2e]">Appointment Booking</h3>
              <p className="mt-2 text-gray-600">Patients book through WhatsApp or website. You confirm with one click.</p>
            </div>
            <div className="rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md">
              <div className="mb-4 text-3xl">🔔</div>
              <h3 className="text-lg font-bold text-[#1a1a2e]">Automated Reminders</h3>
              <p className="mt-2 text-gray-600">Reduce no-shows with appointment reminders sent automatically.</p>
            </div>
            <div className="rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md">
              <div className="mb-4 text-3xl">🌍</div>
              <h3 className="text-lg font-bold text-[#1a1a2e]">Multi-Language Support</h3>
              <p className="mt-2 text-gray-600">English, Turkish, Arabic, Russian, Greek — for international patients.</p>
            </div>
            <div className="rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md">
              <div className="mb-4 text-3xl">🔒</div>
              <h3 className="text-lg font-bold text-[#1a1a2e]">GDPR Compliant</h3>
              <p className="mt-2 text-gray-600">Built for EU/Cyprus regulations. Patient data handled securely.</p>
            </div>
            <div className="rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md">
              <div className="mb-4 text-3xl">📊</div>
              <h3 className="text-lg font-bold text-[#1a1a2e]">CRM & Analytics</h3>
              <p className="mt-2 text-gray-600">Track patient enquiries, conversion rates, and appointment history.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Language Section */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 text-3xl font-bold text-[#1a1a2e]">Your patients speak many languages.<br />CypAI speaks them all.</h2>
          <div className="mb-6 flex flex-wrap items-center justify-center gap-6 text-3xl">
            <span>🇬🇧</span>
            <span>🇹🇷</span>
            <span>🇸🇦</span>
            <span>🇷🇺</span>
            <span>🇬🇷</span>
          </div>
          <p className="text-gray-600">Auto-detects language. Responds automatically. No translator needed.</p>
        </div>
      </section>

      {/* Objection Handling */}
      <section className="bg-[#f8f9fb] py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-center text-3xl font-bold text-[#1a1a2e]">Common questions</h2>
          <div className="space-y-6">
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-[#1a1a2e]">"We have a receptionist"</h3>
              <p className="mt-2 text-gray-600">Your receptionist handles 50+ calls/day asking the same questions. CypAI handles those. Your receptionist focuses on patients who need human help.</p>
            </div>
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-[#1a1a2e]">"Medical information needs to be accurate — can AI handle this?"</h3>
              <p className="mt-2 text-gray-600">CypAI only answers what you train it to answer. Clinical questions outside your FAQ are routed to your team automatically.</p>
            </div>
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-[#1a1a2e]">"Is it GDPR compliant?"</h3>
              <p className="mt-2 text-gray-600">Yes. Built for EU/Cyprus regulations. Patient data is handled securely with full audit trails.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-4 text-center text-3xl font-bold text-[#1a1a2e]">Simple pricing</h2>
          <p className="mb-12 text-center text-gray-600">7-day free trial on all plans. No credit card required.</p>
          <div className="grid gap-6 md:grid-cols-3">
            {/* Starter */}
            <div className="rounded-2xl border border-gray-200 bg-white p-8">
              <p className="text-sm font-semibold uppercase text-gray-500">Starter</p>
              <div className="mt-2 text-5xl font-black text-[#1a1a2e]">
                $29<span className="ml-1 text-lg text-gray-500">/mo</span>
              </div>
              <p className="mt-3 text-sm text-gray-500">Perfect for small clinics</p>
              <ul className="mt-6 space-y-3 text-sm">
                <li>✓ 500 messages/month</li>
                <li>✓ Website chat widget</li>
                <li>✓ FAQ automation</li>
                <li>✓ 5 language support</li>
                <li>✓ GDPR compliant</li>
              </ul>
              <Link
                href="/signup?plan=starter"
                className="mt-8 block rounded-xl border border-gray-300 px-6 py-3 text-center font-semibold text-[#1a1a2e] transition-colors hover:bg-gray-50"
              >
                Start Free Trial
              </Link>
            </div>
            {/* Pro */}
            <div className="relative rounded-2xl border-2 border-[#e8a020] bg-white p-8 shadow-xl">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#e8a020] px-4 py-1.5 text-xs font-bold text-[#1a1a2e]">
                ⭐ Most Popular
              </span>
              <p className="text-sm font-semibold uppercase text-gray-500">Pro</p>
              <div className="mt-2 text-5xl font-black text-[#1a1a2e]">
                $79<span className="ml-1 text-lg text-gray-500">/mo</span>
              </div>
              <p className="mt-3 text-sm text-gray-500">For growing practices</p>
              <ul className="mt-6 space-y-3 text-sm">
                <li>✓ Unlimited messages</li>
                <li>✓ WhatsApp integration</li>
                <li>✓ Booking system</li>
                <li>✓ Appointment reminders</li>
                <li>✓ Full CRM</li>
              </ul>
              <Link
                href="/signup?plan=pro"
                className="mt-8 block rounded-xl bg-[#e8a020] px-6 py-3 text-center font-semibold text-[#1a1a2e] transition-colors hover:bg-[#d4920a]"
              >
                Start Free Trial
              </Link>
            </div>
            {/* Business */}
            <div className="rounded-2xl border border-gray-200 bg-white p-8">
              <p className="text-sm font-semibold uppercase text-gray-500">Business</p>
              <div className="mt-2 text-5xl font-black text-[#1a1a2e]">
                $149<span className="ml-1 text-lg text-gray-500">/mo</span>
              </div>
              <p className="mt-3 text-sm text-gray-500">For clinic groups</p>
              <ul className="mt-6 space-y-3 text-sm">
                <li>✓ Everything in Pro</li>
                <li>✓ Multi-location support</li>
                <li>✓ Priority support</li>
                <li>✓ SLA guarantee</li>
              </ul>
              <Link
                href="/signup?plan=business"
                className="mt-8 block rounded-xl border border-gray-300 px-6 py-3 text-center font-semibold text-[#1a1a2e] transition-colors hover:bg-gray-50"
              >
                Start Free Trial
              </Link>
            </div>
          </div>
          <p className="mt-8 text-center text-sm text-gray-500">
            Secure card payment powered by Paddle — trusted by 3,000+ software companies.<br />
            Cancel anytime, no questions asked.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-[#1a1a2e] py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white">Reduce admin. See more patients.<br />Zero extra staff.</h2>
          <Link
            href="/signup?plan=pro"
            className="mt-8 inline-block rounded-xl bg-[#e8a020] px-8 py-4 text-lg font-bold text-[#1a1a2e] transition-all duration-200 hover:bg-[#d4920a] hover:shadow-lg hover:shadow-[#e8a020]/20"
          >
            Start Your Free Trial Now →
          </Link>
          <p className="mt-4 text-sm text-gray-400">No credit card. No commitment. Cancel anytime.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#f8f9fb] py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-2">
              <Image
                src="/images/cypai-logo.png"
                alt="CypAI"
                width={120}
                height={36}
                className="h-7 w-auto"
              />
            </div>
            <div className="flex gap-6 text-sm text-gray-600">
              <Link href="/" className="hover:text-[#1a1a2e]">Home</Link>
              <Link href="#pricing" className="hover:text-[#1a1a2e]">Pricing</Link>
              <Link href="/demo" className="hover:text-[#1a1a2e]">Demo</Link>
              <Link href="/contact" className="hover:text-[#1a1a2e]">Contact</Link>
              <Link href="/privacy" className="hover:text-[#1a1a2e]">Privacy</Link>
            </div>
            <p className="text-sm text-gray-500">© 2025 CypAI. Built in Northern Cyprus.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
