import { z } from "zod";

export const SignupSchema = z.object({
  name: z
    .string()
    .min(2, "First name must be at least 2 characters"),
  phone: z
    .string()
    .regex(/^\+91[6-9]\d{9}$/, "Please enter a valid Indian mobile number"),
  email: z
    .string()
    .email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
});

export type SignupInput = z.infer<typeof SignupSchema>;
