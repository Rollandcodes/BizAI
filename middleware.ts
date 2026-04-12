import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { isOnboardingComplete } from '@/lib/clerk-auth'

// Routes requiring the user to be authenticated
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/conversations(.*)',
  '/agent(.*)',
  '/channels(.*)',
  '/settings(.*)',
  '/api/dashboard(.*)',
  '/api/business(.*)',
  '/api/conversations(.*)',
  '/api/orders(.*)',
  '/api/booking-history(.*)',
  '/api/audit(.*)',
])

// Routes that are part of the onboarding flow itself — never redirect these
const isOnboardingRoute = createRouteMatcher([
  '/onboarding(.*)',
  '/api/onboarding(.*)', // ← critical: must NOT be redirected to /onboarding
])

// Public auth routes — Clerk handles these, no custom redirect needed
const isAuthRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
])

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const { userId, sessionClaims, redirectToSignIn } = await auth()
  const isAuthenticated = !!userId

  // Clerk's own sign-in/sign-up pages — let them through
  if (isAuthRoute(req)) {
    return NextResponse.next()
  }

  // Onboarding routes (page + API) — let authenticated users through freely
  if (isOnboardingRoute(req) && isAuthenticated) {
    return NextResponse.next()
  }

  // Authenticated users who haven't completed onboarding → send to /onboarding
  if (isAuthenticated && !isOnboardingComplete(sessionClaims)) {
    const onboardingUrl = new URL('/onboarding', req.url)
    return NextResponse.redirect(onboardingUrl)
  }

  // Protected routes require authentication
  if (isProtectedRoute(req) && !isAuthenticated) {
    return redirectToSignIn({ returnBackUrl: req.url })
  }

  // Apply security headers to all responses
  const res = NextResponse.next()
  res.headers.set('X-Frame-Options', 'ALLOWALL')
  res.headers.set('Content-Security-Policy', 'frame-ancestors *;')
  res.headers.set('X-Content-Type-Options', 'nosniff')
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  res.headers.set('X-DNS-Prefetch-Control', 'off')

  return res
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}