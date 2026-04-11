'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { Search, ArrowRight } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      window.location.href = '/dashboard'
    }
  }

  return (
    <div className="min-h-screen bg-[#050510] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-electric-lime/10 blur-[120px] rounded-full pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
            <div className="w-10 h-10 bg-electric-lime rounded-xl glow-lime flex items-center justify-center">
              <div className="w-2 h-2 bg-space-black rounded-full" />
            </div>
            <span className="font-display text-3xl font-bold tracking-tighter text-white">CypAI</span>
          </Link>
          <h2 className="text-2xl font-display font-medium text-white/90">Welcome to the Pulse</h2>
          <p className="text-white/40 text-sm mt-2">Manage your neural agents and lead streams</p>
        </div>

        <div className="glass p-1 border-white/10">
          <div className="bg-[#050510]/80 p-8 rounded-[14px] space-y-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-white/40 font-mono ml-4">Neural Identifier</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@business.com"
                  className="w-full bg-white/5 border border-white/10 rounded-full py-3 px-6 text-sm focus:outline-none focus:border-electric-lime transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-4">
                  <label className="text-[10px] uppercase tracking-widest text-white/40 font-mono">Secret Key</label>
                  <Link href="#" className="text-[10px] text-white/20 hover:text-white transition-colors">Forgot Key?</Link>
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-full py-3 px-6 text-sm focus:outline-none focus:border-electric-lime transition-all"
                  required
                />
              </div>

              {error && (
                <p className="text-xs text-red-400 text-center font-mono uppercase tracking-tight">{error}</p>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="w-full btn-primary py-4 text-sm mt-2 group flex items-center justify-center gap-2"
              >
                {loading ? 'Decrypting...' : 'Enter Console'}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/5" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-[0.2em]">
                <span className="bg-[#050510] px-4 text-white/20">or deploy new</span>
              </div>
            </div>

            <Link href="/signup" className="w-full block text-center py-3 rounded-full border border-white/10 text-white/60 text-sm hover:bg-white/5 transition-colors">
              Request Neural Access
            </Link>
          </div>
        </div>

        <p className="text-center mt-8 text-[10px] text-white/20 uppercase tracking-[0.3em] font-mono">
          Secured by CypAI Security Engine
        </p>
      </motion.div>
    </div>
  )
}
