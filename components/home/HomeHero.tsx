'use client'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function HomeHero() {
  return (
    <div className="relative pt-32 pb-20 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-white/5 mb-8"
        >
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-xs font-semibold uppercase tracking-widest text-white/70">
            Powered by Anti-Gravity Intelligence
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-6xl md:text-8xl font-bold font-display tracking-tightest leading-[1.1] mb-6"
        >
          Automate Conversations <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_auto] animate-glow">
            At Scale. Period.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto text-lg md:text-xl text-white/60 mb-10 leading-relaxed"
        >
          The smartest AI customer service agent for Cyprus & MENA. 
          Support English, Arabic, and Turkish 24/7 with zero overhead. 
          <span className="text-white block mt-2 font-medium">Free forever for ambitious businesses.</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/signup">
            <Button size="lg" className="w-full sm:w-auto h-14 px-10 text-lg group shadow-[0_0_30px_rgba(184,255,71,0.2)]">
              Build Your Agent Free
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="#demo">
            <Button variant="glass" size="lg" className="w-full sm:w-auto h-14 px-10 text-lg">
              Watch Demo
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Background Orbs */}
      <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-secondary/10 blur-[120px] rounded-full pointer-events-none" />
    </div>
  )
}
