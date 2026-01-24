"use server";

import { db } from "@/lib/db";
import { getVerificationTokenByEmail } from "@/data/verification-token";

export async function verifyEmailOtp(email: string, code: string) {
  const token = await getVerificationTokenByEmail(email);

  if (!token || token.token !== code) {
    return { error: "Invalid code" };
  }

  if (new Date() > token.expires) {
    return { error: "Code expired" };
  }

  await db.user.update({
    where: { email },
    data: { emailVerified: new Date() },
  });

  await db.verificationToken.delete({
    where: { id: token.id },
  });

  return { success: "Email verified successfully" };
}
