import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | CypAI',
  description: 'CypAI Privacy Policy - How we collect, store, and protect your data.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      {/* Header */}
      <header className="border-b border-[#e5e7eb] bg-white">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-xl font-extrabold text-[#1a1a2e]">
            🤖 CypAI
          </Link>
          <Link
            href="/"
            className="flex items-center gap-1.5 rounded-xl border border-[#e5e7eb] px-4 py-2 text-sm font-semibold text-[#6b7280] transition hover:bg-[#f8f9fb]"
          >
            ← Back to Home
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-white p-6 sm:p-10">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#1a1a2e] sm:text-4xl">
              Privacy Policy
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              How we handle your data.
            </p>
            <p className="mt-2 text-sm text-gray-500">Last updated: March 2026</p>
          </div>

          {/* Body Content */}
          <div className="space-y-6 text-base leading-relaxed text-[#374151]">
            {/* Section 1: Who We Are */}
            <section>
              <h2 className="mt-8 mb-4 text-xl font-bold text-[#1a1a2e]">
                1. Who We Are
              </h2>
              <p>
                CypAI is an AI-powered customer service platform designed for businesses in Cyprus and the MENA region. We help businesses capture leads, respond to customers instantly, and automate bookings—all through intelligent AI chat.
              </p>
              <p className="mt-4">
                <strong>Contact:</strong>{' '}
                <a
                  href="mailto:cypai.app@cypai.app"
                  className="text-[#e8a020] hover:underline"
                >
                  cypai.app@cypai.app
                </a>
              </p>
              <p className="mt-2">
                CypAI is a registered business operating in Northern Cyprus, providing AI solutions to businesses across the island and beyond.
              </p>
            </section>

            {/* Section 2: What Data We Collect */}
            <section>
              <h2 className="mt-8 mb-4 text-xl font-bold text-[#1a1a2e]">
                2. What Data We Collect
              </h2>
              <p>We collect only the data necessary to provide and improve our service:</p>
              <ul className="mt-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Email address</strong> — for account creation and communication
                </li>
                <li>
                  <strong>Business name and details</strong> — to personalize AI responses for your business
                </li>
                <li>
                  <strong>Conversation logs</strong> — to train and improve AI responses for your customers
                </li>
                <li>
                  <strong>Payment information</strong> — processed securely via Paddle; we never see or store your card details
                </li>
                <li>
                  <strong>Website and WhatsApp usage data</strong> — to understand how customers interact with your AI assistant
                </li>
              </ul>
            </section>

            {/* Section 3: Why We Collect It */}
            <section>
              <h2 className="mt-8 mb-4 text-xl font-bold text-[#1a1a2e]">
                3. Why We Collect It
              </h2>
              <p>We use your data for the following purposes:</p>
              <ul className="mt-4 list-inside list-disc space-y-2">
                <li>To provide the CypAI AI assistant service</li>
                <li>To personalize responses for your specific business</li>
                <li>To process payments and manage subscriptions</li>
                <li>To improve our AI through conversation analysis</li>
                <li>To communicate important account information</li>
              </ul>
            </section>

            {/* Section 4: How We Store It */}
            <section>
              <h2 className="mt-8 mb-4 text-xl font-bold text-[#1a1a2e]">
                4. How We Store It
              </h2>
              <p>Your data is stored securely using industry-standard measures:</p>
              <ul className="mt-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Secure cloud servers</strong> — hosted on Supabase/PostgreSQL infrastructure
                </li>
                <li>
                  <strong>Encryption</strong> — data is encrypted at rest and in transit
                </li>
                <li>
                  <strong>Access controls</strong> — only authorized personnel can access your data
                </li>
                <li>
                  <strong>Regular audits</strong> — we conduct periodic security audits to ensure compliance
                </li>
              </ul>
            </section>

            {/* Section 5: Third Parties */}
            <section>
              <h2 className="mt-8 mb-4 text-xl font-bold text-[#1a1a2e]">
                5. Third Parties
              </h2>
              <p>We work with trusted third-party providers to deliver our service:</p>
              <ul className="mt-4 list-inside list-disc space-y-2">
                <li>
                  <a
                    href="https://paddle.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#e8a020] underline"
                  >
                    Paddle
                  </a>{' '}
                  — Payment processing (Merchant of Record)
                </li>
                <li>
                  <a
                    href="https://openai.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#e8a020] underline"
                  >
                    OpenAI
                  </a>{' '}
                  — AI model provider (conversation data is processed solely for generating responses)
                </li>
                <li>
                  <a
                    href="https://www.whatsapp.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#e8a020] underline"
                  >
                    WhatsApp API
                  </a>{' '}
                  — Message delivery and communication
                </li>
                <li>
                  <a
                    href="https://vercel.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#e8a020] underline"
                  >
                    Vercel
                  </a>{' '}
                  — Hosting and infrastructure
                </li>
                <li>
                  <a
                    href="https://supabase.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#e8a020] underline"
                  >
                    Supabase
                  </a>{' '}
                  — Database and authentication
                </li>
              </ul>
              <p className="mt-4">
                These providers are contractually obligated to handle your data in accordance with this privacy policy and applicable data protection laws.
              </p>
            </section>

            {/* Section 6: Your Rights */}
            <section>
              <h2 className="mt-8 mb-4 text-xl font-bold text-[#1a1a2e]">
                6. Your Rights
              </h2>
              <p>You have full control over your data:</p>
              <ul className="mt-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Access</strong> — view all your data anytime from your dashboard
                </li>
                <li>
                  <strong>Correction</strong> — request data corrections by emailing{' '}
                  <a
                    href="mailto:cypai.app@cypai.app"
                    className="text-[#e8a020] hover:underline"
                  >
                    cypai.app@cypai.app
                  </a>
                </li>
                <li>
                  <strong>Deletion</strong> — request complete data deletion (account deletion)
                </li>
                <li>
                  <strong>Export</strong> — download your conversation history at any time
                </li>
              </ul>
              <p className="mt-4">
                We respond to all data requests within <strong>24 hours on business days</strong>.
              </p>
            </section>

            {/* Section 7: Cookies */}
            <section>
              <h2 className="mt-8 mb-4 text-xl font-bold text-[#1a1a2e]">
                7. Cookies
              </h2>
              <p>We use only essential cookies:</p>
              <ul className="mt-4 list-inside list-disc space-y-2">
                <li>
                  <strong>Authentication cookies</strong> — required for secure login
                </li>
                <li>
                  <strong>Analytics cookies</strong> — to understand site usage and improve performance
                </li>
              </ul>
              <p className="mt-4">
                We do <strong>not</strong> use advertising cookies or tracking cookies, and we do not share data with third-party ad networks.
              </p>
            </section>

            {/* Section 8: GDPR Compliance */}
            <section>
              <h2 className="mt-8 mb-4 text-xl font-bold text-[#1a1a2e]">
                8. GDPR Compliance
              </h2>
              <p>
                CypAI complies with the General Data Protection Regulation (GDPR) as Cyprus is part of the European Union. Your rights under GDPR include:
              </p>
              <ul className="mt-4 list-inside list-disc space-y-2">
                <li>Right to access your personal data</li>
                <li>Right to rectification of inaccurate data</li>
                <li>Right to erasure ("right to be forgotten")</li>
                <li>Right to data portability</li>
                <li>Right to object to processing</li>
              </ul>
              <p className="mt-4">
                We act as <strong>Data Controller</strong> for your account data, and as <strong>Data Processor</strong> for your customer conversation data. A Data Processing Agreement (DPA) is available upon request for business customers who require formal documentation.
              </p>
            </section>

            {/* Section 9: Data Retention */}
            <section>
              <h2 className="mt-8 mb-4 text-xl font-bold text-[#1a1a2e]">
                9. Data Retention
              </h2>
              <ul className="list-inside list-disc space-y-2">
                <li>
                  <strong>Active subscription:</strong> Data is retained for as long as you use our service
                </li>
                <li>
                  <strong>After cancellation:</strong> Data is retained for 90 days, then permanently deleted
                </li>
                <li>
                  <strong>Backups:</strong> All backups are purged within 30 days of account deletion
                </li>
                <li>
                  <strong>Immediate deletion:</strong> You can request immediate deletion at any time
                </li>
              </ul>
            </section>

            {/* Section 10: Contact */}
            <section>
              <h2 className="mt-8 mb-4 text-xl font-bold text-[#1a1a2e]">
                10. Contact
              </h2>
              <p>For any questions or requests regarding your data:</p>
              <p className="mt-4">
                <strong>Email:</strong>{' '}
                <a
                  href="mailto:cypai.app@cypai.app"
                  className="text-[#e8a020] hover:underline"
                >
                  cypai.app@cypai.app
                </a>
              </p>
              <p className="mt-2">
                <strong>Response time:</strong> Within 24 hours on business days
              </p>
              <p className="mt-4">
                For <strong>data deletion requests</strong>, please include "Data Deletion Request" in the email subject line to ensure fast processing.
              </p>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#e5e7eb] bg-white py-8">
        <div className="mx-auto max-w-2xl px-4 text-center text-sm text-[#6b7280] sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} CypAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
