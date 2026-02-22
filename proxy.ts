import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const authRoutes = ['/sign-in', '/sign-up', '/forgot-password', '/new-password'];
const apiAuthPrefix = '/api/auth';
const DEFAULT_REDIRECT_PAGE = '/';

// ✅ Routes that never require auth
const publicRoutes = [
  '/',
  '/verify-email',
  '/about-us',        // ✅ No auth needed
  '/faqs',            // ✅ No auth needed
  '/contact-us',      // ✅ No auth needed
  '/products',        // ✅ No auth needed
];

// ✅ Route PREFIXES that never require auth (dynamic routes)
const publicPrefixes = [
  '/products/',
  '/order-confirmation/',      // ✅ API must be reachable
];

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token =
    req.cookies.get('authjs.session-token') ||
    req.cookies.get('__Secure-authjs.session-token');
  const isLoggedIn = !!token;

  // Skip API auth routes
  if (pathname.startsWith(apiAuthPrefix)) {
    return NextResponse.next();
  }

  // ✅ Skip all API routes entirely — let the API handle its own auth
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Handle auth routes
  if (authRoutes.includes(pathname)) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL(DEFAULT_REDIRECT_PAGE, req.url));
    }
    return NextResponse.next();
  }

  // ✅ Check public exact routes
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // ✅ Check public prefix routes (dynamic segments)
  if (publicPrefixes.some(prefix => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  // Protect all other routes
  if (!isLoggedIn) {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};