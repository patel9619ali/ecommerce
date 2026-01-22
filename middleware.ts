import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicRoutes = ['/', '/new-verification'];
const authRoutes = ['/sign-in', '/sign-up', '/forgot-password'];
const apiAuthPrefix = '/api/auth';
const DEFAULT_REDIRECT_PAGE = '/settings';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  // Check if user is logged in via session cookie
  const token = req.cookies.get('authjs.session-token') || 
                req.cookies.get('__Secure-authjs.session-token');
  const isLoggedIn = !!token;

  // Skip API auth routes
  if (pathname.startsWith(apiAuthPrefix)) {
    return NextResponse.next();
  }

  // Handle auth routes (sign-in, sign-up, etc.)
  if (authRoutes.includes(pathname)) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL(DEFAULT_REDIRECT_PAGE, req.url));
    }
    return NextResponse.next();
  }

  // Handle public routes
  if (publicRoutes.includes(pathname)) {
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