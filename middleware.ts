
import authConfig from "@/auth.config";
import NextAuth from "next-auth";
import {
  publicRoutes,authRoutes,apiAuthPrefix,DEFAULT_REDIRECT_PAGE
}
from "@/route";
const {auth} = NextAuth(authConfig);
export default auth((req) => {
  const {nextUrl} = req;
  let isLogginIn = !!req.auth;
  const isApiAuthRoutes = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoutes = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoutes = authRoutes.includes(nextUrl.pathname);
  if (isApiAuthRoutes){
    return null;
  }
  if (isAuthRoutes){
    if (isLogginIn){
      return Response.redirect(new URL(DEFAULT_REDIRECT_PAGE,nextUrl));
    }
    return null;
  }

  if (!isLogginIn && !isPublicRoutes){
    return Response.redirect(new URL ('/sign-in',nextUrl))
  }
  return null;
});
 
// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}