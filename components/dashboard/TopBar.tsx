'use client'
import { motion } from 'framer-motion'
import { Search, Bell, Menu, Sparkles, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useClerk, useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

export default function TopBar() {
  const { signOut } = useClerk()
  const { user } = useUser()
  const router = useRouter()

  const displayName = user?.fullName || user?.firstName || user?.emailAddresses[0]?.emailAddress || 'User'
  const initials = (user?.firstName?.[0] ?? '') + (user?.lastName?.[0] ?? '') || displayName[0]?.toUpperCase() || 'U'

  const handleSignOut = async () => {
    await signOut()
    router.push('/sign-in')
  }

  return (
    <header className="h-16 glass border-b border-white/5 flex items-center justify-between px-8 sticky top-0 z-40 backdrop-blur-xl">
      <div className="flex items-center gap-4 flex-1">
        <button
          type="button"
          aria-label="Open navigation menu"
          title="Open navigation menu"
          className="lg:hidden p-2 hover:bg-white/5 rounded-lg transition-colors"
        >
          <Menu size={20} className="text-white/60" />
        </button>
        
        <div className="relative max-w-md w-full hidden md:block group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-primary transition-colors" size={16} />
          <input 
            type="text" 
            placeholder="Search conversations, agents, tools..."
            className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button aria-label="Open notifications" title="Open notifications" variant="ghost" size="icon" className="relative group border-none">
          <Bell size={18} className="text-white/60 group-hover:text-white transition-colors" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-background shadow-[0_0_8px_rgba(184,255,71,0.5)]" />
        </Button>

        <div className="h-6 w-[1px] bg-white/10 mx-2" />

        {/* User info */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="flex items-center gap-3 px-3 py-1.5 rounded-full glass border-white/5 cursor-pointer hover:border-primary/30 transition-all group"
        >
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-white">{displayName}</p>
            <p className="text-[10px] text-primary flex items-center justify-end gap-1">
              Active <Sparkles size={10} />
            </p>
          </div>
          <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
            {user?.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.imageUrl} alt={displayName} className="w-full h-full rounded-full object-cover" />
            ) : (
              <span className="text-xs font-bold text-primary">{initials}</span>
            )}
          </div>
        </motion.div>

        {/* Sign out */}
        <button
          type="button"
          onClick={handleSignOut}
          aria-label="Sign out"
          title="Sign out"
          className="p-2 rounded-full hover:bg-red-500/10 text-white/40 hover:text-red-400 transition-all"
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  )
}
