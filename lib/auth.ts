import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { UserRole } from "@prisma/client"
import { PrismaClient } from "@prisma/client"
import authConfig from "@/auth.config"
import { db } from "./db"
import { getUserById } from "@/data/user"

export const { auth, handlers, signIn, signOut } = NextAuth({
  pages: {
    signIn: '/sign-in',
    signOut: '/sign-out',
    // error: '/error',
  },
  events: {
  async linkAccount({user}) {
    await db.user.update({
      where: { id: user.id },
      data: { emailVerified: new Date() },
  });
}},
callbacks: {
  async jwt({ token }) {
    if (!token.sub) return token;

    const existingUser = await getUserById(token.sub);
    if (!existingUser) return token;

    token.role = existingUser.role as UserRole;
    return token;
  },

  async session({ session, token }) {
    if (session.user && token.sub) {
      session.user.id = token.sub;
      session.user.role = token.role as UserRole;
    }
    return session;
  },
},

  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
})