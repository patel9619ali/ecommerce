"use server";

import { ResetSchema } from "@/schemas/login-schema";
import { getUserByEmail } from "@/data/user";
import type { AuthResponse } from "@/types/auth";
import { generatePasswordResetToken } from "@/lib/token";
import { sendPasswordResetEmail } from "@/lib/mail";
export async function forgotPassword(values: unknown): Promise<AuthResponse> {
  const validatedFields = ResetSchema.safeParse(values);
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
  // ✅ Generate PASSWORD reset token
  const resetToken = await generatePasswordResetToken(email);

  // ✅ Send PASSWORD reset email
  await sendPasswordResetEmail(
    resetToken.email,
    resetToken.token
  );

  return { success: "Password reset email sent!" };
}