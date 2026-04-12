'use client';

import { FormEvent, useMemo, useState } from 'react';

type Affiliate = {
  id: string;
  email: string;
  name: string;
  referral_code: string;
  total_referrals: number;
  total_earnings: number;
  payout_requested: boolean;
  created_at: string;
};

const LINK_BASE = 'https://cypai.app/?ref=';

export default function AffiliatePage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [affiliate, setAffiliate] = useState<Affiliate | null>(null);
  const [payoutLoading, setPayoutLoading] = useState(false);

  const referralLink = useMemo(() => {
    if (!affiliate) return '';
    return `${LINK_BASE}${affiliate.referral_code}`;
  }, [affiliate]);

  async function handleSignup(event: FormEvent) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/affiliate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      });

      const payload = (await response.json()) as { affiliate?: Affiliate; error?: string };
      if (!response.ok || !payload.affiliate) {
        throw new Error(payload.error || 'Failed to create affiliate account');
      }

      setAffiliate(payload.affiliate);
    } catch (signupError) {
      setError(signupError instanceof Error ? signupError.message : 'Failed to create affiliate account');
    } finally {
      setLoading(false);
    }
  }

  async function requestPayout() {
    if (!affiliate || affiliate.payout_requested) return;

    setPayoutLoading(true);
    setError('');
    try {
      const response = await fetch('/api/affiliate/request-payout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: affiliate.email }),
      });

      const payload = (await response.json()) as { success?: boolean; error?: string };
      if (!response.ok || !payload.success) {
        throw new Error(payload.error || 'Failed to request payout');
      }

      setAffiliate((current) => (current ? { ...current, payout_requested: true } : current));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Failed to request payout');
    } finally {
      setPayoutLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-12 text-zinc-100">
      <div className="mx-auto grid w-full max-w-5xl gap-8 lg:grid-cols-[1fr_1.1fr]">
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8 shadow-xl shadow-black/30">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">CypAI Affiliate Program</p>
          <h1 className="mt-3 text-4xl font-extrabold leading-tight text-white">Earn 20% recurring commission</h1>
          <p className="mt-4 text-lg leading-8 text-zinc-400">
            Share your link, earn $15.80 for every Pro client you refer.
          </p>

          {!affiliate ? (
            <form className="mt-8 space-y-4" onSubmit={handleSignup}>
              <label className="block text-sm font-semibold text-zinc-300">
                Name
                <input
                  className="mt-2 h-11 w-full rounded-xl border border-zinc-700 px-4 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Your full name"
                  required
                />
              </label>

              <label className="block text-sm font-semibold text-zinc-300">
                Email
                <input
                  className="mt-2 h-11 w-full rounded-xl border border-zinc-700 px-4 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@business.com"
                  required
                />
              </label>

              {error ? (
                <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {error}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={loading}
                className="inline-flex h-11 items-center rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
              >
                {loading ? 'Creating account...' : 'Create Affiliate Account'}
              </button>
            </form>
          ) : (
            <div className="mt-8 space-y-4">
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
                <p className="text-sm font-semibold text-emerald-300">Your unique referral link</p>
                <p className="mt-2 break-all rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 font-mono text-sm text-zinc-200">{referralLink}</p>
              </div>

              {error ? (
                <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {error}
                </p>
              ) : null}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8 shadow-xl shadow-black/30">
          <h2 className="text-2xl font-extrabold text-white">Earnings Dashboard</h2>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Total referrals</p>
              <p className="mt-2 text-3xl font-extrabold text-white">{affiliate?.total_referrals ?? 0}</p>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Total earned</p>
              <p className="mt-2 text-3xl font-extrabold text-white">${Number(affiliate?.total_earnings ?? 0).toFixed(2)}</p>
            </div>
          </div>

          <button
            type="button"
            disabled={!affiliate || affiliate.payout_requested || payoutLoading}
            onClick={() => void requestPayout()}
            className="mt-6 inline-flex h-11 items-center rounded-xl border border-zinc-700 bg-zinc-950 px-6 text-sm font-semibold text-zinc-200 transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {affiliate?.payout_requested
              ? 'Payout Requested'
              : payoutLoading
                ? 'Requesting payout...'
                : 'Request payout'}
          </button>

          {!affiliate ? (
            <p className="mt-4 text-sm text-zinc-500">Create your affiliate account to unlock your personal dashboard and referral link.</p>
          ) : null}
        </section>
      </div>
    </main>
  );
}


