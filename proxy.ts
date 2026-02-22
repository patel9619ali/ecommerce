import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const authRoutes = ['/sign-in', '/sign-up', '/forgot-password', '/new-password'];
const apiAuthPrefix = '/api/auth';
const DEFAULT_REDIRECT_PAGE = '/';

const publicRoutes = [
  '/',
  '/verify-email',
  '/about-us',
  '/faqs',
  '/contact-us',
];

const publicPrefixes = [
  '/products/',
  '/order-confirmation/',
];

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip API auth routes
  if (pathname.startsWith(apiAuthPrefix)) {
    return NextResponse.next();
  }

  // Skip ALL API routes
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Allow public routes
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  if (publicPrefixes.some(prefix => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  // 🔥 Protect only specific private pages instead of everything
  if (pathname.startsWith('/dashboard') ||
      pathname.startsWith('/profile') ||
      pathname.startsWith('/my-orders')) {

    const token =
      req.cookies.get('authjs.session-token') ||
      req.cookies.get('__Secure-authjs.session-token');

    if (!token) {
      return NextResponse.redirect(new URL('/sign-in', req.url));
    }
  }

  return NextResponse.next();
}


export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};