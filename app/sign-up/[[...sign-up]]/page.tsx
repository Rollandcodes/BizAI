import { SignUp } from '@clerk/nextjs'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-[#050510] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-blue/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-md flex flex-col items-center">
        <Link href="/" className="mb-6 inline-flex items-center gap-2 self-start text-sm font-medium text-white/70 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded-full px-2 py-1">
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>
        <SignUp fallbackRedirectUrl="/onboarding" />
      </div>
    </div>
  )
}
