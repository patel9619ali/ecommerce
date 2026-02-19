import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { UserRole } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import authConfig from "@/auth.config";
import { db } from "./db";
import { getUserById } from "@/data/user";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";
import { getAccountByUserId } from "@/data/account";

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
  async signIn({ user, account }) {
    // Allow OAuth without email verification
    if (account?.provider != "credentials") return true;
    if (!user.id) return false;
    const existingUser = await getUserById(user.id);
    // Prevent sign in without verification
    if (!existingUser?.emailVerified) return false;
    // To do 2FA check here
    if (existingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId
        (existingUser.id);
        if (!twoFactorConfirmation) return false;
        // Delete two factor confirmation for next sign in
        await db.twoFactorConfirmation.delete({
        where: { id: twoFactorConfirmation.id }
        });
    }
    return true;
  },
  async jwt({ token }) {
    if (!token.sub) return token;

    const existingUser = await getUserById(token.sub);
    if (!existingUser) return token;
    token.name = existingUser.name;
    token.email = existingUser.email;
    token.role = existingUser.role as UserRole;
    token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;
    const existingAccount = await getAccountByUserId(existingUser.id)
    token.isOAuth = !!existingAccount;
    return token;
  },
  async session({ session, token }) {
    if (session.user && token.sub) {
      session.user.id = token.sub;
      session.user.role = token.role as UserRole;
      session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
    }
    if(session.user){
      session.user.name = token.name ?? "";
      session.user.email = token.email ?? "";
      session.user.isOAuth = token.isOAuth as boolean;
    }
    return session;
  },
},

  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
})