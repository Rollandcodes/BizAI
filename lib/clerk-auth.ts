import { auth, currentUser } from '@clerk/nextjs/server'

type SessionClaims = {
  publicMetadata?: {
    onboardingComplete?: boolean
  }
  metadata?: {
    onboardingComplete?: boolean
  }
}

export function normalizeEmail(email: string | null | undefined): string | null {
  const normalized = email?.trim().toLowerCase()
  return normalized ? normalized : null
}

export function isOnboardingComplete(sessionClaims: unknown): boolean {
  const claims = sessionClaims as SessionClaims | null | undefined
  return claims?.publicMetadata?.onboardingComplete === true || claims?.metadata?.onboardingComplete === true
}

export async function getAuthenticatedUser() {
  const { userId, sessionClaims } = await auth()
  if (!userId) {
    return null
  }

  const clerkUser = await currentUser()
  const email = normalizeEmail(clerkUser?.emailAddresses[0]?.emailAddress)

  return {
    userId,
    email,
    sessionClaims,
  }
}

export function hasAgencyAccess(email?: string | null): boolean {
  if (!email) {
    return false
  }

  const allowedEmails = (process.env.AGENCY_ALLOWED_EMAILS ?? '')
    .split(',')
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean)

  return allowedEmails.includes(email.trim().toLowerCase())
}