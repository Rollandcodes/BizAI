'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';

const CONTACT_EMAIL = 'cypai.app@cypai.app';
const WA_LINK = 'https://wa.me/905338425559?text=Hi%2C%20I%27m%20interested%20in%20CypAI';
const WA_NUMBER = '+90 533 842 5559';

type FormState = {
  name: string;
  email: string;
  businessName: string;
  message: string;
};

export default function ContactPage() {
  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    businessName: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const subject = encodeURIComponent(`CypAI Inquiry from ${form.name} — ${form.businessName}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\nBusiness: ${form.businessName}\n\nMessage:\n${form.message}`
    );
    window.open(`mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`, '_blank');
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-slate-200 bg-white px-4 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link href="/" className="text-xl font-extrabold text-slate-900">🤖 CypAI</Link>
          <Link
            href="/"
            className="flex items-center gap-1.5 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            ← Back to Home
          </Link>
        </div>
      </nav>

      <div className="mx-auto max-w-5xl px-4 py-16">
        {/* Header */}
        <div className="mb-12 text-center">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-blue-600">We&apos;d love to hear from you</p>
          <h1 className="text-4xl font-extrabold text-slate-900">Get in Touch</h1>
          <p className="mt-3 text-lg text-slate-500">
            We&apos;re based in Northern Cyprus and respond within a few hours.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1fr_340px]">
          {/* Left — form */}
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            {submitted ? (
              <div className="flex flex-col items-center gap-4 py-10 text-center">
                <span className="text-5xl">🎉</span>
                <h2 className="text-xl font-bold text-slate-900">Message ready to send!</h2>
                <p className="text-slate-500">
                  Your email client should have opened. If not, email us directly at{' '}
                  <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-blue-600 hover:underline">
                    {CONTACT_EMAIL}
                  </a>
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-2 rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h2 className="text-lg font-bold text-slate-900">Send us a message</h2>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="mb-1.5 block text-sm font-semibold text-slate-700">
                      Your Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Ahmed Yilmaz"
                      className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/10"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-slate-700">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@business.com"
                      className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/10"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="businessName" className="mb-1.5 block text-sm font-semibold text-slate-700">
                    Business Name
                  </label>
                  <input
                    id="businessName"
                    name="businessName"
                    type="text"
                    value={form.businessName}
                    onChange={handleChange}
                    placeholder="My Business"
                    className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/10"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="mb-1.5 block text-sm font-semibold text-slate-700">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell us about your business and what you need..."
                    className="w-full resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/10"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>

          {/* Right — direct contact */}
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-base font-bold text-slate-900">Direct Contact</h2>
              <ul className="space-y-4 text-sm text-slate-600">
                <li>
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="flex items-start gap-3 rounded-xl p-3 transition hover:bg-slate-50"
                  >
                    <span className="mt-0.5 text-xl">📧</span>
                    <div>
                      <p className="font-semibold text-slate-900">Email</p>
                      <p className="break-all text-blue-600">{CONTACT_EMAIL}</p>
                    </div>
                  </a>
                </li>
                <li>
                  <a
                    href={WA_LINK}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-start gap-3 rounded-xl p-3 transition hover:bg-slate-50"
                  >
                    <span className="mt-0.5 text-xl">💬</span>
                    <div>
                      <p className="font-semibold text-slate-900">WhatsApp</p>
                      <p className="text-green-600">{WA_NUMBER}</p>
                    </div>
                  </a>
                </li>
                <li className="flex items-start gap-3 p-3">
                  <span className="mt-0.5 text-xl">📍</span>
                  <div>
                    <p className="font-semibold text-slate-900">Location</p>
                    <p>Nicosia, Northern Cyprus 🇨🇾</p>
                  </div>
                </li>
                <li className="flex items-start gap-3 p-3">
                  <span className="mt-0.5 text-xl">⏰</span>
                  <div>
                    <p className="font-semibold text-slate-900">Response Time</p>
                    <p>Usually within 2 hours</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Location card */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-blue-50 to-slate-50 p-6 shadow-sm">
              <p className="text-2xl">🇨🇾</p>
              <p className="mt-2 font-bold text-slate-900">Northern Cyprus</p>
              <p className="mt-1 text-sm text-slate-500">
                Serving local businesses across Nicosia, Kyrenia, Famagusta, and the rest of Northern Cyprus.
              </p>
              <a
                href={WA_LINK}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-500"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                  <path d="M20.52 3.48A11.93 11.93 0 0012 0C5.37 0 0 5.37 0 12c0 2.12.55 4.19 1.6 6.01L0 24l6.15-1.61A11.94 11.94 0 0012 24c6.63 0 12-5.37 12-12 0-3.19-1.24-6.2-3.48-8.52zm-8.52 18.4a9.91 9.91 0 01-5.05-1.38l-.36-.21-3.65.96.97-3.57-.24-.37A9.92 9.92 0 012.08 12c0-5.47 4.45-9.92 9.92-9.92 2.65 0 5.14 1.03 7.01 2.91a9.87 9.87 0 012.91 7.01c0 5.47-4.45 9.88-9.92 9.88zm5.44-7.42c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.49-1.76-1.66-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.44-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51H6.4c-.2 0-.52.07-.79.37-.27.3-1.02 1-1.02 2.43s1.05 2.82 1.19 3.02c.15.2 2.06 3.15 5 4.41.7.3 1.24.48 1.67.61.7.22 1.34.19 1.84.12.56-.08 1.76-.72 2.01-1.41.25-.7.25-1.3.18-1.41-.08-.13-.28-.2-.57-.35z" />
                </svg>
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
