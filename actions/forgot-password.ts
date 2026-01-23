"use server";

import { ResetSchema } from "@/schemas/login-schema";
import { getUserByEmail } from "@/data/user";
import type { AuthResponse } from "@/types/auth";
import { generatePasswordResetToken, generateVerificationToken } from "@/lib/token";
import { sendPasswordResetEmail, sendVerificationEmail } from "@/lib/mail";
export async function forgotPassword(values: unknown): Promise<AuthResponse> {
  const validatedFields = ResetSchema.safeParse(values);
  console.log("Validated Fields:", validatedFields);
  if (!validatedFields.success) {
    return {
      error: "Invalid email address",
    };
  }

  const { email } = validatedFields.data;
  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    return { error: "Email not found" };
  }
  const passwordResetToken = await generatePasswordResetToken(email);
  await sendPasswordResetEmail(
    passwordResetToken.email,
    passwordResetToken.token
  );
  return { success: "Confirmation email sent!" };
}