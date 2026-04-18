'use client'

import { useState, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, BadgeDollarSign, Check, ShieldCheck, TrendingUp } from 'lucide-react'

import HeroScene from '@/components/home/HeroScene'
import LiveLabDemo from '@/components/home/LiveLabDemo'

const investorSignals = [
  { value: '70%', label: 'Lower medical costs vs. Europe' },
  { value: '2026', label: 'Residency visa logic built into the AI flow' },
  { value: '90%', label: 'Lead response rate improvement on off-peak enquiries' },
]

const featureHighlights = [
  '2026 Law-Compliant Responses',
  'Multilingual Triage (RU / TR / EN / AR / DE)',
  'Revenue Recovery for missed international leads',
  'WhatsApp + website qualification in one workflow',
]

const sectorOptions = [
  { value: 'medical_tourism', label: 'Medical Tourism (IVF/Dental/Aesthetics)' },
  { value: 'real_estate_residency', label: 'High-Yield Real Estate & Residency' },
  { value: 'clinic_agency', label: 'Clinic / Agency' },
  { value: 'other', label: 'Other' },
]

export default function Home() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#050510] font-sans text-white">
      <HeroScene />

      <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-8">
        <Link href="/" className="group flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-electric-lime transition-transform group-hover:rotate-12 glow-lime" />
          <span className="font-display text-2xl font-bold tracking-tighter">CypAI</span>
        </Link>
        <div className="hidden items-center gap-8 text-sm font-medium text-white/80 md:flex">
          <Link href="#features" className="transition-colors hover:text-white">Features</Link>
          <Link href="#why-northern-cyprus" className="transition-colors hover:text-white">Why Northern Cyprus?</Link>
          <Link href="#lab" className="transition-colors hover:text-white">Lab</Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/sign-in" className="text-sm font-medium text-white/80 transition-colors hover:text-white">Login</Link>
          <Link href="/demo" className="btn-primary rounded-full px-6 py-2">Book Demo</Link>
        </div>
      </nav>

      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-24 pt-16 text-center md:pt-20">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/5 bg-white/5 px-4 py-2 animate-slide-up">
          <span className="h-2 w-2 rounded-full bg-electric-lime animate-pulse" />
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-white/60">Revenue Recovery Engine · TRNC 2026</span>
        </div>

        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:text-left">
          <div className="space-y-8">
            <h1 className="max-w-4xl text-5xl font-display font-bold leading-[0.9] tracking-tighter text-white md:text-7xl animate-slide-up [animation-delay:100ms]">
              The AI Engine Powering the Mediterranean’s Medical & Property Corridor.
            </h1>
            <p className="max-w-3xl text-lg leading-8 text-white/78 animate-slide-up [animation-delay:200ms]">
              CypAI automates high-intent lead qualification in 5 languages, specialized in the 2026 TRNC Property Laws and Medical Tourism Triage.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start animate-slide-up [animation-delay:300ms]">
              <Link href="/demo" className="btn-primary w-full rounded-full px-8 py-4 text-base sm:w-auto">
                Book a Demo for your Clinic/Agency
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="#why-northern-cyprus" className="btn-ghost w-full rounded-full px-8 py-4 text-base sm:w-auto">
                View the 2026 Market Analysis
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-3 animate-slide-up [animation-delay:400ms]">
              {investorSignals.map((item) => (
                <div key={item.label} className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 text-left backdrop-blur-sm">
                  <p className="text-3xl font-display font-bold text-white">{item.value}</p>
                  <p className="mt-2 text-sm leading-6 text-white/68">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-darker border border-white/10 p-1 text-left shadow-2xl shadow-black/30 animate-slide-up [animation-delay:300ms]">
            <div className="rounded-[22px] bg-[#070b16]/90 p-6 md:p-8">
              {submitted ? (
                <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center gap-4 py-8 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-electric-lime text-space-black glow-lime">
                    <Check className="h-8 w-8" />
                  </div>
                  <h4 className="text-2xl font-display font-bold">Brief Requested</h4>
                  <p className="max-w-sm text-sm leading-7 text-white/55">One of our commercial strategists in Girne will reach out within 24 hours.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="ml-4 font-mono text-[10px] uppercase tracking-widest text-white/70">Full Name</label>
                    <input required type="text" placeholder="e.g. Ahmet Turk" className="w-full rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm transition-colors focus:border-electric-lime focus:outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="ml-4 font-mono text-[10px] uppercase tracking-widest text-white/70">Company / Agency</label>
                    <input required type="text" placeholder="e.g. Girne IVF Center" className="w-full rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm transition-colors focus:border-electric-lime focus:outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="business-type" className="ml-4 font-mono text-[10px] uppercase tracking-widest text-white/70">Business Type</label>
                    <select id="business-type" className="w-full appearance-none rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm transition-colors focus:border-electric-lime focus:outline-none">
                      {sectorOptions.map((option) => (
                        <option key={option.value} value={option.value} className="bg-white text-black">{option.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="ml-4 font-mono text-[10px] uppercase tracking-widest text-white/70">Phone / WhatsApp</label>
                    <input required type="tel" placeholder="+90 5xx xxx xx xx" className="w-full rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm transition-colors focus:border-electric-lime focus:outline-none" />
                  </div>
                  <button type="submit" className="btn-primary mt-4 w-full rounded-full py-4 text-sm">Request Private Briefing</button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="relative z-10 mx-auto max-w-7xl border-t border-white/5 px-6 py-16">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-display font-bold md:text-4xl">Built for high-ticket revenue recovery</h2>
          <p className="mx-auto mt-3 max-w-3xl text-white/75">CypAI is tuned for the enquiries that matter most in the TRNC market: buyers, patients, and investors who are ready to act.</p>
        </div>
        <div className="grid gap-3 md:grid-cols-4">
          {featureHighlights.map((item) => (
            <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-center text-sm font-medium text-white/88">{item}</div>
          ))}
        </div>
      </section>

      <section id="why-northern-cyprus" className="relative z-10 mx-auto max-w-7xl border-t border-white/5 px-6 py-20 md:py-24">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="space-y-4">
            <p className="text-xs font-mono uppercase tracking-[0.28em] text-white/55">Why Northern Cyprus?</p>
            <h2 className="max-w-xl text-3xl font-display font-bold md:text-4xl">The unfair advantage is timing, pricing, and policy</h2>
            <p className="max-w-xl leading-8 text-white/72">International demand is rising, competition is fragmented, and the market still leaks revenue through slow replies, language gaps, and outdated qualification flows.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-electric-lime/15 text-electric-lime"><BadgeDollarSign className="h-6 w-6" /></div>
              <p className="text-3xl font-display font-bold text-white">70%</p>
              <p className="mt-2 text-sm leading-7 text-white/70">Lower medical costs vs. Europe.</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-electric-lime/15 text-electric-lime"><ShieldCheck className="h-6 w-6" /></div>
              <p className="text-3xl font-display font-bold text-white">2026</p>
              <p className="mt-2 text-sm leading-7 text-white/70">New 2025/2026 5-Year Residency Visa Laws integrated into AI logic.</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-electric-lime/15 text-electric-lime"><TrendingUp className="h-6 w-6" /></div>
              <p className="text-3xl font-display font-bold text-white">90%</p>
              <p className="mt-2 text-sm leading-7 text-white/70">Lead response rate improvement for off-peak international inquiries.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="lab" className="relative z-10 mx-auto max-w-7xl border-t border-white/5 px-6"><LiveLabDemo /></section>

      <section id="pricing" className="relative z-10 mx-auto max-w-7xl border-t border-white/5 px-6 py-20">
        <div className="mx-auto max-w-4xl rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 text-center shadow-2xl shadow-black/30 md:p-12">
          <h2 className="text-3xl font-display font-bold md:text-4xl">Ready to recover more revenue from every inquiry?</h2>
          <p className="mx-auto mt-4 max-w-2xl leading-8 text-white/74">CypAI helps your clinic or agency respond faster, qualify better, and stay aligned with the 2026 TRNC market reality.</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/demo" className="btn-primary w-full rounded-full px-8 py-4 text-base sm:w-auto">Book a Demo for your Clinic/Agency</Link>
            <Link href="#why-northern-cyprus" className="btn-ghost w-full rounded-full px-8 py-4 text-base sm:w-auto">View the 2026 Market Analysis</Link>
          </div>
        </div>
      </section>

      <footer className="relative z-10 mx-auto max-w-7xl border-t border-white/5 px-6 py-20 text-center sm:text-left">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2"><div className="h-6 w-6 rounded bg-electric-lime glow-lime" /><span className="font-display text-lg font-bold">CypAI</span></Link>
            <p className="text-sm text-white/40">Revenue recovery for medical tourism and residency-led property teams in the TRNC.</p>
          </div>
          <div>
            <h4 className="mb-4 font-display text-[10px] font-bold uppercase tracking-widest text-white/70">Product</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link href="#features">Agent Packs</Link></li>
              <li><Link href="#lab">Live Lab</Link></li>
              <li><Link href="/sign-up">Book a Demo</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-display text-[10px] font-bold uppercase tracking-widest text-white/70">Localized</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li>Kyrenia/Girne</li>
              <li>Nicosia/Lefkoşa</li>
              <li>Famagusta/Mağusa</li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-display text-[10px] font-bold uppercase tracking-widest text-white/70">Company</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li>Terms of Service</li>
              <li>Privacy Engine</li>
            </ul>
          </div>
        </div>
        <div className="mt-20 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 text-[10px] uppercase tracking-widest text-white/20 sm:flex-row">
          <p>© 2024 CYPAI NEURAL SYSTEMS. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-8"><span className="text-electric-lime/40">LEFKE CAMPUS OPS</span><span>SYSTEM STATUS: OPTIMAL</span></div>
        </div>
      </footer>
    </main>
  )
}