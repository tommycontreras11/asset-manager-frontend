import { z } from "zod";

export const createUserFormSchema = z.object({
  identification: z
    .string()
    .refine((value) => value.trim().length > 0, "Identification is required"),
  email: z
    .string()
    .refine((value) => value.trim().length > 0, "Email is required")
    .refine((value) => value.includes("@"), { message: "Invalid email" }),
  name: z
    .string()
    .refine((value) => value.trim().length > 0, "Name is required"),
  password: z
    .string()
    .refine((value) => value.trim().length > 0, "Password is required"),
});

export const updateUserFormSchema = createUserFormSchema.partial();
