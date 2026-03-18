import { Check } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Refund Policy | CypAI',
  description: 'CypAI refund policy - 30-day money-back guarantee, no questions asked.',
};

export default function RefundPolicyPage() {
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
            <h1 className="text-3xl font-extrabold text-[#1a1a2e] sm:text-4xl">
              Refund Policy
            </h1>
            <p className="mt-2 text-lg text-[#6b7280]">
              Simple, fair, and no questions asked.
            </p>
            <p className="mt-2 text-sm text-[#6b7280]">Last updated: March 2026</p>
          </div>

          {/* Body Content */}
          <div className="space-y-6 text-base leading-relaxed text-[#374151]">
            <p>
              We want you to be completely satisfied with CypAI. If you are not happy for any reason, we offer a straightforward refund policy.
            </p>

            {/* 30-Day Money-Back Guarantee - Highlighted Section */}
            <div className="rounded-lg border-l-4 border-[#e8a020] bg-[#fef3c7] p-6">
              <h2 className="mb-4 text-xl font-bold text-[#1a1a2e]">
                30-Day Money-Back Guarantee
              </h2>
              <p className="text-[#374151]">
                All CypAI subscription plans are eligible for a full refund within 30 days of your initial purchase. No questions asked. No conditions. No exceptions.
              </p>
            </div>

            {/* How to Request a Refund */}
            <section>
              <h2 className="mb-4 text-xl font-bold text-[#1a1a2e]">
                How to Request a Refund
              </h2>
              <p>
                Email us at{' '}
                <a
                  href="mailto:support@cypai.app"
                  className="font-semibold text-[#e8a020] hover:underline"
                >
                  support@cypai.app
                </a>{' '}
                with the subject line "Refund Request" and your account email address. We will process your refund within 5–10 business days back to your original payment method.
              </p>
            </section>

            {/* About Payment Processing */}
            <section>
              <h2 className="mb-4 text-xl font-bold text-[#1a1a2e]">
                About Our Payment Processing
              </h2>
              <p>
                All payments are processed by Paddle.com, our authorised reseller and Merchant of Record for all CypAI subscriptions. Paddle's refund policy applies to all purchases made through CypAI.
              </p>
            </section>

            {/* After Your Refund */}
            <section>
              <h2 className="mb-4 text-xl font-bold text-[#1a1a2e]">
                After Your Refund
              </h2>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Check className="mt-1 h-5 w-5 flex-shrink-0 text-[#0f7a4e]" />
                  <span>Your account will remain active until the end of your current billing period.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-1 h-5 w-5 flex-shrink-0 text-[#0f7a4e]" />
                  <span>After your refund is processed, your account will revert to the free plan automatically.</span>
                </li>
              </ul>
            </section>

            {/* Questions */}
            <section>
              <h2 className="mb-4 text-xl font-bold text-[#1a1a2e]">
                Questions?
              </h2>
              <p>
                Contact us at{' '}
                <a
                  href="mailto:support@cypai.app"
                  className="font-semibold text-[#e8a020] hover:underline"
                >
                  support@cypai.app
                </a>{' '}
                and we will respond within 24 hours on business days.
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
