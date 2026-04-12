import Link from 'next/link'
import Image from 'next/image'

export const metadata = {
  title: 'Car Rentals | CypAI',
}

export default function CarRentalsPage() {
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
            href="/sign-up"
            className="rounded-lg bg-[#e8a020] px-4 py-2 text-sm font-semibold text-[#1a1a2e] transition-colors hover:bg-[#d4920a]"
          >
            Start Free Trial
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-[#1a1a2e] py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <span className="mb-4 inline-block rounded-full bg-[#e8a020]/20 px-4 py-2 text-sm font-semibold text-[#e8a020]">
            🚗 For Car Rental Businesses in Cyprus
          </span>
          <h1 className="mb-6 text-4xl font-black leading-tight text-white md:text-5xl lg:text-6xl">
            Stop losing bookings while you sleep.
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-white/70">
            CypAI answers WhatsApp enquiries 24/7, quotes prices instantly in any language, and captures every lead — even at 3am.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/sign-up"
              className="rounded-xl bg-[#e8a020] px-8 py-4 text-lg font-bold text-[#1a1a2e] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#d4920a] hover:shadow-lg hover:shadow-[#e8a020]/20"
            >
              Start Free Trial — No Credit Card
            </Link>
            <Link
              href="/demo"
              className="rounded-xl border border-gray-600 bg-transparent px-8 py-4 text-lg font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-gray-800"
            >
              See Live Demo →
            </Link>
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-white/60">
            <span>✓ 7-day free trial</span>
            <span>·</span>
            <span>✓ Setup in 15 minutes</span>
            <span>·</span>
            <span>✓ Cancel anytime</span>
          </div>
          <p className="mt-4 text-sm text-white/60">
            Join 200+ Cyprus businesses already using CypAI
          </p>
        </div>
      </section>

      {/* Pain Section - Sound familiar? */}
      <section className="bg-[#f8f9fb] py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-10 text-center text-3xl font-bold text-[#1a1a2e]">Sound familiar?</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4 rounded-xl bg-white p-5 shadow-sm">
              <span className="text-2xl">😴</span>
              <div>
                <p className="font-semibold text-[#1a1a2e]">You <strong>miss bookings</strong> because customers WhatsApp at midnight and you're asleep</p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-xl bg-white p-5 shadow-sm">
              <span className="text-2xl">🌍</span>
              <div>
                <p className="font-semibold text-[#1a1a2e]">Tourists message in <strong>Russian, Arabic, German</strong> — you can't reply in their language</p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-xl bg-white p-5 shadow-sm">
              <span className="text-2xl">🔁</span>
              <div>
                <p className="font-semibold text-[#1a1a2e]">You answer <strong>"what's your cheapest car?"</strong> 40 times a day</p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-xl bg-white p-5 shadow-sm">
              <span className="text-2xl">📵</span>
              <div>
                <p className="font-semibold text-[#1a1a2e]">You're at the car yard, not at your phone, and <strong>lose leads</strong></p>
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
              <h3 className="text-xl font-bold text-[#1a1a2e]">Tell CypAI about your car rental business</h3>
              <p className="mt-2 text-gray-600">Add your prices, fleet details, hours, and policies. Takes 10 minutes. The AI learns your business quickly.</p>
            </div>
            <div className="text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#e8a020]/20 text-3xl mx-auto">2</div>
              <h3 className="text-xl font-bold text-[#1a1a2e]">Connect WhatsApp and your website</h3>
              <p className="mt-2 text-gray-600">One line of code for the website widget. 2 minutes to connect your WhatsApp Business number.</p>
            </div>
            <div className="text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#e8a020]/20 text-3xl mx-auto">3</div>
              <h3 className="text-xl font-bold text-[#1a1a2e]">Watch enquiries become bookings</h3>
              <p className="mt-2 text-gray-600">CypAI handles conversations 24/7 in 5 languages. You review the dashboard and confirm bookings.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-[#f8f9fb] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-4 text-center text-3xl font-bold text-[#1a1a2e]">Everything car rental businesses need</h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-gray-600">Built specifically for car rental companies in Cyprus</p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md">
              <div className="mb-4 text-3xl">💬</div>
              <h3 className="text-lg font-bold text-[#1a1a2e]">WhatsApp Automation</h3>
              <p className="mt-2 text-gray-600">90% of your customers contact you via WhatsApp. CypAI answers instantly, 24/7.</p>
            </div>
            <div className="rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md">
              <div className="mb-4 text-3xl">🌍</div>
              <h3 className="text-lg font-bold text-[#1a1a2e]">Multi-Language Quotes</h3>
              <p className="mt-2 text-gray-600">Tourists from 10+ countries message in their language. CypAI replies in kind.</p>
            </div>
            <div className="rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md">
              <div className="mb-4 text-3xl">⚡</div>
              <h3 className="text-lg font-bold text-[#1a1a2e]">Instant Price Responses</h3>
              <p className="mt-2 text-gray-600">AI provides exact quotes from your rate cards. No back-and-forth needed.</p>
            </div>
            <div className="rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md">
              <div className="mb-4 text-3xl">👥</div>
              <h3 className="text-lg font-bold text-[#1a1a2e]">Lead Capture</h3>
              <p className="mt-2 text-gray-600">Every enquiry is captured — even "do you have availability for next week?"</p>
            </div>
            <div className="rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md">
              <div className="mb-4 text-3xl">✅</div>
              <h3 className="text-lg font-bold text-[#1a1a2e]">Booking Confirmation</h3>
              <p className="mt-2 text-gray-600">Confirmation sent automatically. Reduce no-shows with booking details.</p>
            </div>
            <div className="rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md">
              <div className="mb-4 text-3xl">🔄</div>
              <h3 className="text-lg font-bold text-[#1a1a2e]">Follow-up to Unbooked Enquiries</h3>
              <p className="mt-2 text-gray-600">Follow up automatically with people who enquired but didn't book.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Language Section */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 text-3xl font-bold text-[#1a1a2e]">Your customers speak many languages.<br />CypAI speaks them all.</h2>
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            {[
              { flag: '🇬🇧', code: 'EN', name: 'English' },
              { flag: '🇹🇷', code: 'TR', name: 'Türkçe' },
              { flag: '🇸🇦', code: 'AR', name: 'العربية' },
              { flag: '🇷🇺', code: 'RU', name: 'Русский' },
              { flag: '🇬🇷', code: 'GR', name: 'Ελληνικά' },
            ].map((lang) => (
              <div key={lang.code}
                className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2">
                <span className="text-xl">{lang.flag}</span>
                <span className="text-gray-800 font-medium text-sm">{lang.name}</span>
              </div>
            ))}
          </div>
          <p className="mt-6 text-gray-600">Auto-detects language. Responds automatically.</p>
        </div>
      </section>

      {/* Objection Handling */}
      <section className="bg-[#f8f9fb] py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-center text-3xl font-bold text-[#1a1a2e]">Common questions</h2>
          <div className="space-y-6">
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-[#1a1a2e]">"I don't trust AI to represent my business"</h3>
              <p className="mt-2 text-gray-600">You train CypAI with your exact prices and policies. It says exactly what you tell it to say. You're always in control.</p>
            </div>
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-[#1a1a2e]">"Setup sounds complicated"</h3>
              <p className="mt-2 text-gray-600">15 minutes. We walk you through it. One line of code for your website, or just connect your WhatsApp. That's it.</p>
            </div>
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-[#1a1a2e]">"$79/month is expensive"</h3>
              <p className="mt-2 text-gray-600">One missed booking in peak season = €80–150 lost. CypAI pays for itself in 1 recovered booking per month.</p>
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
              <p className="text-xs font-bold tracking-widest uppercase text-gray-500">Starter</p>
              <div className="mt-2 text-5xl font-black text-gray-900">
                $29<span className="ml-1 text-lg text-gray-400">/mo</span>
              </div>
              <p className="mt-3 text-sm text-gray-500">Perfect for small local businesses</p>
              <ul className="mt-6 space-y-3">
                <li className="flex items-start gap-2 text-gray-600 text-sm"><span className="text-amber-500 font-bold">✓</span> 500 messages/month</li>
                <li className="flex items-start gap-2 text-gray-600 text-sm"><span className="text-amber-500 font-bold">✓</span> Website chat widget</li>
                <li className="flex items-start gap-2 text-gray-600 text-sm"><span className="text-amber-500 font-bold">✓</span> Lead capture</li>
                <li className="flex items-start gap-2 text-gray-600 text-sm"><span className="text-amber-500 font-bold">✓</span> Basic CRM</li>
                <li className="flex items-start gap-2 text-gray-600 text-sm"><span className="text-amber-500 font-bold">✓</span> 5 language support</li>
              </ul>
              <Link
                href="/sign-up"
                className="mt-8 block rounded-xl border border-gray-300 px-6 py-3 text-center font-semibold text-[#1a1a2e] transition-colors hover:bg-gray-50"
              >
                Start Free Trial
              </Link>
            </div>
            {/* Pro */}
            <div className="relative rounded-2xl border-2 border-amber-500 bg-white p-8 shadow-xl">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#e8a020] px-4 py-1.5 text-xs font-bold text-[#1a1a2e]">
                ⭐ Most Popular
              </span>
              <p className="text-xs font-bold tracking-widest uppercase text-gray-500">Pro</p>
              <div className="mt-2 text-5xl font-black text-gray-900">
                $79<span className="ml-1 text-lg text-gray-400">/mo</span>
              </div>
              <p className="mt-3 text-sm text-gray-500">For growing businesses</p>
              <ul className="mt-6 space-y-3">
                <li className="flex items-start gap-2 text-gray-600 text-sm"><span className="text-amber-500 font-bold">✓</span> Unlimited messages</li>
                <li className="flex items-start gap-2 text-gray-600 text-sm"><span className="text-amber-500 font-bold">✓</span> WhatsApp integration</li>
                <li className="flex items-start gap-2 text-gray-600 text-sm"><span className="text-amber-500 font-bold">✓</span> Full CRM</li>
                <li className="flex items-start gap-2 text-gray-600 text-sm"><span className="text-amber-500 font-bold">✓</span> Booking system</li>
                <li className="flex items-start gap-2 text-gray-600 text-sm"><span className="text-amber-500 font-bold">✓</span> Follow-up tools</li>
                <li className="flex items-start gap-2 text-gray-600 text-sm"><span className="text-amber-500 font-bold">✓</span> Multi-language support</li>
              </ul>
              <Link
                href="/sign-up"
                className="mt-8 block rounded-xl bg-[#e8a020] px-6 py-3 text-center font-semibold text-[#1a1a2e] transition-colors hover:bg-[#d4920a]"
              >
                Start Free Trial
              </Link>
            </div>
            {/* Business */}
            <div className="rounded-2xl border border-gray-200 bg-white p-8">
              <p className="text-xs font-bold tracking-widest uppercase text-gray-500">Business</p>
              <div className="mt-2 text-5xl font-black text-gray-900">
                $149<span className="ml-1 text-lg text-gray-400">/mo</span>
              </div>
              <p className="mt-3 text-sm text-gray-500">For multi-location businesses</p>
              <ul className="mt-6 space-y-3">
                <li className="flex items-start gap-2 text-gray-600 text-sm"><span className="text-amber-500 font-bold">✓</span> Everything in Pro</li>
                <li className="flex items-start gap-2 text-gray-600 text-sm"><span className="text-amber-500 font-bold">✓</span> Multi-location support</li>
                <li className="flex items-start gap-2 text-gray-600 text-sm"><span className="text-amber-500 font-bold">✓</span> Agency workspace</li>
                <li className="flex items-start gap-2 text-gray-600 text-sm"><span className="text-amber-500 font-bold">✓</span> SLA guarantee</li>
                <li className="flex items-start gap-2 text-gray-600 text-sm"><span className="text-amber-500 font-bold">✓</span> Priority support</li>
              </ul>
              <Link
                href="/sign-up"
                className="mt-8 block rounded-xl border border-gray-300 px-6 py-3 text-center font-semibold text-[#1a1a2e] transition-colors hover:bg-gray-50"
              >
                Start Free Trial
              </Link>
            </div>
          </div>
          <p className="mt-8 text-center text-gray-400 text-sm">
            🔒 Secure payment by Paddle · 30-day money-back guarantee
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-[#1a1a2e] py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white">Set up before peak season.<br />Takes 15 minutes.</h2>
          <Link
            href="/sign-up"
            className="mt-8 inline-block rounded-xl bg-[#e8a020] px-8 py-4 text-lg font-bold text-[#1a1a2e] transition-all duration-200 hover:bg-[#d4920a] hover:shadow-lg hover:shadow-[#e8a020]/20"
          >
            Start Your Free Trial Now →
          </Link>
          <p className="mt-4 text-sm text-gray-400">No credit card. Cancel anytime.</p>
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
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
              <Link href="/" className="hover:text-[#1a1a2e]">Home</Link>
              <Link href="#pricing" className="hover:text-[#1a1a2e]">Pricing</Link>
              <Link href="/demo" className="hover:text-[#1a1a2e]">Demo</Link>
              <Link href="/contact" className="hover:text-[#1a1a2e]">Contact</Link>
              <Link href="/privacy" className="hover:text-[#1a1a2e]">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-[#1a1a2e]">Terms</Link>
              <Link href="/refund-policy" className="hover:text-[#1a1a2e]">Refund Policy</Link>
            </div>
            <p className="text-sm text-gray-500">© 2025 CypAI. Built in Northern Cyprus.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}

