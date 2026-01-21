"use server";

import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { SignupSchema } from "@/schemas/signup-schema";
import type { AuthResponse } from "@/types/auth";

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

  await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });
// TODO send verification token email
  return { success: "Account created successfully" };
}
