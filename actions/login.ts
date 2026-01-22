"use server";

import { signIn } from "@/lib/auth";
import { DEFAULT_REDIRECT_PAGE } from "@/route";
import { LoginSchema } from "@/schemas/login-schema";
import type { AuthResponse } from "@/types/auth";
import { AuthError } from "next-auth";
import { generateVerificationToken } from "@/lib/token";
import { getUserByEmail } from "@/data/user";
import { sendVerificationEmail } from "@/lib/mail";
export async function login(values: unknown): Promise<AuthResponse> {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: "Invalid email or password",
    };
  }

  const { email, password } = validatedFields.data;
const existingUser = await getUserByEmail(email);
if(!existingUser || !existingUser.email || !existingUser.password) {
  return { error: "Invalid email or password" };
}
if(!existingUser.emailVerified) {
 const verificationToken = await generateVerificationToken(existingUser.email);
 return { error: "Email not verified. Please check your inbox for the verification email." }; 
}
  
  try {
    await signIn("credentials",{
      email,
      password,
      redirectTo: DEFAULT_REDIRECT_PAGE
    })
    return { success: "Signed in successfully" };
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
