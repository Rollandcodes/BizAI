import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const localeMatch = pathname.match(/^\/(en|tr|ar|ru|el)(\/|$)/);

  let response: NextResponse;

  if (localeMatch) {
    const locale = localeMatch[1];
    const rewriteUrl = request.nextUrl.clone();
    const strippedPath = pathname.replace(/^\/(en|tr|ar|ru|el)/, '') || '/';
    rewriteUrl.pathname = strippedPath;
    response = NextResponse.rewrite(rewriteUrl);
    response.cookies.set('cypai-locale', locale, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
    });
  } else {
    response = NextResponse.next();
  }

  response.headers.set('X-Frame-Options', 'ALLOWALL');
  response.headers.set('Content-Security-Policy', 'frame-ancestors *;');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  response.headers.set('X-DNS-Prefetch-Control', 'off');

  return response;
}

export const config = {
  matcher: '/:path*',
};