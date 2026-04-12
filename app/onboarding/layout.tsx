import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { isOnboardingComplete } from '@/lib/clerk-auth'

export default async function OnboardingLayout({ children }: { children: React.ReactNode }) {
  const { sessionClaims } = await auth()

  if (isOnboardingComplete(sessionClaims)) {
    redirect('/dashboard')
  }

  return <>{children}</>
}

