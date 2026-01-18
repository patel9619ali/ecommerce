"use server";

import { signIn } from "@/lib/auth";
import { DEFAULT_REDIRECT_PAGE } from "@/route";
import { LoginSchema } from "@/schemas/login-schema";
import type { AuthResponse } from "@/types/auth";
import { AuthError } from "next-auth";

export async function login(values: unknown): Promise<AuthResponse> {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: "Invalid email or password",
    };
  }

  const { email, password } = validatedFields.data;

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

  return {
    success: "Login successful",
  };
}
