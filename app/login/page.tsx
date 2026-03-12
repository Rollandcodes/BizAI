'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const DASHBOARD_STORAGE_KEY = 'cypai_dashboard_email';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [welcomeMsg, setWelcomeMsg] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const normalised = email.trim().toLowerCase();
    if (!normalised) return;

    setLoading(true);
    setError('');
    setWelcomeMsg('');

    try {
      const { data, error: dbError } = await supabase
        .from('businesses')
        .select('owner_email, business_name, owner_name')
        .eq('owner_email', normalised)
        .maybeSingle();

      if (dbError) throw dbError;

      if (!data) {
        setError('No account found with this email.');
        return;
      }

      // Persist email so the dashboard can auto-load
      localStorage.setItem(DASHBOARD_STORAGE_KEY, normalised);

      const displayName = (data.owner_name as string | null) || (data.business_name as string) || 'there';
      setWelcomeMsg(`Welcome back, ${displayName}! Redirecting…`);

      setTimeout(() => router.push('/dashboard'), 900);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-block text-3xl font-extrabold text-slate-900">
            🤖 CypAI
          </Link>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-extrabold text-slate-900">Welcome back</h1>
          <p className="mt-1.5 text-sm text-slate-500">
            Enter your email to access your dashboard
          </p>

          {/* Success */}
          {welcomeMsg && (
            <div className="mt-5 flex items-center gap-2.5 rounded-xl bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
              <span className="text-lg">🎉</span>
              {welcomeMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-slate-700">
                Business Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError('');
                }}
                placeholder="you@business.com"
                disabled={loading || !!welcomeMsg}
                className={`h-12 w-full rounded-xl border px-4 text-sm text-slate-900 outline-none transition focus:ring-2 disabled:opacity-60 ${
                  error
                    ? 'border-red-400 bg-red-50 focus:border-red-400 focus:ring-red-400/10'
                    : 'border-slate-200 focus:border-blue-400 focus:ring-blue-400/10'
                }`}
              />
              {error && (
                <p className="mt-2 text-sm font-medium text-red-600">{error}</p>
              )}
              {error.includes('No account') && (
                <Link
                  href="/#pricing"
                  className="mt-1.5 inline-block text-sm font-semibold text-blue-600 hover:underline"
                >
                  Don&apos;t have an account? Start your free trial →
                </Link>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !email.trim() || !!welcomeMsg}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Checking…
                </>
              ) : (
                'Access Dashboard →'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-slate-200" />
            <span className="text-xs font-semibold text-slate-400">or</span>
            <span className="h-px flex-1 bg-slate-200" />
          </div>

          <Link
            href="/#pricing"
            className="block w-full rounded-xl border-2 border-slate-200 py-3 text-center text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-700"
          >
            New to CypAI? Start your free 7-day trial →
          </Link>
        </div>

        {/* Back link */}
        <p className="mt-6 text-center text-xs text-slate-400">
          <Link href="/" className="transition hover:text-slate-600">← Back to homepage</Link>
        </p>
      </div>
    </div>
  );
}
