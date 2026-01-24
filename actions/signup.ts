// C:\Users\Admin\Documents\single_product\startup\actions\signup.ts
"use server";

import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { SignupSchema } from "@/schemas/signup-schema";
import type { AuthResponse } from "@/types/auth";
import { generateEmailVerificationOtp } from "@/lib/token";
import { sendEmailVerificationOtp } from "@/lib/mail";

export async function signup(values: unknown): Promise<AuthResponse> {
  const validatedFields = SignupSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid signup data" };
  }

  const { name, email, password } = validatedFields.data;

  const existingUser = await db.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return { error: "Email already exists" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // 1️⃣ Create user (email NOT verified yet)
  await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  // 2️⃣ Generate OTP
  const otp = await generateEmailVerificationOtp(email);

  // 3️⃣ Send OTP email
  await sendEmailVerificationOtp(otp.email, otp.token);

  // 4️⃣ Tell frontend to show OTP screen
  return {
    verifyEmailOtp: true,
  };
}
