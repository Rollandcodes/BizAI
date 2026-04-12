import Link from 'next/link';
import { 
  ArrowLeft, 
  Cpu, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Clock, 
  ShieldCheck, 
  Mail, 
  MapPin,
  AlertTriangle
} from 'lucide-react';

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
      <nav className="border-b border-zinc-800 bg-zinc-950/90 px-4 py-4 backdrop-blur sticky top-0 z-50">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xl font-extrabold text-white group">
            <Cpu className="h-6 w-6 text-blue-500 transition-transform group-hover:rotate-90 duration-500" />
            <span>CypAI</span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900/50 px-4 py-2 text-sm font-semibold text-zinc-300 transition hover:bg-zinc-800 hover:border-zinc-500"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </nav>

      <div className="mx-auto max-w-5xl px-4 py-14">
        <div className="mb-10">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-blue-500">Legal Architecture</p>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">Terms of Service</h1>
          <p className="mt-2 text-sm text-zinc-500 italic">Last updated: March 2026</p>
        </div>

        <div className="grid gap-12 lg:grid-cols-[220px_1fr]">
          {/* Sticky TOC sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 backdrop-blur-sm">
              <p className="mb-4 text-[11px] font-bold uppercase tracking-widest text-zinc-500 border-b border-zinc-800 pb-2">Contents</p>
              <nav className="space-y-1">
                {SECTIONS.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="block rounded-lg px-3 py-2 text-sm text-zinc-400 transition hover:bg-zinc-800 hover:text-blue-400"
                  >
                    {s.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Content */}
          <div className="space-y-16 text-zinc-300">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
              <p className="relative rounded-2xl border border-blue-500/20 bg-zinc-900 px-6 py-5 text-sm leading-relaxed text-zinc-300">
                <span className="font-bold text-blue-400 block mb-1">Agreement Notice</span>
                By signing up for or using CypAI, you agree to these terms. Please read them carefully.
                If you have any questions, contact us before subscribing.
              </p>
            </div>

            <section id="service-description" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <Cpu className="h-5 w-5 text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight">1. Service Description</h2>
              </div>
              <p className="text-base leading-relaxed text-zinc-400">
                CypAI provides AI-powered customer service tools for local businesses. This includes a
                customisable chat widget you can embed on your website, a lead capture dashboard, conversation
                analytics, and optional integrations (e.g. WhatsApp). The AI is powered by OpenAI language
                models and configured to represent your specific business.
              </p>
            </section>

            <section id="acceptable-use" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-zinc-800 border border-zinc-700">
                  <ShieldCheck className="h-5 w-5 text-zinc-400" />
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight">2. Acceptable Use</h2>
              </div>
              <ul className="space-y-4 text-sm leading-relaxed">
                <li className="flex gap-3 items-start">
                  <CheckCircle2 className="mt-1 h-5 w-5 text-blue-500 shrink-0" />
                  <span>You may only use CypAI for <strong>legitimate business purposes</strong> — to answer customer questions and capture leads for your real business.</span>
                </li>
                <li className="flex gap-3 items-start">
                  <CheckCircle2 className="mt-1 h-5 w-5 text-blue-500 shrink-0" />
                  <span>Do not use the service to send spam, misleading information, or harmful content to customers.</span>
                </li>
                <li className="flex gap-3 items-start">
                  <CheckCircle2 className="mt-1 h-5 w-5 text-blue-500 shrink-0" />
                  <span>Starter and Pro plans are limited to <strong>one business location</strong>. The Business plan supports multiple locations.</span>
                </li>
                <li className="flex gap-3 items-start p-3 rounded-lg bg-red-500/5 border border-red-500/10">
                  <XCircle className="mt-1 h-5 w-5 text-red-500 shrink-0" />
                  <span>Do not attempt to reverse-engineer, scrape, or resell the CypAI platform or its outputs.</span>
                </li>
                <li className="flex gap-3 items-start p-3 rounded-lg bg-red-500/5 border border-red-500/10">
                  <XCircle className="mt-1 h-5 w-5 text-red-500 shrink-0" />
                  <span>Do not impersonate another business or use the service to collect customer data without their knowledge.</span>
                </li>
              </ul>
            </section>

            <section id="payment-terms" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-zinc-800 border border-zinc-700">
                  <AlertCircle className="h-5 w-5 text-zinc-400" />
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight">3. Payment Terms</h2>
              </div>
              <ul className="space-y-4 text-sm leading-relaxed">
                <li className="flex gap-3 items-start">
                  <CheckCircle2 className="mt-1 h-5 w-5 text-blue-500 shrink-0" />
                  <span>Subscriptions are billed <strong>monthly</strong> via Paddle. Yearly billing is available at a 17% discount.</span>
                </li>
                <li className="flex gap-3 items-start">
                  <CheckCircle2 className="mt-1 h-5 w-5 text-blue-500 shrink-0" />
                  <span>All plans include a <strong>7-day free trial</strong>. Cancel before the trial ends and you will not be charged.</span>
                </li>
                <li className="flex gap-3 items-start">
                  <CheckCircle2 className="mt-1 h-5 w-5 text-blue-500 shrink-0" />
                  <span>After the trial, subscriptions renew automatically each month. You can cancel at any time from your dashboard.</span>
                </li>
                <li className="flex gap-3 items-start">
                  <CheckCircle2 className="mt-1 h-5 w-5 text-blue-500 shrink-0" />
                  <span>No refunds are issued after the trial period unless there has been a confirmed technical failure on our side.</span>
                </li>
                <li className="flex gap-3 items-start">
                  <CheckCircle2 className="mt-1 h-5 w-5 text-blue-500 shrink-0" />
                  <span>Prices are listed in USD. Paddle handles currency conversion.</span>
                </li>
              </ul>
            </section>

            <section id="availability" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-zinc-800 border border-zinc-700">
                  <Clock className="h-5 w-5 text-zinc-400" />
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight">4. Service Availability</h2>
              </div>
              <ul className="space-y-4 text-sm leading-relaxed">
                <li className="flex gap-3 items-start">
                  <CheckCircle2 className="mt-1 h-5 w-5 text-blue-500 shrink-0" />
                  <span>We aim for <strong>99.9% uptime</strong> for the CypAI platform and widget.</span>
                </li>
                <li className="flex gap-3 items-start">
                  <CheckCircle2 className="mt-1 h-5 w-5 text-blue-500 shrink-0" />
                  <span>Scheduled maintenance will be communicated in advance where possible.</span>
                </li>
                <li className="flex gap-3 items-start">
                  <AlertTriangle className="mt-1 h-5 w-5 text-amber-500 shrink-0" />
                  <span>AI response quality is subject to the availability and performance of <strong>OpenAI&apos;s API</strong>. We are not responsible for degraded AI quality during OpenAI outages.</span>
                </li>
              </ul>
            </section>

            <section id="liability" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight">5. Limitation of Liability</h2>
              </div>
              <div className="space-y-4">
                <p className="text-sm leading-relaxed text-zinc-400">
                  CypAI is provided as-is, without warranty of any kind. To the maximum extent permitted by law:
                </p>
                <ul className="space-y-4 text-sm leading-relaxed">
                  <li className="flex gap-3 items-start p-3 rounded-lg bg-amber-500/5 border border-amber-500/10">
                    <AlertCircle className="mt-1 h-5 w-5 text-amber-500 shrink-0" />
                    <span>CypAI is <strong>not liable for business losses</strong> caused by AI responses, including incorrect information given to customers.</span>
                  </li>
                  <li className="flex gap-3 items-start">
                    <CheckCircle2 className="mt-1 h-5 w-5 text-blue-500 shrink-0" />
                    <span>Always <strong>review AI-captured leads</strong> before contacting them or taking business decisions based on them.</span>
                  </li>
                  <li className="flex gap-3 items-start">
                    <CheckCircle2 className="mt-1 h-5 w-5 text-blue-500 shrink-0" />
                    <span>Our total liability to you in any month is limited to the subscription fee paid in that month.</span>
                  </li>
                </ul>
              </div>
            </section>

            <section id="contact" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <Mail className="h-5 w-5 text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight">6. Contact</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <a 
                  href="mailto:cypai.app@cypai.app"
                  className="group rounded-2xl border border-zinc-800 bg-zinc-900 p-5 transition hover:border-blue-500/50"
                >
                  <Mail className="mb-3 h-5 w-5 text-blue-500" />
                  <p className="text-sm font-semibold text-white">Email Us</p>
                  <p className="text-xs text-zinc-500 group-hover:text-blue-400">cypai.app@cypai.app</p>
                </a>
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
                  <MapPin className="mb-3 h-5 w-5 text-zinc-500" />
                  <p className="text-sm font-semibold text-white">Location</p>
                  <p className="text-xs text-zinc-500">Nicosia, Northern Cyprus</p>
                </div>
              </div>
              <p className="mt-8 text-xs text-zinc-500 text-center italic">
                These terms may be updated periodically. Continued use of the service after changes constitutes acceptance.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
