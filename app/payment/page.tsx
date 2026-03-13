'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Check } from 'lucide-react';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { PLANS } from '@/lib/plans';
import { Analytics } from '@/lib/analytics';

type SignupData = {
  businessName?: string;
  business_name?: string;
  yourName?: string;
  name?: string;
  email?: string;
  whatsapp?: string;
  phone?: string;
  businessType?: string;
  website?: string;
  plan?: string;
  referralCode?: string;
};

function getBusinessName(signupData: SignupData | null) {
  return signupData?.businessName || signupData?.business_name || signupData?.name || 'Your Business';
}

function getSignupEmail(signupData: SignupData | null) {
  return signupData?.email || '';
}

function PaymentButtons({
  planId,
  signupData,
  onSuccess,
}: {
  planId: string;
  signupData: SignupData;
  onSuccess: () => void;
}) {
  const [{ isPending, isRejected }] = usePayPalScriptReducer();
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);
  const plan = PLANS[planId] ?? PLANS.pro;
  const businessName = getBusinessName(signupData);
  const email = getSignupEmail(signupData);

  if (isPending) {
    return (
      <div className="flex flex-col items-center gap-3 py-8">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        <p className="text-sm text-gray-500">Loading secure payment...</p>
      </div>
    );
  }

  if (isRejected) {
    return (
      <div className="space-y-3">
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center">
          <p className="mb-1 font-semibold text-red-600">⚠️ PayPal failed to load</p>
          <p className="text-sm text-red-500">Check your internet connection and refresh</p>
        </div>
        <a
          href={`https://wa.me/905338425559?text=${encodeURIComponent(`Hi! I want to sign up for CypAI ${plan.name} Plan ($${plan.price}/mo).\nBusiness: ${businessName}\nEmail: ${email}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-500 py-4 font-bold text-white transition-all hover:bg-green-600"
        >
          💬 Complete via WhatsApp instead
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3">
          <p className="text-sm text-red-600">⚠️ {error}</p>
        </div>
      )}

      {processing && (
        <div className="flex items-center gap-3 rounded-xl border border-blue-200 bg-blue-50 p-3">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
          <p className="text-sm font-medium text-blue-700">Processing your payment...</p>
        </div>
      )}

      <PayPalButtons
        style={{
          layout: 'vertical',
          color: 'blue',
          shape: 'rect',
          label: 'paypal',
          height: 50,
          tagline: false,
        }}
        disabled={processing}
        createOrder={async () => {
          setError('');
          try {
            const res = await fetch('/api/paypal/create-order', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                planId,
                customerEmail: email,
              }),
            });
            const data = (await res.json()) as { id?: string; error?: string };
            if (data.error || !data.id) {
              throw new Error(data.error || 'Failed to create order');
            }
            return data.id;
          } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to create order';
            setError(message);
            Analytics.paymentFailed(planId);
            throw err;
          }
        }}
        onApprove={async (data) => {
          setProcessing(true);
          try {
            const res = await fetch('/api/paypal/capture-order', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                orderID: data.orderID,
                planId,
                signupData,
              }),
            });
            const result = (await res.json()) as {
              success?: boolean;
              user?: { id?: string; email?: string; businessName?: string; plan?: string };
              error?: string;
            };
            if (!result.success) {
              throw new Error(result.error || 'Payment capture failed');
            }
            const userPayload = {
              ...result.user,
              businessName: result.user?.businessName || businessName,
              email: result.user?.email || email,
              plan: result.user?.plan || planId,
            };
            localStorage.setItem('bizai_user', JSON.stringify(userPayload));
            localStorage.setItem('cypai_user', JSON.stringify(userPayload));
            onSuccess();
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Payment failed');
            setProcessing(false);
            Analytics.paymentFailed(planId);
          }
        }}
        onError={(err) => {
          console.error('PayPal error:', err);
          setError('Payment failed. Please try again or contact us on WhatsApp.');
          setProcessing(false);
          Analytics.paymentFailed(planId);
        }}
        onCancel={() => {
          setError('Payment cancelled. Try again when ready.');
          setProcessing(false);
        }}
      />

      <div className="flex items-center gap-3">
        <div className="flex-1 border-t border-gray-200" />
        <span className="text-xs text-gray-400">or</span>
        <div className="flex-1 border-t border-gray-200" />
      </div>

      <a
        href={`https://wa.me/905338425559?text=${encodeURIComponent(`Hi! I want to sign up for CypAI ${plan.name} Plan ($${plan.price}/mo).\nBusiness: ${businessName}\nEmail: ${email}`)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-green-300 py-3 text-sm font-medium text-green-600 transition-colors hover:bg-green-50"
      >
        💬 Pay manually via WhatsApp
      </a>

      <div className="flex items-center justify-center gap-3 pt-1 text-xs text-gray-400">
        <span>🔒 SSL Secured</span>
        <span>•</span>
        <span>Cancel anytime</span>
        <span>•</span>
        <span>7-day trial</span>
      </div>

      <p className="text-center text-xs text-gray-400">
        Secured by PayPal. CypAI never stores your card details.
      </p>
    </div>
  );
}

function PaymentContent() {
  const router = useRouter();
  const params = useSearchParams();
  const planId = params.get('plan') ?? 'pro';
  const plan = PLANS[planId] ?? PLANS.pro;

  const [signupData, setSignupData] = useState<SignupData | null>(null);
  const hasTrackedPaymentStart = useRef(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('bizai_signup') ?? localStorage.getItem('cypai_signup');
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

  function handleSuccess() {
    Analytics.paymentCompleted(planId, Number(plan.price));
    router.push('/success');
  }

  const businessName = getBusinessName(signupData);
  const email = getSignupEmail(signupData);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <header className="border-b border-slate-200 bg-white px-4 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <a href="/" className="text-lg font-extrabold text-slate-900">🤖 CypAI</a>
          <a href={`/signup?plan=${planId}`} className="text-sm font-semibold text-slate-500 transition hover:text-slate-800">← Back</a>
        </div>
      </header>

      <main className="flex flex-1 items-start justify-center px-4 py-10">
        <div className="w-full max-w-5xl">
          <div className="mb-8 max-w-lg">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-white">
                  <Check className="h-3.5 w-3.5" />
                </div>
                <span className="text-sm font-semibold text-slate-400">Your Details</span>
              </div>
              <div className="h-0.5 flex-1 rounded-full bg-blue-600" />
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">2</div>
                <span className="text-sm font-semibold text-slate-900">Payment</span>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-extrabold text-slate-900">Order Summary</h2>

              <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-base font-extrabold text-slate-900">{plan.name} Plan</p>
                    <p className="text-sm text-slate-500">{plan.description}</p>
                  </div>
                  <p className="text-xl font-extrabold text-slate-900">${plan.price}<span className="text-sm font-normal text-slate-500">/mo</span></p>
                </div>
                <ul className="mt-4 space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-slate-700">
                      <Check className="h-3.5 w-3.5 shrink-0 text-blue-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2">
                  <span className="text-base">🎁</span>
                  <span className="text-xs font-semibold text-emerald-700">7-day free trial included</span>
                </div>
              </div>

              <div className="my-5 border-t border-slate-100" />

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

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-extrabold text-slate-900">Complete Your Order</h2>

              {signupData && (
                <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3.5 text-sm">
                  <p className="text-slate-500">
                    <span className="font-semibold text-slate-700">Paying as:</span>{' '}
                    {email || 'No email provided'}
                  </p>
                  <p className="mt-1 text-slate-500">
                    <span className="font-semibold text-slate-700">Business:</span>{' '}
                    {businessName}
                  </p>
                </div>
              )}

              <div className="mt-6">
                <p className="mb-4 text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                  Pay securely without leaving CypAI
                </p>
                {signupData ? (
                  <PaymentButtons planId={planId} signupData={signupData} onSuccess={handleSuccess} />
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
