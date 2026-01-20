import {v4 as uuidv4} from "uuid";
import { db } from "./db";
import { getVerificationTokenByEmail } from "@/data/verification-token";

export const generateVerificationToken = async (email:string) => {
    const token = uuidv4();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // Token valid for 1 hour
    const existingToken = await getVerificationTokenByEmail(email);

        if (existingToken) {
        await db.verificationToken.delete({
            where: {
            id: existingToken.id,
            },
        });
        }

        const verificationToken = await db.verificationToken.create({
        data: {
            email,
            token,
            expires: expiresAt,
        },
        });
        return verificationToken;
}