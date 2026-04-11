'use client'
import { motion } from 'framer-motion'
import { Webhook, BrainCircuit, Rocket } from 'lucide-react'

const steps = [
  {
    title: 'Connect Channels',
    description: 'Link your WhatsApp, Instagram, and Website in one click using our secure connectors.',
    icon: <Webhook className="w-8 h-8" />,
  },
  {
    title: 'Neural Training',
    description: 'Upload your documents or sync your website. Our AI builds a custom knowledge brain tailored to you.',
    icon: <BrainCircuit className="w-8 h-8" />,
  },
  {
    title: 'Go Live',
    description: 'Deploy your agent and watch your automation metrics soar. 24/7 coverage, zero effort.',
    icon: <Rocket className="w-8 h-8" />,
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20 space-y-4">
          <h2 className="text-4xl md:text-6xl font-bold font-display tracking-tight">
            Three steps to <br />
            <span className="text-primary text-glow-lime">total automation.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-12 relative">
          {/* Connecting Lines (Desktop) */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-y-1/2 -z-10" />
          
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="flex flex-col items-center text-center space-y-6 group"
            >
              <div className="relative">
                <div className="w-20 h-20 rounded-full glass border-white/10 flex items-center justify-center text-white/50 group-hover:text-primary group-hover:border-primary/50 transition-all duration-500">
                  {step.icon}
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm shadow-[0_0_15px_rgba(184,255,71,0.5)]">
                  {i + 1}
                </div>
                
                {/* Glow behind icon */}
                <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-2xl font-bold font-display text-white group-hover:text-primary transition-colors">
                  {step.title}
                </h3>
                <p className="text-white/50 max-w-[250px] mx-auto text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
