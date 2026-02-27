"use server";

import { signIn } from "@/lib/auth";
import { DEFAULT_REDIRECT_PAGE } from "@/route";
import { LoginSchema } from "@/schemas/login-schema";
import type { AuthResponse } from "@/types/auth";
import { AuthError } from "next-auth";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import { generateTwoFactorToken, generateEmailVerificationOtp } from "@/lib/token";
import { getUserByEmail } from "@/data/user";
import { sendTwoFactorTokenEmail, sendEmailVerificationOtp } from "@/lib/mail";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";
import { db } from "@/lib/db";

export async function login(values: unknown): Promise<AuthResponse> {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: "Invalid email or password",
    };
  }

  const { email, password, code } = validatedFields.data;
  const existingUser = await getUserByEmail(email);
  
  // With these two:
  if (!existingUser || !existingUser.email) {
    return { error: "This email is not registered. Please sign up first." };
  }

  if (!existingUser.password) {
    return { error: "Invalid email or password" };
  }
  
  // ✅ Check if email is verified
  if (!existingUser.emailVerified) {
    // ✅ Resend OTP and ask them to verify
    const otp = await generateEmailVerificationOtp(existingUser.email);
    await sendEmailVerificationOtp(otp.email, otp.token);
    
    return { 
      error: "Email not verified. Please check your email for verification code.",
      verifyEmailOtp: true 
    };
  }
  
  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (code) {
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);
      
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
      await sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token);
      return { twoFactor: true };
    }
  }
  
  try {
    // IMPORTANT: Remove redirectTo to handle redirect manually in the client
    await signIn("credentials", {
      email,
      password,
      redirect: false, // Don't auto-redirect
    });
    
    return { success: "Login successful!" };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid email or password" };
        default:
          return { error: "Something went wrong" };
      }
    }
    throw error;
  }
  
}