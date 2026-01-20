import {
  publicRoutes,
  authRoutes,
  apiAuthPrefix,
  DEFAULT_REDIRECT_PAGE,
} from "@/route";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default function middleware(req: NextRequest) {
  const { nextUrl } = req;

  // ✅ replaces req.auth (Edge-safe)
  const sessionToken =
    req.cookies.get("__Secure-next-auth.session-token") ||
    req.cookies.get("next-auth.session-token");

  const isLogginIn = !!sessionToken;

  const isApiAuthRoutes = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoutes = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoutes = authRoutes.includes(nextUrl.pathname);

  if (isApiAuthRoutes) {
    return NextResponse.next();
  }

  if (isAuthRoutes) {
    if (isLogginIn) {
      return NextResponse.redirect(
        new URL(DEFAULT_REDIRECT_PAGE, nextUrl)
      );
    }
    return NextResponse.next();
  }

  if (!isLogginIn && !isPublicRoutes) {
    return NextResponse.redirect(
      new URL("/sign-in", nextUrl)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|.*\\..*).*)",
    "/(api|trpc)(.*)",
  ],
};
