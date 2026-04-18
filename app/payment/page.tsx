'use client';

import { Suspense, startTransition, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Check } from 'lucide-react';
import { PLANS } from '@/lib/plans';
import { CheckoutButton } from '@/components/CheckoutButton';
import { PaddlePlan } from '@/lib/paddle';

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
}: {
  planId: string;
  signupData: SignupData;
}) {
  const plan = PLANS[planId] ?? PLANS.pro;
  const businessName = getBusinessName(signupData);
  const email = getSignupEmail(signupData);

  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-center">
        <p className="mb-1 font-semibold text-blue-600">🔒 Secure checkout powered by Paddle</p>
        <p className="text-sm text-blue-500">Secure card payment with 7-day free trial</p>
      </div>
      <CheckoutButton
        plan={planId as PaddlePlan}
        userEmail={email}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-4 font-bold text-white transition-all hover:bg-blue-700"
      >
        Subscribe Now
      </CheckoutButton>
      <div className="flex items-center justify-center gap-3 pt-1 text-xs text-zinc-500">
        <span>🔒 SSL Secured</span>
        <span>•</span>
        <span>Cancel anytime</span>
        <span>•</span>
        <span>7-day trial</span>
      </div>
    </div>
  );
}

function PaymentContent() {
  const router = useRouter();
  const params = useSearchParams();
  const planId = params?.get('plan') ?? 'pro';
  const plan = PLANS[planId] ?? PLANS.pro;

  const [signupData, setSignupData] = useState<SignupData | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('bizai_signup') ?? localStorage.getItem('cypai_signup');
      if (raw) startTransition(() => setSignupData(JSON.parse(raw) as SignupData));
    } catch {
      // localStorage unavailable or corrupt — proceed without pre-fill
    }
  }, []);

  const businessName = getBusinessName(signupData);
  const email = getSignupEmail(signupData);

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800 bg-zinc-950/90 px-4 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link href="/" className="text-lg font-extrabold text-white">🤖 CypAI</Link>
          <Link href={`/signup?plan=${planId}`} className="text-sm font-semibold text-zinc-400 transition hover:text-zinc-200">← Back</Link>
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
                <span className="text-sm font-semibold text-zinc-500">Your Details</span>
              </div>
              <div className="h-0.5 flex-1 rounded-full bg-blue-600" />
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">2</div>
                <span className="text-sm font-semibold text-zinc-100">Payment</span>
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-xl shadow-black/30">
              <h2 className="text-lg font-extrabold text-white">Order Summary</h2>

              <div className="mt-5 rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-base font-extrabold text-white">{plan.name} Plan</p>
                    <p className="text-sm text-zinc-400">{plan.description}</p>
                  </div>
                  <p className="text-xl font-extrabold text-white">${plan.price}<span className="text-sm font-normal text-zinc-500">/mo</span></p>
                </div>
                <ul className="mt-4 space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-zinc-300">
                      <Check className="h-3.5 w-3.5 shrink-0 text-blue-400" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2">
                  <span className="text-base">🎁</span>
                  <span className="text-xs font-semibold text-emerald-700">7-day free trial included</span>
                </div>
              </div>

              <div className="my-5 border-t border-zinc-800" />

              <div className="flex items-end justify-between">
                <div>
                  <p className="text-sm font-semibold text-zinc-400">Total today</p>
                  <p className="text-xs text-zinc-500">after 7-day free trial</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-extrabold text-white">${plan.price}</p>
                  <p className="text-xs text-zinc-500">per month</p>
                </div>
              </div>

              <div className="mt-5 space-y-2.5">
                {[
                  { icon: '🔒', text: 'Secure Payment' },
                  { icon: '↩️', text: 'Cancel anytime, no contracts' },
                  { icon: '🇨🇾', text: 'Cyprus local support' },
                ].map(({ icon, text }) => (
                  <div key={text} className="flex items-center gap-2.5 text-sm text-zinc-400">
                    <span className="text-base">{icon}</span>
                    {text}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-xl shadow-black/30">
              <h2 className="text-lg font-extrabold text-white">Complete Your Order</h2>

              {signupData && (
                <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3.5 text-sm">
                  <p className="text-zinc-400">
                    <span className="font-semibold text-zinc-200">Paying as:</span>{' '}
                    {email || 'No email provided'}
                  </p>
                  <p className="mt-1 text-zinc-400">
                    <span className="font-semibold text-zinc-200">Business:</span>{' '}
                    {businessName}
                  </p>
                </div>
              )}

              <div className="mt-6">
                <p className="mb-4 text-[11px] font-semibold uppercase tracking-widest text-zinc-500">
                  Pay securely without leaving CypAI
                </p>
                {signupData ? (
                  <PaymentButtons planId={planId} signupData={signupData} />
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

