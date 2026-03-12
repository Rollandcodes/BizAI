'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Check, Loader2 } from 'lucide-react';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { PLANS } from '@/lib/plans';

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

// ── PayPal button wrapper (needs SDK loaded check) ─────────────────────────

function PayPalSection({
  planId,
  signupData,
  onSuccess,
  onError,
}: {
  planId: string;
  signupData: SignupData;
  onSuccess: (businessId: string) => void;
  onError: (msg: string) => void;
}) {
  const [{ isPending, isRejected }] = usePayPalScriptReducer();

  if (isPending) {
    return (
      <div className="flex flex-col items-center py-8 gap-3">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 text-sm">Loading PayPal…</p>
      </div>
    );
  }

  if (isRejected) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <p className="text-red-600 font-medium">⚠️ PayPal failed to load</p>
        <p className="text-red-500 text-sm mt-1">
          This usually means the PayPal Client ID is missing or incorrect.
        </p>
        <p className="text-gray-600 text-sm mt-3">Please contact us directly:</p>
        <a
          href="https://wa.me/905338425559?text=Hi%2C%20I%20want%20to%20sign%20up%20for%20CypAI"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-2 bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
        >
          💬 Pay via WhatsApp Instead
        </a>
      </div>
    );
  }

  return (
    <PayPalButtons
      style={{ layout: 'vertical', color: 'blue', shape: 'rect', label: 'paypal', height: 48 }}
      createOrder={async () => {
        const res = await fetch('/api/paypal/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            planId,
            customerEmail: signupData.email,
          }),
        });
        if (!res.ok) throw new Error('Failed to create order');
        const data = (await res.json()) as { id: string };
        return data.id;
      }}
      onApprove={async (data) => {
        const res = await fetch('/api/paypal/capture-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderID: data.orderID,
            planId,
            customerEmail: signupData.email,
          }),
        });
        const result = (await res.json()) as {
          success: boolean;
          businessId?: string;
          message: string;
          error?: string;
        };
        if (result.success && result.businessId) {
          onSuccess(result.businessId);
        } else {
          onError(result.error ?? result.message ?? 'Payment could not be completed.');
        }
      }}
      onError={() => {
        onError(
          'Payment failed. Please try again or contact bizaicyprus123@gmail.com',
        );
      }}
      onCancel={() => {
        // user dismissed the PayPal popup — no action needed
      }}
    />
  );
}

// ── Main page content ──────────────────────────────────────────────────────

function PaymentContent() {
  const router = useRouter();
  const params = useSearchParams();
  const planId = params.get('plan') ?? 'pro';
  const plan = PLANS[planId] ?? PLANS.pro;

  const [signupData, setSignupData] = useState<SignupData | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('cypai_signup');
      if (raw) setSignupData(JSON.parse(raw) as SignupData);
    } catch {
      // localStorage unavailable or corrupt — proceed without pre-fill
    }
  }, []);

  function handleSuccess(businessId: string) {
    setProcessing(true);
    if (signupData) {
      localStorage.setItem(
        'cypai_user',
        JSON.stringify({ ...signupData, businessId, plan: planId }),
      );
    }
    router.push('/success');
  }

  function handleError(msg: string) {
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
                    Pay securely with PayPal
                  </p>
                  {signupData ? (
                    <>
                      <PayPalSection
                        planId={planId}
                        signupData={signupData}
                        onSuccess={handleSuccess}
                        onError={handleError}
                      />
                      {/* WhatsApp fallback */}
                      <div className="mt-4 pt-4 border-t border-slate-100 text-center">
                        <p className="text-xs text-gray-400 mb-2">Prefer to pay manually?</p>
                        <a
                          href={`https://wa.me/905338425559?text=Hi!%20I%20want%20to%20sign%20up%20for%20CypAI%20${encodeURIComponent(plan.name)}%20Plan%20(%24${plan.price}%2Fmo).%20My%20business%3A%20${encodeURIComponent(signupData.businessName)}%2C%20Email%3A%20${encodeURIComponent(signupData.email)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 text-sm font-medium hover:underline flex items-center justify-center gap-1"
                        >
                          💬 Contact us on WhatsApp to arrange payment
                        </a>
                      </div>
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
