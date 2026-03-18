import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | CypAI',
  description: 'CypAI Terms of Service - The rules of using CypAI.',
};

export default function TermsOfServicePage() {
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
              Terms of Service
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              The rules of using CypAI.
            </p>
            <p className="mt-2 text-sm text-gray-500">Last updated: March 2026</p>
          </div>

          {/* Body Content */}
          <div className="space-y-6 text-base leading-relaxed text-[#374151]">
            {/* Section 1: Acceptance of Terms */}
            <section>
              <h2 className="mt-8 mb-4 text-xl font-bold text-[#1a1a2e]">
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing or using CypAI, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service. These terms apply to all visitors, users, and others who access or use the service.
              </p>
            </section>

            {/* Section 2: The Service */}
            <section>
              <h2 className="mt-8 mb-4 text-xl font-bold text-[#1a1a2e]">
                2. The Service
              </h2>
              <p>
                CypAI provides an AI-powered customer service platform that enables businesses to:
              </p>
              <ul className="mt-3 list-inside list-disc space-y-2">
                <li>Automate WhatsApp and website chat responses</li>
                <li>Capture and manage leads</li>
                <li>Book appointments automatically</li>
                <li>Respond to customer enquiries in multiple languages</li>
              </ul>
              <p className="mt-4">
                We reserve the right to modify, suspend, or discontinue the service at any time with 30 days notice.
              </p>
            </section>

            {/* Section 3: Your Account */}
            <section>
              <h2 className="mt-8 mb-4 text-xl font-bold text-[#1a1a2e]">
                3. Your Account
              </h2>
              <ul className="list-inside list-disc space-y-2">
                <li>You are responsible for maintaining the security of your account credentials</li>
                <li>You must provide accurate and complete information when creating an account</li>
                <li>You are responsible for all activities that occur under your account</li>
                <li>Notify us immediately of any unauthorized access or security breach</li>
                <li>We reserve the right to suspend accounts with false information</li>
              </ul>
            </section>

            {/* Section 4: Acceptable Use */}
            <section>
              <h2 className="mt-8 mb-4 text-xl font-bold text-[#1a1a2e]">
                4. Acceptable Use
              </h2>
              <p>
                You agree NOT to use CypAI to:
              </p>
              <ul className="mt-3 list-inside list-disc space-y-2">
                <li>Send spam or unsolicited messages</li>
                <li>Transmit illegal content or promote illegal activities</li>
                <li>Harass, abuse, or harm others</li>
                <li>Impersonate any person or entity</li>
                <li>Interfere with the service's security features</li>
                <li>Scrape or data mine our platform without permission</li>
                <li>Train competing AI models using our service</li>
              </ul>
              <p className="mt-4">
                We may suspend or terminate accounts that violate these terms.
              </p>
            </section>

            {/* Section 5: AI Accuracy */}
            <section>
              <h2 className="mt-8 mb-4 text-xl font-bold text-[#1a1a2e]">
                5. AI Accuracy
              </h2>
              <div className="rounded-lg border-l-4 border-[#e8a020] bg-[#fef3c7] p-4">
                <p className="font-semibold text-[#1a1a2e]">IMPORTANT:</p>
              </div>
              <p className="mt-4">
                CypAI's AI responses depend on the information and training data you provide.
              </p>
              <ul className="mt-3 list-inside list-disc space-y-2">
                <li>We are not liable for incorrect AI responses</li>
                <li>You are responsible for reviewing and approving AI training data</li>
                <li>You must train the AI carefully with accurate information</li>
                <li>The AI may make mistakes - you should monitor important conversations</li>
                <li>We recommend human oversight for critical business decisions</li>
              </ul>
            </section>

            {/* Section 6: Subscription & Billing */}
            <section>
              <h2 className="mt-8 mb-4 text-xl font-bold text-[#1a1a2e]">
                6. Subscription & Billing
              </h2>
              <ul className="list-inside list-disc space-y-2">
                <li>Subscriptions auto-renew unless cancelled</li>
                <li>You can cancel anytime in your dashboard</li>
                <li>Prices are subject to change with 30 days notice</li>
                <li>All payments are processed by Paddle (our Merchant of Record)</li>
                <li>You are responsible for all applicable taxes</li>
                <li>Failed payments may result in service suspension</li>
              </ul>
            </section>

            {/* Section 7: Refunds */}
            <section>
              <h2 className="mt-8 mb-4 text-xl font-bold text-[#1a1a2e]">
                7. Refunds
              </h2>
              <ul className="list-inside list-disc space-y-2">
                <li>We offer a 30-day money-back guarantee on all subscriptions</li>
                <li>Refunds are processed back to your original payment method within 5-10 business days</li>
                <li>To request a refund, email cypai.app@cypai.app</li>
                <li>See our full Refund Policy at <Link href="/refund-policy" className="text-[#e8a020] underline hover:no-underline">/refund-policy</Link></li>
              </ul>
            </section>

            {/* Section 8: Termination */}
            <section>
              <h2 className="mt-8 mb-4 text-xl font-bold text-[#1a1a2e]">
                8. Termination
              </h2>
              <p>
                We may terminate or suspend your account immediately for:
              </p>
              <ul className="mt-3 list-inside list-disc space-y-2">
                <li>Violations of these Terms of Service</li>
                <li>Fraudulent or illegal activities</li>
                <li>Non-payment of fees</li>
                <li>Behavior that harms other users or our service</li>
              </ul>
              <p className="mt-4">
                Upon termination, your data will be retained for 90 days then deleted per our <Link href="/privacy-policy" className="text-[#e8a020] underline hover:no-underline">Privacy Policy</Link>.
              </p>
            </section>

            {/* Section 9: Limitation of Liability */}
            <section>
              <h2 className="mt-8 mb-4 text-xl font-bold text-[#1a1a2e]">
                9. Limitation of Liability
              </h2>
              <p>
                To the maximum extent permitted by law:
              </p>
              <ul className="mt-3 list-inside list-disc space-y-2">
                <li>CypAI is provided "as is" without warranties of any kind</li>
                <li>We are not liable for indirect, incidental, or consequential damages</li>
                <li>Our total liability shall not exceed the amount you paid in the last 12 months</li>
                <li>We are not responsible for third-party services (WhatsApp, OpenAI, etc.)</li>
                <li>You use the service at your own risk</li>
              </ul>
            </section>

            {/* Section 10: Governing Law */}
            <section>
              <h2 className="mt-8 mb-4 text-xl font-bold text-[#1a1a2e]">
                10. Governing Law
              </h2>
              <p>
                These terms shall be governed by and construed in accordance with the laws of:
              </p>
              <ul className="mt-3 list-inside list-disc space-y-2">
                <li>The Republic of Cyprus (primary jurisdiction)</li>
                <li>England and Wales (for EU customers)</li>
              </ul>
              <p className="mt-4">
                Any disputes shall be resolved in the courts of Nicosia, Cyprus.
              </p>
            </section>

            {/* Section 11: Changes to Terms */}
            <section>
              <h2 className="mt-8 mb-4 text-xl font-bold text-[#1a1a2e]">
                11. Changes to Terms
              </h2>
              <ul className="list-inside list-disc space-y-2">
                <li>We may update these terms from time to time</li>
                <li>We will notify you by email 30 days before changes take effect</li>
                <li>Continued use after changes constitutes acceptance</li>
                <li>If you disagree with changes, you may cancel your subscription</li>
              </ul>
            </section>

            {/* Section 12: Contact */}
            <section>
              <h2 className="mt-8 mb-4 text-xl font-bold text-[#1a1a2e]">
                12. Contact
              </h2>
              <p>
                For questions about these Terms of Service:
              </p>
              <ul className="mt-3 list-inside space-y-2">
                <li>
                  Email:{' '}
                  <a
                    href="mailto:cypai.app@cypai.app"
                    className="font-semibold text-[#e8a020] hover:underline"
                  >
                    cypai.app@cypai.app
                  </a>
                </li>
                <li>Response time: Within 24 hours on business days</li>
                <li>Address: Northern Cyprus (TRNC)</li>
              </ul>
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
