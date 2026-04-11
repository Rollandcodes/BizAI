'use client'
import { motion } from 'framer-motion'
import { 
  User, 
  Building, 
  CreditCard, 
  Shield, 
  Bell, 
  Globe, 
  Save,
  ArrowRight,
  Sparkles
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

export default function SettingsPage() {
  return (
    <div className="space-y-8 relative z-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-display tracking-tightest">Settings</h1>
          <p className="text-white/40 text-sm">Manage your account, billing, and organizational security</p>
        </div>
        <Button variant="primary" className="h-10 px-6">
          <Save className="w-4 h-4 mr-2" /> Save Settings
        </Button>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        <div className="space-y-2">
          {[
            { label: 'General', icon: Building, active: true },
            { label: 'Account', icon: User, active: false },
            { label: 'Billing & Plan', icon: CreditCard, active: false },
            { label: 'Security', icon: Shield, active: false },
            { label: 'Notifications', icon: Bell, active: false },
            { label: 'Localization', icon: Globe, active: false },
          ].map((item) => (
            <button
              key={item.label}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left',
                item.active 
                  ? 'bg-primary/10 text-primary border border-primary/20' 
                  : 'text-white/40 hover:text-white hover:bg-white/5 border border-transparent'
              )}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </div>

        <div className="lg:col-span-3 space-y-8">
          <Card className="border-white/5 bg-white/[0.01]">
            <CardHeader><CardTitle>Organization Profile</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Input label="Company Name" defaultValue="Limassol Luxury Suites" />
                <Input label="Industry" defaultValue="Real Estate / Hospitality" />
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <Input label="Website" defaultValue="https://limassol-suites.cy" />
                <Input label="Tax ID (optional)" placeholder="e.g. CY10092831" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/70 ml-1">Company Address</label>
                <textarea 
                  className="w-full h-24 bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-primary/50 transition-all resize-none font-medium"
                  defaultValue="Makarios III Ave 12, Office 302, Limassol, 3025, Cyprus"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-primary/[0.01]">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="text-primary w-5 h-5" /> Current Subscription
                </CardTitle>
                <Badge variant="success" className="bg-primary/20 text-primary border-none">Active</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-6 rounded-2xl glass border-primary/10">
                <div className="space-y-1">
                  <p className="text-lg font-bold font-display">CypAI Scale Plan</p>
                  <p className="text-xs text-white/40">Unlimited neural operations for Cyprus SMBs</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold font-display text-primary">€0.00 <span className="text-white/20 text-sm">/mo</span></p>
                  <p className="text-[10px] text-primary uppercase tracking-widest font-bold">Free Forever</p>
                </div>
              </div>
              <div className="mt-8 flex justify-end">
                <Button variant="ghost" className="text-white/40 border-white/10">Manage Billing on Stripe</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-500/10 bg-red-500/[0.01]">
            <CardHeader><CardTitle className="text-red-400">Danger Zone</CardTitle></CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold">Delete Organization</p>
                  <p className="text-xs text-white/40">Permanently remove all agents, data, and training knowledge.</p>
                </div>
                <Button variant="danger" className="bg-red-500/10 border-red-500/20 text-red-500 hover:bg-red-500/20">Delete Account</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}
