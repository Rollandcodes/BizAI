import Link from 'next/link';

const SECTIONS = [
  { id: 'service-description', title: '1. Service Description' },
  { id: 'acceptable-use', title: '2. Acceptable Use' },
  { id: 'payment-terms', title: '3. Payment Terms' },
  { id: 'availability', title: '4. Service Availability' },
  { id: 'liability', title: '5. Limitation of Liability' },
  { id: 'contact', title: '6. Contact' },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Nav */}
      <nav className="border-b border-zinc-800 bg-zinc-950/90 px-4 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link href="/" className="text-xl font-extrabold text-white">?? CypAI</Link>
          <Link
            href="/"
            className="flex items-center gap-1.5 rounded-xl border border-zinc-700 px-4 py-2 text-sm font-semibold text-zinc-300 transition hover:bg-zinc-900"
          >
            ? Back to Home
          </Link>
        </div>
      </nav>

      <div className="mx-auto max-w-5xl px-4 py-14">
        <div className="mb-10">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-zinc-500">Legal</p>
          <h1 className="text-4xl font-extrabold text-white">Terms of Service</h1>
          <p className="mt-2 text-sm text-zinc-500">Last updated: March 2026</p>
        </div>

        <div className="grid gap-12 lg:grid-cols-[220px_1fr]">
          {/* Sticky TOC sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-zinc-500">Contents</p>
              <nav className="space-y-1">
                {SECTIONS.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="block rounded-lg px-3 py-2 text-sm text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-100"
                  >
                    {s.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Content */}
          <div className="space-y-12 text-zinc-300">
            <p className="rounded-2xl border border-blue-500/20 bg-blue-600/10 px-5 py-4 text-sm leading-relaxed text-blue-200">
              By signing up for or using CypAI, you agree to these terms. Please read them carefully.
              If you have any questions, contact us before subscribing.
            </p>

            <section id="service-description" className="scroll-mt-8">
              <h2 className="mb-4 text-xl font-bold text-white">1. Service Description</h2>
              <p className="text-sm leading-relaxed">
                CypAI provides AI-powered customer service tools for local businesses. This includes a
                customisable chat widget you can embed on your website, a lead capture dashboard, conversation
                analytics, and optional integrations (e.g. WhatsApp). The AI is powered by OpenAI language
                models and configured to represent your specific business.
              </p>
            </section>

            <section id="acceptable-use" className="scroll-mt-8">
              <h2 className="mb-4 text-xl font-bold text-white">2. Acceptable Use</h2>
              <ul className="space-y-3 text-sm leading-relaxed">
                <li className="flex gap-2"><span className="mt-1 text-blue-300">?</span><span>You may only use CypAI for <strong>legitimate business purposes</strong> — to answer customer questions and capture leads for your real business.</span></li>
                <li className="flex gap-2"><span className="mt-1 text-blue-300">?</span><span>Do not use the service to send spam, misleading information, or harmful content to customers.</span></li>
                <li className="flex gap-2"><span className="mt-1 text-blue-300">?</span><span>Starter and Pro plans are limited to <strong>one business location</strong>. The Business plan supports multiple locations.</span></li>
                <li className="flex gap-2"><span className="mt-1 text-red-500">?</span><span>Do not attempt to reverse-engineer, scrape, or resell the CypAI platform or its outputs.</span></li>
                <li className="flex gap-2"><span className="mt-1 text-red-500">?</span><span>Do not impersonate another business or use the service to collect customer data without their knowledge.</span></li>
              </ul>
            </section>

            <section id="payment-terms" className="scroll-mt-8">
              <h2 className="mb-4 text-xl font-bold text-white">3. Payment Terms</h2>
              <ul className="space-y-3 text-sm leading-relaxed">
                <li className="flex gap-2"><span className="mt-1 text-blue-300">?</span><span>Subscriptions are billed <strong>monthly</strong> via Paddle. Yearly billing is available at a 17% discount.</span></li>
                <li className="flex gap-2"><span className="mt-1 text-blue-300">?</span><span>All plans include a <strong>7-day free trial</strong>. Cancel before the trial ends and you will not be charged.</span></li>
                <li className="flex gap-2"><span className="mt-1 text-blue-300">?</span><span>After the trial, subscriptions renew automatically each month. You can cancel at any time from your dashboard.</span></li>
                <li className="flex gap-2"><span className="mt-1 text-blue-300">?</span><span>No refunds are issued after the trial period unless there has been a confirmed technical failure on our side (see Section 5).</span></li>
                <li className="flex gap-2"><span className="mt-1 text-blue-300">?</span><span>Prices are listed in USD. Paddle handles currency conversion.</span></li>
              </ul>
            </section>

            <section id="availability" className="scroll-mt-8">
              <h2 className="mb-4 text-xl font-bold text-white">4. Service Availability</h2>
              <ul className="space-y-3 text-sm leading-relaxed">
                <li className="flex gap-2"><span className="mt-1 text-blue-300">?</span><span>We aim for <strong>99.9% uptime</strong> for the CypAI platform and widget.</span></li>
                <li className="flex gap-2"><span className="mt-1 text-blue-300">?</span><span>Scheduled maintenance will be communicated in advance where possible.</span></li>
                <li className="flex gap-2"><span className="mt-1 text-blue-300">?</span><span>AI response quality is subject to the availability and performance of <strong>OpenAI&apos;s API</strong>. We are not responsible for degraded AI quality during OpenAI outages.</span></li>
                <li className="flex gap-2"><span className="mt-1 text-blue-300">?</span><span>We reserve the right to suspend accounts that violate these terms without prior notice.</span></li>
              </ul>
            </section>

            <section id="liability" className="scroll-mt-8">
              <h2 className="mb-4 text-xl font-bold text-white">5. Limitation of Liability</h2>
              <p className="mb-4 text-sm leading-relaxed">
                CypAI is provided as-is, without warranty of any kind. To the maximum extent permitted by law:
              </p>
              <ul className="space-y-3 text-sm leading-relaxed">
                <li className="flex gap-2"><span className="mt-1 text-amber-500">?</span><span>CypAI is <strong>not liable for business losses</strong> caused by AI responses, including incorrect information given to customers.</span></li>
                <li className="flex gap-2"><span className="mt-1 text-amber-500">?</span><span>Always <strong>review AI-captured leads</strong> before contacting them or taking business decisions based on them.</span></li>
                <li className="flex gap-2"><span className="mt-1 text-amber-500">?</span><span>Our total liability to you in any month is limited to the subscription fee paid in that month.</span></li>
                <li className="flex gap-2"><span className="mt-1 text-blue-300">?</span><span>If a confirmed technical failure on our part results in extended downtime (&gt;48 hours), we will issue a proportional credit or refund upon request.</span></li>
              </ul>
            </section>

            <section id="contact" className="scroll-mt-8">
              <h2 className="mb-4 text-xl font-bold text-white">6. Contact</h2>
              <p className="text-sm leading-relaxed">
                For questions about these terms, contact us at:
              </p>
              <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-sm">
                <p>?? <a href="mailto:cypai.app@cypai.app" className="font-semibold text-blue-400 hover:underline">cypai.app@cypai.app</a></p>
                <p className="mt-1.5">?? Nicosia, Northern Cyprus</p>
              </div>
              <p className="mt-4 text-xs text-zinc-500">
                These terms may be updated periodically. Continued use of the service after changes constitutes acceptance.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}


