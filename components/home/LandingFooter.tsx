'use client'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { Cpu, Github, Twitter, Linkedin, ArrowRight } from 'lucide-react'

export default function LandingFooter() {
  return (
    <footer className="relative pt-24 pb-12 overflow-hidden border-t border-white/5 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        {/* Final CTA Area */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative mb-24 rounded-[40px] glass p-12 md:p-20 text-center border-white/10 overflow-hidden"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-full bg-primary/5 blur-[120px] rounded-full -z-10" />
          
          <div className="relative z-10 space-y-8">
            <h2 className="text-4xl md:text-7xl font-bold font-display tracking-tightest">
              Ready to automate <br />
              <span className="text-primary">your support?</span>
            </h2>
            <p className="text-xl text-white/50 max-w-2xl mx-auto">
              Join 500+ ambitious businesses in Cyprus and MENA already using CypAI to scale their growth. Free forever.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup">
                <Button size="lg" className="h-16 px-12 text-xl shadow-[0_0_40px_rgba(184,255,71,0.2)]">
                  Start Building Free <ArrowRight className="ml-2 w-6 h-6" />
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Footer Grid */}
        <div className="grid md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-2 space-y-6">
            <div className="flex items-center gap-2">
              <Cpu className="text-primary w-8 h-8" />
              <span className="text-2xl font-bold font-display">Cyp<span className="text-primary">AI</span></span>
            </div>
            <p className="text-white/40 max-w-sm text-sm leading-relaxed">
              Anti-Gravity intelligence for the modern business. 
              Simplifying customer service automation across Cyprus and MENA.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:border-primary/40 hover:text-primary transition-all">
                <Twitter size={18} />
              </Link>
              <Link href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:border-primary/40 hover:text-primary transition-all">
                <Linkedin size={18} />
              </Link>
              <Link href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:border-primary/40 hover:text-primary transition-all">
                <Github size={18} />
              </Link>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="font-bold font-display uppercase tracking-widest text-xs text-white/60">Product</h4>
            <ul className="space-y-4 text-sm text-white/40">
              <li><Link href="#features" className="hover:text-primary transition-colors">Features</Link></li>
              <li><Link href="#demo" className="hover:text-primary transition-colors">Live Demo</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Channels</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">API</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="font-bold font-display uppercase tracking-widest text-xs text-white/60">Legal</h4>
            <ul className="space-y-4 text-sm text-white/40">
              <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Cookie Policy</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">GDPR Compliance</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-white/20">
            © 2026 CypAI. All rights reserved. Built with passion in Limassol.
          </p>
          <div className="flex gap-6 text-[10px] items-center text-white/10 uppercase tracking-widest font-bold">
            <span className="flex items-center gap-1">
              <div className="w-1 h-1 rounded-full bg-primary" /> System Global
            </span>
            <span className="flex items-center gap-1">
              <div className="w-1 h-1 rounded-full bg-primary" /> 99.9% Uptime
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
