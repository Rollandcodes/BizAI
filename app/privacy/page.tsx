import Link from 'next/link';

const SECTIONS = [
  { id: 'what-we-collect', title: '1. What We Collect' },
  { id: 'how-we-use', title: '2. How We Use It' },
  { id: 'data-security', title: '3. Data Security' },
  { id: 'customer-data', title: '4. Customer Data' },
  { id: 'contact', title: '5. Contact' },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-slate-200 bg-white px-4 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link href="/" className="text-xl font-extrabold text-slate-900">🤖 CypAI</Link>
          <Link
            href="/"
            className="flex items-center gap-1.5 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            ← Back to Home
          </Link>
        </div>
      </nav>

      <div className="mx-auto max-w-5xl px-4 py-14">
        <div className="mb-10">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-blue-600">Legal</p>
          <h1 className="text-4xl font-extrabold text-slate-900">Privacy Policy</h1>
          <p className="mt-2 text-sm text-slate-400">Last updated: March 2026</p>
        </div>

        <div className="grid gap-12 lg:grid-cols-[220px_1fr]">
          {/* Sticky TOC sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-8 rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-slate-400">Contents</p>
              <nav className="space-y-1">
                {SECTIONS.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="block rounded-lg px-3 py-2 text-sm text-slate-600 transition hover:bg-white hover:text-slate-900"
                  >
                    {s.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Content */}
          <div className="prose prose-slate max-w-none space-y-12 text-slate-700">
            <p className="rounded-2xl bg-blue-50 px-5 py-4 text-sm leading-relaxed text-blue-800">
              CypAI is committed to protecting your privacy. This policy explains what data we collect,
              how we use it, and your rights. We keep it short and honest.
            </p>

            <section id="what-we-collect" className="scroll-mt-8">
              <h2 className="mb-4 text-xl font-bold text-slate-900">1. What Information We Collect</h2>
              <ul className="space-y-3 text-sm leading-relaxed">
                <li className="flex gap-2"><span className="mt-1 text-blue-500">▸</span><span><strong>Account information</strong> — your business name and email address when you sign up.</span></li>
                <li className="flex gap-2"><span className="mt-1 text-blue-500">▸</span><span><strong>Business configuration</strong> — the custom instructions, FAQs, and settings you add to train your AI.</span></li>
                <li className="flex gap-2"><span className="mt-1 text-blue-500">▸</span><span><strong>Customer conversation data</strong> — messages exchanged through your AI widget, including any lead information customers voluntarily provide.</span></li>
                <li className="flex gap-2"><span className="mt-1 text-blue-500">▸</span><span><strong>Payment information</strong> — subscription payments are processed entirely by PayPal. We never store or see your card details.</span></li>
                <li className="flex gap-2"><span className="mt-1 text-blue-500">▸</span><span><strong>Usage data</strong> — basic analytics such as conversation counts and feature usage, to help us improve the service.</span></li>
              </ul>
            </section>

            <section id="how-we-use" className="scroll-mt-8">
              <h2 className="mb-4 text-xl font-bold text-slate-900">2. How We Use Your Information</h2>
              <ul className="space-y-3 text-sm leading-relaxed">
                <li className="flex gap-2"><span className="mt-1 text-blue-500">▸</span><span>To provide, maintain, and improve the CypAI service.</span></li>
                <li className="flex gap-2"><span className="mt-1 text-blue-500">▸</span><span>To send important account updates (new features, billing notices, policy changes).</span></li>
                <li className="flex gap-2"><span className="mt-1 text-blue-500">▸</span><span>To power the AI responses for your customers using OpenAI models.</span></li>
                <li className="flex gap-2"><span className="mt-1 text-green-600">✓</span><span><strong>We never sell your data to third parties.</strong> Your business and customer data is not used for advertising.</span></li>
              </ul>
            </section>

            <section id="data-security" className="scroll-mt-8">
              <h2 className="mb-4 text-xl font-bold text-slate-900">3. Data Security</h2>
              <ul className="space-y-3 text-sm leading-relaxed">
                <li className="flex gap-2"><span className="mt-1 text-blue-500">▸</span><span>All data is <strong>encrypted in transit</strong> (HTTPS/TLS) and <strong>at rest</strong>.</span></li>
                <li className="flex gap-2"><span className="mt-1 text-blue-500">▸</span><span>Hosted on <strong>Supabase</strong> — a secure, enterprise-grade PostgreSQL infrastructure with row-level security.</span></li>
                <li className="flex gap-2"><span className="mt-1 text-blue-500">▸</span><span>API keys and secrets are never exposed to the browser.</span></li>
                <li className="flex gap-2"><span className="mt-1 text-blue-500">▸</span><span>You can request complete data deletion at any time by emailing us.</span></li>
              </ul>
            </section>

            <section id="customer-data" className="scroll-mt-8">
              <h2 className="mb-4 text-xl font-bold text-slate-900">4. Customer Data</h2>
              <ul className="space-y-3 text-sm leading-relaxed">
                <li className="flex gap-2"><span className="mt-1 text-blue-500">▸</span><span>Customer conversations belong to <strong>you</strong>, the business owner.</span></li>
                <li className="flex gap-2"><span className="mt-1 text-blue-500">▸</span><span>You can export or delete all conversation data at any time from your dashboard.</span></li>
                <li className="flex gap-2"><span className="mt-1 text-blue-500">▸</span><span>We process conversation data only to power your AI assistant — not for any other purpose.</span></li>
                <li className="flex gap-2"><span className="mt-1 text-blue-500">▸</span><span>We recommend informing your website visitors that an AI assistant is active (e.g., in your website&apos;s own privacy notice).</span></li>
              </ul>
            </section>

            <section id="contact" className="scroll-mt-8">
              <h2 className="mb-4 text-xl font-bold text-slate-900">5. Contact</h2>
              <p className="text-sm leading-relaxed">
                For any privacy-related questions, data deletion requests, or concerns, contact us at:
              </p>
              <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm">
                <p>📧 <a href="mailto:bizaicyprus123@gmail.com" className="font-semibold text-blue-600 hover:underline">bizaicyprus123@gmail.com</a></p>
                <p className="mt-1.5">📍 Nicosia, Northern Cyprus</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
