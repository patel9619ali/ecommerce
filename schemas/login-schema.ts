import { z } from "zod";

export const SettingSchema = z.object({
  name: z.optional(z.string().min(2, "Name must be at least 2 characters")),
});
export const ResetSchema = z.object({
  email: z.string().email("Invalid email address"),
});
export const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  code: z.string().optional(),
});
export const NewPasswordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginInput = z.infer<typeof LoginSchema>;
