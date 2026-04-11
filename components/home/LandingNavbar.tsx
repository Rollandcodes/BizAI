'use client'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { Cpu } from 'lucide-react'

export default function LandingNavbar() {
  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 mx-auto max-w-7xl"
    >
      <div className="flex items-center gap-2 group cursor-pointer">
        <div className="relative">
          <Cpu className="text-primary w-8 h-8 transition-transform group-hover:rotate-90 duration-500" />
          <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full animate-pulse" />
        </div>
        <span className="text-xl font-bold font-display tracking-tightest">
          Cyp<span className="text-primary">AI</span>
        </span>
      </div>

      <div className="hidden md:flex items-center gap-8 glass px-8 py-2 rounded-full border-white/5">
        <Link href="#features" className="text-sm font-medium text-white/70 hover:text-primary transition-colors">Features</Link>
        <Link href="#how-it-works" className="text-sm font-medium text-white/70 hover:text-primary transition-colors">How it works</Link>
        <Link href="#demo" className="text-sm font-medium text-white/70 hover:text-primary transition-colors">Demo</Link>
        <Link href="#pricing" className="text-sm font-medium text-white/70 hover:text-primary transition-colors">Free Forever</Link>
      </div>

      <div className="flex items-center gap-4">
        <Link href="/login">
          <Button variant="ghost" size="sm" className="hidden sm:flex text-white/80 border-white/10">Log in</Button>
        </Link>
        <Link href="/signup">
          <Button variant="primary" size="sm" className="shadow-[0_0_15px_rgba(184,255,71,0.3)]">Get Started</Button>
        </Link>
      </div>
    </motion.nav>
  )
}
