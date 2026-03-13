'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'

const CONTACT_EMAIL = 'cypai.app@cypai.app'
const WA_LINK = 'https://wa.me/905338425559?text=Hi%2C%20I%27m%20interested%20in%20CypAI'
const WA_NUMBER = '+90 533 842 5559'

type FormState = {
  name: string
  email: string
  businessName: string
  message: string
}

export default function ContactPage() {
  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    businessName: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const subject = encodeURIComponent(`CypAI Inquiry from ${form.name} — ${form.businessName}`)
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\nBusiness: ${form.businessName}\n\nMessage:\n${form.message}`
    )
    window.open(`mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`, '_blank')
    setSubmitted(true)
  }

  return (
    <div
      className="min-h-screen bg-white text-[#0a0a0a]"
      style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" }}
    >
      <nav className="sticky top-0 z-40 border-b border-gray-100 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 text-base font-semibold text-[#0a0a0a]">
            <span>🤖</span>
            <span>CypAI</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/pricing" className="hidden text-sm text-gray-500 hover:text-[#0a0a0a] sm:block">
              Pricing
            </Link>
            <Link href="/login" className="hidden text-sm text-gray-500 hover:text-[#0a0a0a] sm:block">
              Log In
            </Link>
            <Link href="/signup?plan=pro" className="rounded-full bg-black px-5 py-2 text-sm font-medium text-white hover:bg-[#1a1a1a]">
              Start Free Trial
            </Link>
          </div>
        </div>
      </nav>

      <section className="bg-white py-24 lg:py-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center">
            <p className="text-xs font-medium uppercase tracking-widest text-gray-400">Contact</p>
            <h1 className="mt-4 text-5xl font-black leading-none tracking-tight text-[#0a0a0a] sm:text-6xl">
              Let&apos;s Talk About Your Business
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-500">
              We help businesses across Cyprus set up AI chat, lead capture, bookings, and follow-ups in days, not months.
            </p>
          </div>

          <div className="mt-16 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-2xl border border-gray-200 bg-white p-8">
              {submitted ? (
                <div className="py-10 text-center">
                  <p className="text-xs font-medium uppercase tracking-widest text-gray-400">Message Sent</p>
                  <h2 className="mt-3 text-3xl font-black leading-tight text-[#0a0a0a]">Your email draft is ready</h2>
                  <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-gray-500">
                    Your email app should be open now. If not, send us directly at{' '}
                    <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-[#0a0a0a] underline">
                      {CONTACT_EMAIL}
                    </a>
                    .
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="mt-8 rounded-full border border-gray-300 px-6 py-2.5 text-sm font-semibold text-gray-700 hover:border-gray-400"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <p className="text-xs font-medium uppercase tracking-widest text-gray-400">Send a Message</p>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Your Name" required>
                      <input
                        name="name"
                        type="text"
                        required
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Ahmed Yilmaz"
                        className="h-12 w-full rounded-full border border-gray-300 px-4 text-sm text-[#0a0a0a] outline-none focus:border-black"
                      />
                    </Field>
                    <Field label="Email Address" required>
                      <input
                        name="email"
                        type="email"
                        required
                        value={form.email}
                        onChange={handleChange}
                        placeholder="you@business.com"
                        className="h-12 w-full rounded-full border border-gray-300 px-4 text-sm text-[#0a0a0a] outline-none focus:border-black"
                      />
                    </Field>
                  </div>

                  <Field label="Business Name">
                    <input
                      name="businessName"
                      type="text"
                      value={form.businessName}
                      onChange={handleChange}
                      placeholder="My Business"
                      className="h-12 w-full rounded-full border border-gray-300 px-4 text-sm text-[#0a0a0a] outline-none focus:border-black"
                    />
                  </Field>

                  <Field label="Message" required>
                    <textarea
                      name="message"
                      required
                      rows={6}
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Tell us what you want to automate first..."
                      className="w-full resize-none rounded-3xl border border-gray-300 px-4 py-3 text-sm text-[#0a0a0a] outline-none focus:border-black"
                    />
                  </Field>

                  <button
                    type="submit"
                    className="w-full rounded-full bg-black py-3.5 text-sm font-semibold text-white hover:bg-[#1a1a1a]"
                  >
                    Send Message
                  </button>
                </form>
              )}
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
                <p className="text-xs font-medium uppercase tracking-widest text-gray-400">Direct Contact</p>
                <a href={`mailto:${CONTACT_EMAIL}`} className="mt-4 block text-sm font-semibold text-[#0a0a0a] underline">
                  {CONTACT_EMAIL}
                </a>
                <a href={WA_LINK} target="_blank" rel="noreferrer" className="mt-2 block text-sm font-semibold text-[#0a0a0a]">
                  {WA_NUMBER}
                </a>
                <p className="mt-2 text-sm text-gray-500">Nicosia, Northern Cyprus 🇨🇾</p>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-6">
                <p className="text-xs font-medium uppercase tracking-widest text-gray-400">Fastest Option</p>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">
                  For immediate support, message us on WhatsApp. We usually reply within 1 hour.
                </p>
                <a
                  href={WA_LINK}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex rounded-full border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:border-gray-400"
                >
                  Chat on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function Field({
  label,
  required,
  children,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-medium uppercase tracking-widest text-gray-400">
        {label} {required ? '*' : ''}
      </span>
      {children}
    </label>
  )
}
