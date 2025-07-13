import { PersonTypeEnum } from "@/enums/common.enum";
import { z } from "zod";

export const createEmployeeFormSchema = z.object({
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
  departmentUUID: z.string().uuid("Department must be a valid UUID"),
  personType: z.enum(Object.values(PersonTypeEnum) as [string, ...string[]], {
    required_error: "Person type is required",
  }),
});

export const updateEmployeeFormSchema = createEmployeeFormSchema.partial();
