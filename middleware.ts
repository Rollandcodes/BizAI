import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const isDashboard = req.nextUrl.pathname.startsWith('/dashboard') || 
                      req.nextUrl.pathname.startsWith('/conversations') || 
                      req.nextUrl.pathname.startsWith('/agent') ||
                      req.nextUrl.pathname.startsWith('/channels') ||
                      req.nextUrl.pathname.startsWith('/settings')

  if (!session && isDashboard) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // If user is logged in and tries to access login/signup, redirect to dashboard
  const isAuthPage = req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/signup'
  if (session && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return res
}

export const config = {
  matcher: [
    '/dashboard/:path*', 
    '/conversations/:path*', 
    '/agent/:path*', 
    '/channels/:path*', 
    '/settings/:path*',
    '/login', 
    '/signup'
  ],
}
