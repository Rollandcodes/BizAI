'use client'
import { motion } from 'framer-motion'

const stats = [
  { label: 'Messages Processed', value: '1.2M+' },
  { label: 'Happy Businesses', value: '500+' },
  { label: 'Countries Covered', value: '12' },
  { label: 'Languages Supported', value: '3' },
  { label: 'Resolution Rate', value: '98%' },
  { label: 'Cost Savings', value: '80%' },
]

export default function StatsMarquee() {
  return (
    <div className="py-12 bg-primary overflow-hidden flex whitespace-nowrap border-y border-white/10">
      <motion.div
        animate={{ x: [0, -1000] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="flex gap-20 items-center px-10"
      >
        {[...stats, ...stats].map((stat, i) => (
          <div key={i} className="flex flex-col items-center">
            <span className="text-4xl md:text-5xl font-bold font-display text-primary-foreground tracking-tighter">
              {stat.value}
            </span>
            <span className="text-xs uppercase tracking-widest font-bold text-primary-foreground/60">
              {stat.label}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  )
}
