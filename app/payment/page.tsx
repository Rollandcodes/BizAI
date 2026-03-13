'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Check, Loader2 } from 'lucide-react';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { PLANS } from '@/lib/plans';
import { Analytics } from '@/lib/analytics';
import EmbeddedCardForm from '@/components/EmbeddedCardForm';

// ── Types ──────────────────────────────────────────────────────────────────

type SignupData = {
  businessName: string;
  yourName: string;
  email: string;
  whatsapp: string;
  businessType: string;
  website: string;
  plan: string;
};

// ── Main page content ──────────────────────────────────────────────────────

function PaymentContent() {
  const router = useRouter();
  const params = useSearchParams();
  const planId = params.get('plan') ?? 'pro';
  const plan = PLANS[planId] ?? PLANS.pro;

  const [signupData, setSignupData] = useState<SignupData | null>(null);
  const [clientToken, setClientToken] = useState('');
  const [tokenLoading, setTokenLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasTrackedPaymentStart = useRef(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('cypai_signup');
      if (raw) setSignupData(JSON.parse(raw) as SignupData);
    } catch {
      // localStorage unavailable or corrupt — proceed without pre-fill
    }
  }, []);

  useEffect(() => {
    if (hasTrackedPaymentStart.current) return;
    hasTrackedPaymentStart.current = true;
    Analytics.paymentStarted(planId, Number(plan.price));
  }, [plan.price, planId]);

  useEffect(() => {
    async function fetchClientToken() {
      try {
        const response = await fetch('/api/paypal/client-token');
        const data = (await response.json()) as { clientToken?: string; error?: string };

        if (!response.ok || !data.clientToken) {
          throw new Error(data.error || 'Unable to load secure payment form');
        }

        setClientToken(data.clientToken);
      } catch (tokenError) {
        console.error('Client token error:', tokenError);
        setError('Unable to load the secure payment form right now.');
      } finally {
        setTokenLoading(false);
      }
    }

    void fetchClientToken();
  }, []);

  function handleSuccess(user: { id?: string; email?: string; businessName?: string; plan?: string }) {
    setProcessing(true);
    Analytics.paymentCompleted(planId, Number(plan.price));
    if (signupData) {
      localStorage.setItem(
        'cypai_user',
        JSON.stringify({
          ...signupData,
          ...user,
          businessId: user.id,
          plan: planId,
        }),
      );
    }
    router.push('/success');
  }

  function handleError(msg: string) {
    Analytics.paymentFailed(planId);
    setError(msg);
    setProcessing(false);
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">

      {/* Top bar */}
      <header className="border-b border-slate-200 bg-white px-4 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <a href="/" className="text-lg font-extrabold text-slate-900">🤖 CypAI</a>
          <a href={`/signup?plan=${planId}`} className="text-sm font-semibold text-slate-500 transition hover:text-slate-800">← Back</a>
        </div>
      </header>

      <main className="flex flex-1 items-start justify-center px-4 py-10">
        <div className="w-full max-w-5xl">

          {/* Progress bar */}
          <div className="mb-8 max-w-lg">
            <div className="flex items-center gap-3">
              {/* Step 1 — done */}
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-white">
                  <Check className="h-3.5 w-3.5" />
                </div>
                <span className="text-sm font-semibold text-slate-400">Your Details</span>
              </div>
              <div className="h-0.5 flex-1 rounded-full bg-blue-600" />
              {/* Step 2 — active */}
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">2</div>
                <span className="text-sm font-semibold text-slate-900">Payment</span>
              </div>
            </div>
          </div>

          {/* Two-column layout */}
          <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">

            {/* ── LEFT: Order Summary ─────────────────────────────────── */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-extrabold text-slate-900">Order Summary</h2>

              {/* Plan card */}
              <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-base font-extrabold text-slate-900">{plan.name} Plan</p>
                    <p className="text-sm text-slate-500">{plan.description}</p>
                  </div>
                  <p className="text-xl font-extrabold text-slate-900">${plan.price}<span className="text-sm font-normal text-slate-500">/mo</span></p>
                </div>
                <ul className="mt-4 space-y-2">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-slate-700">
                      <Check className="h-3.5 w-3.5 shrink-0 text-blue-500" />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2">
                  <span className="text-base">🎁</span>
                  <span className="text-xs font-semibold text-emerald-700">7-day free trial included</span>
                </div>
              </div>

              <div className="my-5 border-t border-slate-100" />

              {/* Total */}
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-500">Total today</p>
                  <p className="text-xs text-slate-400">after 7-day free trial</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-extrabold text-slate-900">${plan.price}</p>
                  <p className="text-xs text-slate-400">per month</p>
                </div>
              </div>

              {/* Trust badges */}
              <div className="mt-5 space-y-2.5">
                {[
                  { icon: '🔒', text: 'Secure PayPal Payment' },
                  { icon: '↩️', text: 'Cancel anytime, no contracts' },
                  { icon: '🇨🇾', text: 'Cyprus local support' },
                ].map(({ icon, text }) => (
                  <div key={text} className="flex items-center gap-2.5 text-sm text-slate-600">
                    <span className="text-base">{icon}</span>
                    {text}
                  </div>
                ))}
              </div>
            </div>

            {/* ── RIGHT: Payment ──────────────────────────────────────── */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-extrabold text-slate-900">Complete Your Order</h2>

              {/* Customer details snippet */}
              {signupData && (
                <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3.5 text-sm">
                  <p className="text-slate-500">
                    <span className="font-semibold text-slate-700">Paying as:</span>{' '}
                    {signupData.email}
                  </p>
                  <p className="mt-1 text-slate-500">
                    <span className="font-semibold text-slate-700">Business:</span>{' '}
                    {signupData.businessName}
                  </p>
                </div>
              )}

              {/* Error box */}
              {error && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  ⚠️ {error}
                </div>
              )}

              {/* Processing overlay text */}
              {processing ? (
                <div className="mt-8 flex flex-col items-center gap-4 py-8">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50">
                    <Loader2 className="h-7 w-7 animate-spin text-blue-600" />
                  </div>
                  <p className="text-sm font-semibold text-slate-700">Processing your payment…</p>
                  <p className="text-xs text-slate-400">Please don&apos;t close this tab</p>
                </div>
              ) : (
                <div className="mt-6">
                  <p className="mb-4 text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                    Pay securely without leaving CypAI
                  </p>
                  {signupData ? (
                    <>
                      {tokenLoading ? (
                        <div className="flex flex-col items-center py-8">
                          <div className="mb-3 h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
                          <p className="text-sm text-gray-500">Loading secure payment...</p>
                        </div>
                      ) : clientToken ? (
                        <PayPalScriptProvider
                          options={{
                            clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
                            currency: 'USD',
                            intent: 'capture',
                            components: 'hosted-fields',
                            dataClientToken: clientToken,
                          }}
                        >
                          <EmbeddedCardForm
                            planId={planId}
                            planPrice={`$${plan.price}`}
                            customerEmail={signupData.email || ''}
                            businessName={signupData.businessName || ''}
                            signupData={signupData}
                            onSuccess={handleSuccess}
                            onError={handleError}
                          />
                        </PayPalScriptProvider>
                      ) : (
                        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center">
                          <p className="mb-2 font-medium text-red-600">⚠️ Payment form unavailable</p>
                          <a
                            href={`https://wa.me/905338425559?text=Hi!%20I%20want%20to%20sign%20up%20for%20CypAI%20${encodeURIComponent(plan.name)}%20Plan`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-green-600 hover:underline"
                          >
                            💬 Contact us on WhatsApp instead
                          </a>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-800">
                      <p className="font-semibold">Missing account details</p>
                      <p className="mt-1">
                        Please{' '}
                        <a href={`/signup?plan=${planId}`} className="underline hover:text-amber-900">
                          complete step 1
                        </a>{' '}
                        before proceeding to payment.
                      </p>
                    </div>
                  )}
                </div>
              )}

              <p className="mt-6 text-center text-xs text-slate-400">
                🔒 Payments are handled securely by PayPal. CypAI never stores your card details.
              </p>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense>
      <PaymentContent />
    </Suspense>
  );
}
