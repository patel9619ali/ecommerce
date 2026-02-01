"use server";

import { SettingSchema } from "@/schemas/login-schema";
import { db } from "@/lib/db";
import { getUserByEmail, getUserById } from "@/data/user";
import { auth } from "@/lib/auth";
import { success, z } from "zod";
import { generateEmailVerificationOtp } from "@/lib/token";
import { sendEmailVerificationOtp } from "@/lib/mail";
import bcrypt from "bcryptjs";
export async function updateSetting(
  values: z.infer<typeof SettingSchema>
) {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const dbUser = await getUserById(session.user.id);

  if (!dbUser) {
    return { error: "User not found" };
  }
  if(session?.user.isOAuth){
    values.email = undefined
    values.password = undefined
    values.newPassword = undefined
    values.isTwoFactorEnabled = undefined
  }
if (values.email) {

  // 1️⃣ Same as current email
  if (values.email === session.user.email) {
    return { error: "This is already your current email" };
  }

  // 2️⃣ Check if another account has it
  const existingUser = await getUserByEmail(values.email);

  if (existingUser && existingUser.id !== session.user.id) {
    return { error: "Email already in use!" };
  }

  // 3️⃣ Send OTP
  const verificationToken = await generateEmailVerificationOtp(
    values.email
  );

  await sendEmailVerificationOtp(
    verificationToken.email,
    verificationToken.token
  );

  return { success: "Verification email sent" };
}

if(values.password && values.newPassword && dbUser.password){
  const passwordMatch = await bcrypt.compare(
    values.password,
    dbUser.password
  );
  if(!passwordMatch){
    return {error: "Incorrect Password!"};
  }
}

if (values.password && values.newPassword) {
  const hashedPassword = await bcrypt.hash(values.newPassword, 10);

  await db.user.update({
    where: { id: dbUser.id },
    data: {
      password: hashedPassword,
    },
  });

  return { success: "Password updated successfully" };
}

  await db.user.update({
    where: { id: dbUser.id },
    data: {
      name: values.name,
    },
  });

  return { success: "Name updated successfully" };
}
