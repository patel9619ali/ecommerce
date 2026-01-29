"use server";

import { SettingSchema } from "@/schemas/login-schema";
import { db } from "@/lib/db";
import { getUserById } from "@/data/user";
import { auth } from "@/lib/auth";
import { z } from "zod";

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

  await db.user.update({
    where: { id: dbUser.id },
    data: {
      name: values.name,
    },
  });

  return { success: "Name updated successfully" };
}
