import { z } from "zod";

export const CheckoutAddressSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit phone number"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  building: z.string().optional(),
  apartment: z.string().optional(),
  landmark: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pincode: z.string().regex(/^\d{6}$/, "PIN code must be 6 digits"),
});

export type CheckoutAddress = z.infer<typeof CheckoutAddressSchema>;