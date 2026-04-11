'use call client'
import { motion } from 'framer-motion'
import { XCircle, CheckCircle2, Zap, Clock, Users, Globe } from 'lucide-react'
import { Card } from '@/components/ui/card'

const problems = [
  { text: 'Missing leads outside business hours', icon: <Clock className="text-red-400" /> },
  { text: 'High costs of manual support team', icon: <Users className="text-red-400" /> },
  { text: 'Language barriers in English/Arabic/Turkish', icon: <Globe className="text-red-400" /> },
]

const solutions = [
  { text: '24/7 instant response across all timezones', icon: <Zap className="text-primary" /> },
  { text: 'Reduce operational costs by up to 80%', icon: <Zap className="text-primary" /> },
  { text: 'Native multilingual support built-in', icon: <Zap className="text-primary" /> },
]

export default function ProblemSolution() {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Problem Side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold uppercase">
              The Problem
            </div>
            <h2 className="text-4xl md:text-5xl font-bold font-display leading-tight">
              Traditional support is <br />
              <span className="text-white/40 italic">slow and expensive.</span>
            </h2>
            <div className="space-y-4">
              {problems.map((p, i) => (
                <div key={i} className="flex items-center gap-4 group">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-500/5 flex items-center justify-center border border-red-500/10 group-hover:border-red-500/40 transition-colors">
                    <XCircle className="w-5 h-5 text-red-500/50" />
                  </div>
                  <p className="text-lg text-white/50">{p.text}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Solution Side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <Card className="p-8 md:p-12 relative overflow-hidden border-primary/20 bg-primary/[0.02]">
              <div className="absolute top-0 right-0 p-4">
                <div className="w-20 h-20 bg-primary/10 blur-[40px] rounded-full" />
              </div>
              
              <div className="space-y-8 relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase">
                  The CypAI Solution
                </div>
                <h2 className="text-4xl md:text-5xl font-bold font-display leading-tight">
                  Intelligent automation <br />
                  <span className="text-primary text-glow-lime">built for Cyprus.</span>
                </h2>
                <div className="space-y-6">
                  {solutions.map((s, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-xl glass-lime flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6 text-primary" />
                      </div>
                      <p className="text-lg text-white/90 font-medium pt-1">{s.text}</p>
                    </div>
                  ))}
                </div>
                
                <div className="pt-4">
                  <div className="h-[1px] w-full bg-gradient-to-r from-primary/5 via-primary/20 to-transparent" />
                  <p className="mt-4 text-sm text-white/40">
                    Average deployment time: <span className="text-primary font-bold">15 Minutes</span>
                  </p>
                </div>
              </div>
            </Card>
            
            {/* Ambient solution glow */}
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-primary/5 blur-[100px] rounded-full -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
