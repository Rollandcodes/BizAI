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
    const subject = encodeURIComponent(`CypAI Inquiry from ${form.name} â€” ${form.businessName}`)
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\nBusiness: ${form.businessName}\n\nMessage:\n${form.message}`
    )
    window.open(`mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`, '_blank')
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <nav className="sticky top-0 z-40 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 text-base font-semibold text-white">
            <span>ðŸ¤–</span>
            <span>CypAI</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/pricing" className="hidden text-sm text-zinc-400 hover:text-white sm:block">
              Pricing
            </Link>
            <Link href="/login" className="hidden text-sm text-zinc-400 hover:text-white sm:block">
              Log In
            </Link>
            <Link href="/signup?plan=pro" className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/25">
              Start Free Trial
            </Link>
          </div>
        </div>
      </nav>

      <section className="bg-zinc-950 py-24 lg:py-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center">
            <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">Contact</p>
            <h1 className="mt-4 text-5xl font-black leading-none tracking-tight text-white sm:text-6xl">
              Let&apos;s Talk About Your Business
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400">
              We help businesses across Cyprus set up AI chat, lead capture, bookings, and follow-ups in days, not months.
            </p>
          </div>

          <div className="mt-16 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8">
              {submitted ? (
                <div className="py-10 text-center">
                  <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">Message Sent</p>
                  <h2 className="mt-3 text-3xl font-black leading-tight text-white">Your email draft is ready</h2>
                  <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-zinc-400">
                    Your email app should be open now. If not, send us directly at{' '}
                    <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-white underline">
                      {CONTACT_EMAIL}
                    </a>
                    .
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="mt-8 rounded-xl border border-zinc-700 px-6 py-2.5 text-sm font-semibold text-zinc-200 hover:border-zinc-600"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">Send a Message</p>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Your Name" required>
                      <input
                        name="name"
                        type="text"
                        required
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Ahmed Yilmaz"
                        className="h-12 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 text-sm text-zinc-100 outline-none focus:border-blue-500"
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
                        className="h-12 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 text-sm text-zinc-100 outline-none focus:border-blue-500"
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
                      className="h-12 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 text-sm text-zinc-100 outline-none focus:border-blue-500"
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
                      className="w-full resize-none rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none focus:border-blue-500"
                    />
                  </Field>

                  <button
                    type="submit"
                    className="w-full rounded-xl bg-blue-600 py-3.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/25"
                  >
                    Send Message
                  </button>
                </form>
              )}
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
                <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">Direct Contact</p>
                <a href={`mailto:${CONTACT_EMAIL}`} className="mt-4 block text-sm font-semibold text-white underline">
                  {CONTACT_EMAIL}
                </a>
                <a href={WA_LINK} target="_blank" rel="noreferrer" className="mt-2 block text-sm font-semibold text-white">
                  {WA_NUMBER}
                </a>
                <p className="mt-2 text-sm text-zinc-400">Nicosia, Northern Cyprus ðŸ‡¨ðŸ‡¾</p>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
                <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">Fastest Option</p>
                <p className="mt-3 text-sm leading-relaxed text-zinc-300">
                  For immediate support, message us on WhatsApp. We usually reply within 1 hour.
                </p>
                <a
                  href={WA_LINK}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex rounded-xl border border-zinc-700 px-5 py-2.5 text-sm font-semibold text-zinc-200 hover:border-zinc-600"
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
      <span className="mb-2 block text-xs font-medium uppercase tracking-widest text-zinc-500">
        {label} {required ? '*' : ''}
      </span>
      {children}
    </label>
  )
}


