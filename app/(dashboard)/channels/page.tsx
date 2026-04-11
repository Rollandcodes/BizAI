'use client'
import { motion } from 'framer-motion'
import { 
  MessageSquare, 
  Instagram, 
  Globe, 
  Settings2, 
  CheckCircle2, 
  ExternalLink,
  Zap,
  ShieldCheck
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const channels = [
  { 
    id: 'whatsapp', 
    name: 'WhatsApp Business', 
    description: 'Direct AI integration via official WhatsApp Cloud API.',
    icon: <MessageSquare className="w-8 h-8 text-[#25D366]" />,
    status: 'Disconnected',
    connected: false
  },
  { 
    id: 'instagram', 
    name: 'Instagram DMs', 
    description: 'Automate story replies and direct messages instantly.',
    icon: <Instagram className="w-8 h-8 text-[#E4405F]" />,
    status: 'Connected',
    connected: true
  },
  { 
    id: 'website', 
    name: 'Website Widget', 
    description: 'A beautiful glassmorphic chat widget for your site.',
    icon: <Globe className="w-8 h-8 text-primary" />,
    status: 'Connected',
    connected: true
  },
]

export default function ChannelsPage() {
  return (
    <div className="space-y-8 relative z-10">
      <div>
        <h1 className="text-3xl font-bold font-display tracking-tightest">Channels & Connectors</h1>
        <p className="text-white/40 text-sm">Orchestrate your AI presence across the digital ecosystem</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {channels.map((channel, i) => (
          <motion.div
            key={channel.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className={cn(
              'h-full border-white/5 transition-all duration-300 relative group overflow-hidden',
              channel.connected ? 'bg-primary/[0.02]' : 'bg-white/[0.01]'
            )}>
              {channel.connected && (
                <div className="absolute top-0 right-0 p-4">
                  <Badge variant="success" className="bg-primary/20 text-primary border-none">Active</Badge>
                </div>
              )}
              
              <CardContent className="p-8 flex flex-col h-full">
                <div className="w-16 h-16 rounded-2xl glass border-white/10 flex items-center justify-center mb-6 group-hover:bg-primary/5 transition-colors">
                  {channel.icon}
                </div>
                
                <div className="flex-1 space-y-2">
                  <h3 className="text-xl font-bold font-display">{channel.name}</h3>
                  <p className="text-sm text-white/40 leading-relaxed">
                    {channel.description}
                  </p>
                </div>

                <div className="pt-8">
                  <Button 
                    variant={channel.connected ? 'ghost' : 'primary'} 
                    className="w-full h-11"
                  >
                    {channel.connected ? 'Configure Connection' : 'Connect Now'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="border-secondary/20 bg-secondary/[0.02] overflow-hidden">
        <div className="p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
          <div className="w-20 h-20 rounded-2xl glass-lime flex items-center justify-center border-secondary/20">
            <Zap className="text-secondary w-10 h-10" />
          </div>
          <div className="flex-1 text-center md:text-left space-y-2">
            <h3 className="text-2xl font-bold font-display">Custom API Access</h3>
            <p className="text-white/50 max-w-xl">
              Integrate CypAI's neural brain into your custom mobile apps or internal CRM with our high-speed REST API. 
              Documentation available for all enterprise partners.
            </p>
          </div>
          <Button variant="glass" className="h-12 px-8 border-secondary/20 hover:border-secondary/40">
            View API Docs <ExternalLink className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </Card>

      <div className="flex items-center gap-4 justify-center text-[10px] text-white/20 uppercase tracking-[0.4em] font-bold py-8">
        <ShieldCheck size={14} /> Encrypted Zero-Knowledge Integration
      </div>
    </div>
  )
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}
