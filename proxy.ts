import { createServerClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function proxy(req: NextRequest) {
  let res = NextResponse.next()

  // Security Headers from original proxy.ts
  res.headers.set('X-Frame-Options', 'ALLOWALL')
  res.headers.set('Content-Security-Policy', 'frame-ancestors *;')
  res.headers.set('X-Content-Type-Options', 'nosniff')
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  res.headers.set('X-DNS-Prefetch-Control', 'off')

  // Supabase Auth Integration with 3-arg signature
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll().map((cookie) => ({
            name: cookie.name,
            value: cookie.value,
          }))
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value))
          res = NextResponse.next({
            request: {
              headers: req.headers,
            },
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            res.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const isDashboard = req.nextUrl.pathname.startsWith('/dashboard') || 
                      req.nextUrl.pathname.startsWith('/conversations') || 
                      req.nextUrl.pathname.startsWith('/agent') ||
                      req.nextUrl.pathname.startsWith('/channels') ||
                      req.nextUrl.pathname.startsWith('/settings')

  // Protect Dashboard Routes
  if (!session && isDashboard) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Redirect Authenticated Users from Auth Pages
  const isAuthPage = req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/signup'
  if (session && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return res
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon\\.ico).*)'],
}