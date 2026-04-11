'use client'
import { motion } from 'framer-motion'
import { Globe, Database, MessageSquare, Headphones, BarChart3, ShieldCheck } from 'lucide-react'
import { Card } from '@/components/ui/card'

const features = [
  {
    title: 'Multilingual Mastery',
    description: 'Natively speak English, Arabic, and Turkish with perfect grammar and cultural nuance.',
    icon: <Globe className="w-8 h-8 text-primary" />,
    color: 'primary'
  },
  {
    title: 'Deep Knowledge Base',
    description: 'Upload your PDFs, URLs, or Docs. Your agent learns everything about your business in seconds.',
    icon: <Database className="w-8 h-8 text-secondary" />,
    color: 'secondary'
  },
  {
    title: 'Omnichannel Connect',
    description: 'One brain, everywhere. Connect to WhatsApp, Instagram, Messenger, and your Website.',
    icon: <MessageSquare className="w-8 h-8 text-primary" />,
    color: 'primary'
  },
  {
    title: 'Hybrid Intelligence',
    description: 'Smooth handoffs to human agents when complex situations arise. Never lose a personal touch.',
    icon: <Headphones className="w-8 h-8 text-secondary" />,
    color: 'secondary'
  },
  {
    title: 'Real-time Analytics',
    description: 'Track sentiment, resolution rates, and conversion metrics in a beautiful dashboard.',
    icon: <BarChart3 className="w-8 h-8 text-primary" />,
    color: 'primary'
  },
  {
    title: 'Enterprise Security',
    description: 'SOC2 compliant infrastructure with encrypted storage for your customer data.',
    icon: <ShieldCheck className="w-8 h-8 text-secondary" />,
    color: 'secondary'
  }
]

export default function FeaturesGrid() {
  return (
    <section id="features" className="py-24 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-primary text-xs font-bold uppercase tracking-[0.2em]"
          >
            Capabilities
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-bold font-display tracking-tight"
          >
            Everything you need <br />
            <span className="text-white/40">to automate customer success.</span>
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="h-full group">
                <div className="p-8 space-y-6">
                  <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center group-hover:bg-primary/5 transition-colors border-white/5">
                    {f.icon}
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold font-display tracking-tight group-hover:text-primary transition-colors">
                      {f.title}
                    </h3>
                    <p className="text-white/50 leading-relaxed text-sm">
                      {f.description}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
