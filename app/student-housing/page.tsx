'use client'

import Link from 'next/link'
import Image from 'next/image'

export const metadata = {
  title: 'Student Housing | CypAI',
}

export default function StudentHousingPage() {
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
          <span className="mb-4 inline-block rounded-full bg-[#e8a020]/20 px-4 py-2 text-sm font-semibold text-[#e8a020]">
            🎓 For Student Housing in Northern Cyprus
          </span>
          <h1 className="mb-6 text-4xl font-black leading-tight text-white md:text-5xl lg:text-6xl">
            International students message at 2am.<br />CypAI answers. You sleep.
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-white/70">
            Fill your rooms faster every semester. CypAI answers student enquiries in any language, books viewings automatically, and follows up with leads who didn't reply.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/signup?plan=pro"
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
              <span className="text-2xl">🌍</span>
              <div>
                <p className="font-semibold text-[#1a1a2e]">Students from <strong>Nigeria, Pakistan, Iran</strong> message in different languages</p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-xl bg-white p-5 shadow-sm">
              <span className="text-2xl">🕐</span>
              <div>
                <p className="font-semibold text-[#1a1a2e]">Students enquire from their <strong>home countries at odd hours</strong></p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-xl bg-white p-5 shadow-sm">
              <span className="text-2xl">🔁</span>
              <div>
                <p className="font-semibold text-[#1a1a2e]">You answer <strong>"how much is rent?"</strong> and <strong>"is it near EMU?"</strong> all day</p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-xl bg-white p-5 shadow-sm">
              <span className="text-2xl">📵</span>
              <div>
                <p className="font-semibold text-[#1a1a2e]">You <strong>miss enquiries during intake season</strong> and lose tenants to faster landlords</p>
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
              <h3 className="text-xl font-bold text-[#1a1a2e]">Tell CypAI about your property</h3>
              <p className="mt-2 text-gray-600">Add rent prices, utilities, rooms, location, distance to EMU, NEU, GAU, CIU. Takes 10 minutes.</p>
            </div>
            <div className="text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#e8a020]/20 text-3xl mx-auto">2</div>
              <h3 className="text-xl font-bold text-[#1a1a2e]">Connect WhatsApp and your website</h3>
              <p className="mt-2 text-gray-600">One line of code for the website widget. 2 minutes to connect your WhatsApp Business number.</p>
            </div>
            <div className="text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#e8a020]/20 text-3xl mx-auto">3</div>
              <h3 className="text-xl font-bold text-[#1a1a2e]">Watch enquiries become bookings</h3>
              <p className="mt-2 text-gray-600">AI answers FAQs, books viewings, follows up automatically. You focus on your life.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-[#f8f9fb] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-4 text-center text-3xl font-bold text-[#1a1a2e]">Everything student housing landlords need</h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-gray-600">Built specifically for landlords in Northern Cyprus</p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md">
              <div className="mb-4 text-3xl">🌍</div>
              <h3 className="text-lg font-bold text-[#1a1a2e]">Multi-Language Student Enquiries</h3>
              <p className="mt-2 text-gray-600">English, Turkish, Arabic, French, Hausa, Farsi — CypAI detects language and responds automatically.</p>
            </div>
            <div className="rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md">
              <div className="mb-4 text-3xl">📅</div>
              <h3 className="text-lg font-bold text-[#1a1a2e]">Viewing Booking Automation</h3>
              <p className="mt-2 text-gray-600">Students book property viewings through WhatsApp. You get the booking — no back-and-forth.</p>
            </div>
            <div className="rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md">
              <div className="mb-4 text-3xl">💰</div>
              <h3 className="text-lg font-bold text-[#1a1a2e]">Rent FAQ</h3>
              <p className="mt-2 text-gray-600">Rent prices, utilities included, deposit, room photos — answered instantly.</p>
            </div>
            <div className="rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md">
              <div className="mb-4 text-3xl">📍</div>
              <h3 className="text-lg font-bold text-[#1a1a2e]">Location/Neighborhood Info</h3>
              <p className="mt-2 text-gray-600">Distance to EMU, NEU, GAU, CIU, nearby shops, transport — answered automatically.</p>
            </div>
            <div className="rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md">
              <div className="mb-4 text-3xl">🔄</div>
              <h3 className="text-lg font-bold text-[#1a1a2e]">Follow-up with Unresponsive Leads</h3>
              <p className="mt-2 text-gray-600">Students not ready yet? CypAI follows up automatically before semester starts.</p>
            </div>
            <div className="rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md">
              <div className="mb-4 text-3xl">📚</div>
              <h3 className="text-lg font-bold text-[#1a1a2e]">Intake Season Readiness</h3>
              <p className="mt-2 text-gray-600">September and February — CypAI handles the message avalanche while you sleep.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Language Section */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 text-3xl font-bold text-[#1a1a2e]">Your tenants speak many languages.<br />CypAI speaks them all.</h2>
          <div className="mb-6 flex flex-wrap items-center justify-center gap-6 text-3xl">
            <span>🇬🇧</span>
            <span>🇹🇷</span>
            <span>🇸🇦</span>
            <span>🇳🇬</span>
            <span>🇮🇷</span>
          </div>
          <p className="text-gray-600">Auto-detects language. Responds automatically.</p>
        </div>
      </section>

      {/* Universities Section */}
      <section className="bg-[#f8f9fb] py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 text-3xl font-bold text-[#1a1a2e]">Serving students from all major universities</h2>
          <div className="flex flex-wrap items-center justify-center gap-8 text-lg font-semibold text-gray-700">
            <span>🏛️ EMU</span>
            <span>🏛️ NEU</span>
            <span>🏛️ GAU</span>
            <span>🏛️ CIU</span>
          </div>
          <p className="mt-4 text-gray-600">Students from Eastern Mediterranean University, Near East University, Girne American University & Cyprus International University — all looking for housing.</p>
        </div>
      </section>

      {/* Objection Handling */}
      <section className="bg-[#f8f9fb] py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-center text-3xl font-bold text-[#1a1a2e]">Common questions</h2>
          <div className="space-y-6">
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-[#1a1a2e]">"My tenants find me through Facebook anyway"</h3>
              <p className="mt-2 text-gray-600">They see your Facebook post, then WhatsApp you with questions. CypAI handles that conversation — your Facebook posts just become the first touchpoint.</p>
            </div>
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-[#1a1a2e]">"Students ask complicated questions"</h3>
              <p className="mt-2 text-gray-600">CypAI handles FAQs: price, utilities, distance to EMU/NEU/GAU/CIU, photos, deposit. Complex questions — "Can I bring my pet?", "Is there parking?" — route to you automatically.</p>
            </div>
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-[#1a1a2e]">"I manage fine myself"</h3>
              <p className="mt-2 text-gray-600">Until September hits. 200 messages in a week. You can't respond to all. Students go to faster landlords. CypAI handles the volume — you don't burn out.</p>
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
              <p className="mt-3 text-sm text-gray-500">Perfect for small landlords</p>
              <ul className="mt-6 space-y-3 text-sm">
                <li>✓ 500 messages/month</li>
                <li>✓ Website chat widget</li>
                <li>✓ FAQ automation</li>
                <li>✓ Multi-language support</li>
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
              <p className="mt-3 text-sm text-gray-500">For growing portfolios</p>
              <ul className="mt-6 space-y-3 text-sm">
                <li>✓ Unlimited messages</li>
                <li>✓ WhatsApp integration</li>
                <li>✓ Booking system</li>
                <li>✓ Lead follow-up automation</li>
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
              <p className="mt-3 text-sm text-gray-500">For property managers</p>
              <ul className="mt-6 space-y-3 text-sm">
                <li>✓ Everything in Pro</li>
                <li>✓ Multi-property support</li>
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
            🔒 Secure payment by Paddle · 30-day money-back guarantee
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-[#1a1a2e] py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white">Semester intake is coming.<br />Be ready.</h2>
          <p className="mt-4 text-lg text-gray-300">September and February bring hundreds of enquiries. Don't miss a single tenant.</p>
          <Link
            href="/signup?plan=pro"
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
