"use server";

import { signIn } from "@/lib/auth";
import { DEFAULT_REDIRECT_PAGE } from "@/route";
import { LoginSchema } from "@/schemas/login-schema";
import type { AuthResponse } from "@/types/auth";
import { AuthError } from "next-auth";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import { generateVerificationToken,generateTwoFactorToken } from "@/lib/token";
import { getUserByEmail } from "@/data/user";
import { sendVerificationEmail,sendTwoFactorTokenEmail } from "@/lib/mail";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";
import { db } from "@/lib/db";
export async function login(values: unknown): Promise<AuthResponse> {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: "Invalid email or password",
    };
  }

  const { email, password,code } = validatedFields.data;
  const existingUser = await getUserByEmail(email);
  if(!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "Invalid email or password" };
  }
  if(!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(existingUser.email);
    return { error: "Email not verified. Please check your inbox for the verification email." }; 
  }
  if (existingUser.isTwoFactorEnabled && existingUser.email){
   if (code) {
        const twoFactorToken = await getTwoFactorTokenByEmail(
        existingUser.email
      );
      if (!twoFactorToken) {
        return { error: "Invalid code!" };
      }
      if (twoFactorToken.token !== code) {
        return { error: "Invalid code!" };
      }
      const hasExpired = new Date() > new Date(twoFactorToken.expires);
      if (hasExpired) {
        return { error: "Code has expired. Please request a new one." };
      }
      await db.twoFactorToken.delete({  
        where: { id: twoFactorToken.id },
      });
      // Create two factor confirmation record
      const existingConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);
        if (existingConfirmation) {
          await db.twoFactorConfirmation.delete({
          where: { id: existingConfirmation.id }
        });
        }
        await db.twoFactorConfirmation.create({
          data: {
            userId: existingUser.id,
          }
        });
    } else {
    const twoFactorToken = await generateTwoFactorToken(existingUser.email);
    await sendTwoFactorTokenEmail(
      twoFactorToken.email,
      twoFactorToken.token
    );
    return { twoFactor: true };
  }
  }
  try {
    await signIn("credentials",{
      email,
      password,
      redirectTo: DEFAULT_REDIRECT_PAGE
    })
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid email or password" };

        default:
          return { error: "Something went wrong" };
      }
    }
    throw error
  }

  // 🔜 Call Strapi here
  // 🔜 Verify password
  // 🔜 Create session
  const verificationToken = await generateVerificationToken(email);
  await sendVerificationEmail(
    verificationToken.email,
    verificationToken.token
  );
  return { success: "Confirmation email sent!" };
}
