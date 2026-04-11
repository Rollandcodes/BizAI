'use client'
import { motion } from 'framer-motion'
import { Landmark, ShoppingBag, Utensils, Hotel, Car, Briefcase } from 'lucide-react'

const partners = [
  { name: 'Phileleftheros', icon: <Briefcase className="w-5 h-5" /> },
  { name: 'Bank of Cyprus', icon: <Landmark className="w-5 h-5" /> },
  { name: 'Columbia Ship', icon: <Car className="w-5 h-5" /> }, // Generic car for ship/logistics
  { name: 'Zorbas Bakeries', icon: <Utensils className="w-5 h-5" /> },
  { name: 'City of Dreams', icon: <Hotel className="w-5 h-5" /> },
  { name: 'SuperHome Center', icon: <ShoppingBag className="w-5 h-5" /> },
]

export default function LogoCloud() {
  return (
    <div className="py-20 bg-background relative overflow-hidden border-y border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-center text-sm font-semibold uppercase tracking-widest text-white/30 mb-12">
          Trusted by market leaders in Cyprus & MENA
        </p>
        
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-10">
          {partners.map((partner, i) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all cursor-crosshair"
            >
              <div className="w-10 h-10 rounded-lg glass border-white/10 flex items-center justify-center text-white/50 group-hover:text-primary">
                {partner.icon}
              </div>
              <span className="text-lg font-display font-medium text-white/60 tracking-tight">
                {partner.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Dynamic line effect */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
    </div>
  )
}
