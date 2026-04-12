import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'

// Define which routes need auth protection.
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/conversations(.*)',
  '/agent(.*)',
  '/channels(.*)',
  '/settings(.*)',
  '/api/dashboard(.*)'
])
const isOnboardingRoute = createRouteMatcher(['/onboarding(.*)'])

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const { userId, sessionClaims, redirectToSignIn } = await auth()
  const isAuthenticated = !!userId

  // For users visiting /onboarding, don't try to redirect them somewhere else
  if (isAuthenticated && isOnboardingRoute(req)) {
    // Continue running, we handle redirecting away from onboarding inside app/onboarding/layout.tsx
  } else if (isAuthenticated && !sessionClaims?.metadata?.onboardingComplete) {
    // Catch users who do not have `onboardingComplete: true` in their publicMetadata
    // Redirect them to the /onboarding route to complete onboarding
    const onboardingUrl = new URL('/onboarding', req.url)
    return NextResponse.redirect(onboardingUrl)
  }

  // If the route matches our protected routes, require auth
  if (isProtectedRoute(req) && !isAuthenticated) {
    return redirectToSignIn({ returnBackUrl: req.url })
  }
  
  // We get the NextResponse to append custom headers
  const res = NextResponse.next()

  // Security Headers from original proxy.ts
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