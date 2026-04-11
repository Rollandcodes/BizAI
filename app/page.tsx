'use client'

import { useState } from 'react'
import HeroScene from '@/components/home/HeroScene'
import LiveLabDemo from '@/components/home/LiveLabDemo'
import Link from 'next/link'
import { Check } from 'lucide-react'

export default function Home() {
  const [submitted, setSubmitted] = useState(false)
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    // In production, this would insert into custom_build_requests
  }

  return (
    <main className="relative min-h-screen bg-[#050510] text-white overflow-x-hidden font-sans">
      {/* 3D Neural Background */}
      <HeroScene />

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-8 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-electric-lime rounded-lg glow-lime group-hover:rotate-12 transition-transform" />
          <span className="font-display text-2xl font-bold tracking-tighter">CypAI</span>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/60">
          <Link href="#features" className="hover:text-white transition-colors">Agents</Link>
          <Link href="#lab" className="hover:text-white transition-colors">Lab</Link>
          <Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-white/60 hover:text-white transition-colors">
            Login
          </Link>
          <Link href="/signup" className="btn-primary py-2 px-6">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-32 px-6 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-white/5 bg-white/5 mb-8 animate-slide-up">
          <span className="w-2 h-2 rounded-full bg-electric-lime animate-pulse" />
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-white/60">Version 3.0 Neural Rebuild</span>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-display font-bold tracking-tighter leading-[0.9] mb-8 animate-slide-up [animation-delay:100ms]">
          Sales Agents <br />
          <span className="text-gradient-lime">Born in Cyprus</span>
        </h1>
        
        <p className="max-w-2xl mx-auto text-lg text-white/60 font-sans mb-12 animate-slide-up [animation-delay:200ms]">
          The first AI sales ecosystem designed for the Northern Cyprus market. 
          Capture, qualify, and convert leads across WhatsApp, Instagram, and Web 24/7.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up [animation-delay:300ms]">
          <Link href="/signup" className="btn-primary w-full sm:w-auto text-lg">
            Deploy Your Agent Free
          </Link>
          <Link href="#lab" className="btn-ghost w-full sm:w-auto text-lg px-8 py-3">
            Enter Live Lab
          </Link>
        </div>

        {/* Neural Bridge Form (Section 2) */}
        <div className="mt-32 max-w-4xl mx-auto animate-slide-up [animation-delay:400ms]">
          <div className="glass p-1 border-white/10 overflow-hidden">
            <div className="bg-[#050510]/80 p-8 md:p-12 rounded-[14px]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="text-left space-y-4">
                  <h3 className="text-3xl font-display font-bold">Neural <span className="text-electric-lime">Bridge</span></h3>
                  <p className="text-white/60 text-sm">
                    Want a custom enterprise agent built for your multi-location business? Our engineering team builds advanced neural bridges for complex operations in Lefke, Girne, and Magusa.
                  </p>
                  <ul className="space-y-2 text-xs font-mono text-white/40 uppercase tracking-widest">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-electric-lime" /> Custom Training
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-electric-lime" /> CRM Sync
                    </li>
                  </ul>
                </div>
                
                {submitted ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="md:col-span-1 flex flex-col items-center justify-center text-center space-y-4"
                  >
                    <div className="w-16 h-16 rounded-full bg-electric-lime flex items-center justify-center text-space-black glow-lime">
                      <Check className="w-8 h-8" />
                    </div>
                    <h4 className="text-xl font-display font-bold">Transmission Received</h4>
                    <p className="text-white/40 text-sm">One of our Neural Architects in Girne will reach out to you within 24 hours.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4 text-left">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-white/40 font-mono ml-4">Full Name</label>
                      <input 
                        required
                        type="text" 
                        placeholder="e.g. Ahmet Turk"
                        className="w-full bg-white/5 border border-white/10 rounded-full py-3 px-6 text-sm focus:outline-none focus:border-electric-lime transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-white/40 font-mono ml-4">Business Type</label>
                      <select className="w-full bg-white/5 border border-white/10 rounded-full py-3 px-6 text-sm focus:outline-none focus:border-electric-lime transition-colors appearance-none">
                        <option>Real Estate Agency</option>
                        <option>Restaurant Group</option>
                        <option>Car Rental</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-white/40 font-mono ml-4">Phone / WhatsApp</label>
                      <input 
                        required
                        type="tel" 
                        placeholder="+90 5xx xxx xx xx"
                        className="w-full bg-white/5 border border-white/10 rounded-full py-3 px-6 text-sm focus:outline-none focus:border-electric-lime transition-colors"
                      />
                    </div>
                    <button type="submit" className="w-full btn-primary py-4 text-sm mt-4">
                      Request Build Quote
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lab Section */}
      <section id="lab" className="relative z-10 px-6 max-w-7xl mx-auto border-t border-white/5">
        <LiveLabDemo />
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-20 px-6 max-w-7xl mx-auto border-t border-white/5 text-center sm:text-left">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-6 h-6 bg-electric-lime rounded glow-lime" />
              <span className="font-display text-lg font-bold">CypAI</span>
            </Link>
            <p className="text-white/40 text-sm">
              The neural intelligence for Northern Cyprus. Scale your sales with the power of localized AI.
            </p>
          </div>
          <div>
            <h4 className="font-display font-bold mb-4 uppercase text-[10px] tracking-widest text-white/60">Product</h4>
            <ul className="space-y-2 text-sm text-white/40">
              <li><Link href="#features">Agent Packs</Link></li>
              <li><Link href="#lab">Live Lab</Link></li>
              <li><Link href="/signup">Free Deployment</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display font-bold mb-4 uppercase text-[10px] tracking-widest text-white/60">Localized</h4>
            <ul className="space-y-2 text-sm text-white/40">
              <li>Kyrenia/Girne</li>
              <li>Nicosia/Lefkoşa</li>
              <li>Famagusta/Mağusa</li>
            </ul>
          </div>
          <div>
            <h4 className="font-display font-bold mb-4 uppercase text-[10px] tracking-widest text-white/60">Company</h4>
            <ul className="space-y-2 text-sm text-white/40">
              <li>Terms of Service</li>
              <li>Privacy Engine</li>
            </ul>
          </div>
        </div>
        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-widest text-white/20">
          <p>© 2024 CYPAI NEURAL SYSTEMS. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-8">
            <span className="text-electric-lime/40">LEFKE CAMPUS OPS</span>
            <span>SYSTEM STATUS: OPTIMAL</span>
          </div>
        </div>
      </footer>
    </main>
  )
}
