import {v4 as uuidv4} from "uuid";
import { db } from "./db";
import { getVerificationTokenByEmail } from "@/data/verification-token";
import { getPasswordResetTokenByEmail } from "@/data/password-reset-token";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import crypto from "crypto";
export const generateTwoFactorToken = async (email:string) => {
    // TODO Change to 15 minutes in production
    const token = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(new Date().getTime()+5*60*1000);
    const existingToken = await getTwoFactorTokenByEmail(email);

        if (existingToken) {
        await db.twoFactorToken.delete({
            where: {
            id: existingToken.id,
            },
        });
        }

        const twoFactorToken = await db.twoFactorToken.create({
        data: {
            email,
            token,
            expires: expiresAt,
        },
        });
        return twoFactorToken;
}

export const generatePasswordResetToken = async (email:string) => {
    const existingToken = await getPasswordResetTokenByEmail(email);

          if (existingToken && existingToken.expires > new Date()) {
                return existingToken; // reuse token
            }

            if (existingToken) {
                await db.passwordResetToken.delete({
                where: { id: existingToken.id },
                });
            }
            const token = uuidv4();
            const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
            const passwordResetToken = await db.passwordResetToken.create({
            data: {
                email,
                token,
                expires: expiresAt,
            },
        });
        return passwordResetToken;
}
export const generateEmailVerificationOtp = async (email: string) => {
  const token = crypto.randomInt(1000, 9999).toString(); // ✅ 4 digit OTP
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // ✅ 1 hour

  const existingToken = await getVerificationTokenByEmail(email);
  if (existingToken) {
    await db.verificationToken.delete({
      where: { id: existingToken.id },
    });
  }

  return db.verificationToken.create({
    data: {
      email,
      token,
      expires: expiresAt,
    },
  });
};