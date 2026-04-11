'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { AGENT_PACKS, NicheType } from '@/lib/agentPacks'
import { ArrowRight, Check, ShieldCheck, Sparkles } from 'lucide-react'

export default function SignupPage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    businessName: '',
    niche: 'Real Estate' as NicheType
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { data: { user }, error: signupError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          business_name: formData.businessName,
          niche: formData.niche
        }
      }
    })

    if (signupError) {
      setError(signupError.message)
      setLoading(false)
      return
    }

    if (user) {
      // Redirect to onboarding or dashboard
      window.location.href = '/dashboard'
    }
  }

  return (
    <div className="min-h-screen bg-[#050510] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-blue/10 blur-[150px] rounded-full" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-electric-lime/5 blur-[150px] rounded-full" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-xl"
      >
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
            <div className="w-10 h-10 bg-electric-lime rounded-xl glow-lime flex items-center justify-center">
              <div className="w-2 h-2 bg-space-black rounded-full" />
            </div>
            <span className="font-display text-3xl font-bold tracking-tighter text-white">CypAI</span>
          </Link>
          <h2 className="text-2xl font-display font-medium text-white/90">Initialize Your Neural Agent</h2>
          <p className="text-white/40 text-sm mt-2">Deploy your first AI sales force in seconds</p>
        </div>

        <div className="glass p-1 border-white/10">
          <div className="bg-[#050510]/80 p-8 md:p-12 rounded-[14px]">
            <form onSubmit={handleSignup} className="space-y-8">
              <AnimatePresence mode="wait">
                {step === 1 ? (
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-white/40 font-mono ml-4">Business Name</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Girne Estates"
                          className="w-full bg-white/5 border border-white/10 rounded-full py-3 px-6 text-sm focus:outline-none focus:border-electric-lime transition-all"
                          value={formData.businessName}
                          onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-white/40 font-mono ml-4">Industry Niche</label>
                        <select 
                          className="w-full bg-white/5 border border-white/10 rounded-full py-3 px-6 text-sm focus:outline-none focus:border-electric-lime transition-all"
                          value={formData.niche}
                          onChange={(e) => setFormData({ ...formData, niche: e.target.value as NicheType })}
                        >
                          {Object.keys(AGENT_PACKS).map(n => (
                            <option key={n} value={n} className="text-black bg-white">{n}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-electric-lime/10 flex items-center justify-center shrink-0">
                        <Sparkles className="w-4 h-4 text-electric-lime" />
                      </div>
                      <p className="text-xs text-white/60 leading-relaxed font-sans mt-0.5">
                        <span className="text-white font-bold">Automatic Pack:</span> Based on your niche, we'll pre-train your agent with localized market intelligence.
                      </p>
                    </div>

                    <button 
                      type="button" 
                      onClick={() => setStep(2)}
                      className="w-full btn-primary py-4 text-sm group flex items-center justify-center gap-2"
                    >
                      Next: Access Credentials
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="step-2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-white/40 font-mono ml-4">Email Address</label>
                      <input 
                        type="email" 
                        placeholder="you@example.com"
                        className="w-full bg-white/5 border border-white/10 rounded-full py-3 px-6 text-sm focus:outline-none focus:border-electric-lime transition-all"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-white/40 font-mono ml-4">Password</label>
                      <input 
                        type="password" 
                        placeholder="At least 8 characters"
                        className="w-full bg-white/5 border border-white/10 rounded-full py-3 px-6 text-sm focus:outline-none focus:border-electric-lime transition-all"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                      />
                    </div>

                    <div className="flex items-center gap-3 ml-4">
                      <div className="w-4 h-4 rounded border border-white/20 flex items-center justify-center bg-electric-lime">
                        <Check className="w-3 h-3 text-space-black" />
                      </div>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest flex items-center gap-1">
                        I agree to Neural Terms <ShieldCheck className="w-3 h-3" />
                      </p>
                    </div>

                    {error && (
                      <p className="text-xs text-red-400 text-center font-mono">{error}</p>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <button 
                        type="button" 
                        onClick={() => setStep(1)}
                        className="py-4 text-xs font-mono uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors"
                      >
                        Back
                      </button>
                      <button 
                        type="submit" 
                        disabled={loading}
                        className="btn-primary py-4 text-sm flex items-center justify-center gap-2"
                      >
                        {loading ? 'Initializing...' : 'Deploy Now'}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>

            <div className="mt-8 text-center">
              <p className="text-xs text-white/40 font-sans">
                Already have access? <Link href="/login" className="text-electric-lime hover:underline">Log in to Console</Link>
              </p>
            </div>
          </div>
        </div>

        <p className="text-center mt-8 text-[10px] text-white/20 uppercase tracking-[0.3em] font-mono">
          © 2024 CYPAI NEURAL CORE
        </p>
      </motion.div>
    </div>
  )
}
