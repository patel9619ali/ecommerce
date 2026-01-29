"use server";

import { db } from "@/lib/db";
import { getVerificationTokenByEmail } from "@/data/verification-token";
import { auth } from "@/lib/auth";

export async function verifyEmailOtp(email: string, code: string) {
  try {
    const token = await getVerificationTokenByEmail(email);

    if (!token || token.token !== code) {
      return { error: "Invalid code" };
    }

    if (new Date() > token.expires) {
      return { error: "Code expired" };
    }

    const session = await auth();

    // ✅ CASE 1 — USER LOGGED IN (Change Email)
    if (session?.user?.id) {
      await db.user.update({
        where: { id: session.user.id },
        data: {
          email,
          emailVerified: new Date(),
        },
      });
    } 
    // ✅ CASE 2 — SIGNUP FLOW
    else {
      await db.user.update({
        where: { email },
        data: { emailVerified: new Date() },
      });
    }

    // ✅ Delete OTP
    await db.verificationToken.delete({
      where: { id: token.id },
    });

    return { success: "Email verified successfully" };

  } catch (error) {
    console.error("VERIFY EMAIL OTP ERROR:", error);
    return { error: "Something went wrong" };
  }
}
