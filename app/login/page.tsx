'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const DASHBOARD_STORAGE_KEY = 'cypai-dashboard-email';

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
    <div className="flex min-h-screen">
      {/* Left Panel - Branded (hidden on mobile) */}
      <div className="relative hidden w-2/5 flex-col justify-between bg-[#1a1a2e] p-8 lg:flex">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] to-[#0f0f1a]" />
        
        {/* Amber accent shapes */}
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#e8a020] opacity-10 blur-3xl" />
        <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-[#e8a020] opacity-10 blur-3xl" />
        
        {/* Content */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold text-white">
            <span>🤖</span>
            <span>CypAI</span>
          </Link>
        </div>

        <div className="relative z-10 space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-white leading-tight">
              AI that answers your customers. While you sleep.
            </h2>
          </div>

          <ul className="space-y-4">
            <li className="flex items-center gap-3 text-gray-300">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#e8a020] text-[#1a1a2e] text-sm">✓</span>
              <span>Answer WhatsApp enquiries 24/7</span>
            </li>
            <li className="flex items-center gap-3 text-gray-300">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#e8a020] text-[#1a1a2e] text-sm">✓</span>
              <span>Speak 5 languages automatically</span>
            </li>
            <li className="flex items-center gap-3 text-gray-300">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#e8a020] text-[#1a1a2e] text-sm">✓</span>
              <span>Book appointments while you're busy</span>
            </li>
          </ul>
        </div>

        <div className="relative z-10 flex flex-col items-center gap-2 text-sm text-gray-500">
          <div className="flex gap-4">
            <Link href="/blog" className="hover:text-[#e8a020]">Blog</Link>
            <Link href="/privacy-policy" className="hover:text-[#e8a020]">Privacy</Link>
            <Link href="/terms-of-service" className="hover:text-[#e8a020]">Terms</Link>
          </div>
          © 2026 CypAI. All rights reserved.
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex w-full flex-col justify-center bg-white px-4 py-12 lg:w-3/5 lg:px-12">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold text-[#1a1a2e] lg:hidden">
              <span>🤖</span>
              <span>CypAI</span>
            </Link>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-xl">
            <h1 className="text-2xl font-extrabold text-[#1a1a2e]">Welcome back</h1>
            <p className="mt-1.5 text-sm text-gray-500">
              Sign in to your dashboard
            </p>

            {welcomeMsg && (
              <div className="mt-5 flex items-center gap-2.5 rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm font-semibold text-green-600">
                <span className="text-lg">🎉</span>
                {welcomeMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-gray-700">
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
                  className={`h-12 w-full rounded-lg border px-4 text-sm text-gray-900 outline-none transition focus:ring-2 disabled:opacity-60 ${
                    error
                      ? 'border-red-500/70 bg-red-50 focus:border-red-400 focus:ring-red-400/10'
                      : 'border-gray-300 bg-white focus:border-[#e8a020] focus:ring-[#e8a020]/20'
                  }`}
                />
                <p className="mt-1.5 text-xs text-gray-500">
                  Enter the email you signed up with
                </p>
                {error && (
                  <p className="mt-2 text-sm font-medium text-red-500">{error}</p>
                )}
                {error.includes('No account') && (
                  <Link
                    href="/#pricing"
                    className="mt-1.5 inline-block text-sm font-semibold text-[#e8a020] hover:underline"
                  >
                    Don't have an account? Start your free trial →
                  </Link>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || !email.trim() || !!welcomeMsg}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#e8a020] text-sm font-semibold text-[#1a1a2e] transition-all hover:-translate-y-0.5 hover:bg-[#d49020] hover:shadow-lg hover:shadow-[#e8a020]/25 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#1a1a2e]/30 border-t-[#1a1a2e]" />
                    Checking…
                  </>
                ) : (
                  'Access Dashboard →'
                )}
              </button>

              <p className="text-center text-xs text-gray-500">
                Forgot email? <a href="mailto:cypai.app@cypai.app" className="text-[#e8a020] hover:underline">Contact cypai.app@cypai.app</a>
              </p>
            </form>

            <Link
              href="/#pricing"
              className="mt-6 block w-full rounded-xl border border-gray-200 bg-gray-50 py-3 text-center text-sm font-semibold text-gray-700 transition hover:border-[#e8a020] hover:bg-white"
            >
              New to CypAI? Start your free 7-day trial →
            </Link>
          </div>

          <p className="mt-6 text-center text-xs text-gray-500">
            <Link href="/" className="transition hover:text-[#e8a020]">← Back to homepage</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
