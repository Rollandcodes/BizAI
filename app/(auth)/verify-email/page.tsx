'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Cpu, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react'

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-background relative flex flex-col items-center justify-center p-6 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(184,255,71,0.03)_0%,transparent_70%)]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="p-10 border-white/10 glass text-center shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 mx-auto mb-8 relative">
            <Mail className="w-10 h-10 text-primary" />
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: 'spring' }}
              className="absolute -bottom-1 -right-1 bg-background rounded-full p-1"
            >
              <CheckCircle2 className="w-6 h-6 text-primary fill-background" />
            </motion.div>
          </div>

          <h1 className="text-3xl font-bold font-display mb-4">Check your email</h1>
          <p className="text-white/60 leading-relaxed mb-8">
            We've sent a verification link to your email address. 
            Once verified, your neural agent will be ready for its first calibration.
          </p>

          <div className="space-y-4">
            <Link href="/login" className="block w-full">
              <Button className="w-full h-12 shadow-[0_0_20px_rgba(184,255,71,0.2)]">
                Back to Log In
              </Button>
            </Link>
            <button className="text-sm font-medium text-white/40 hover:text-white transition-colors">
              Didn't receive code? Resend
            </button>
          </div>
        </Card>

        <Link href="/" className="mt-8 flex items-center gap-2 justify-center text-white/30 hover:text-white transition-colors group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Return to Landing Page</span>
        </Link>
      </motion.div>
    </div>
  )
}
