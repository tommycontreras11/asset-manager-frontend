import { LedgerAccountTypeEnum } from "@/enums/common.enum";
import { z } from "zod";

export const createLedgerAccountFormSchema = z.object({
  code: z
    .string()
    .refine((value) => value.trim().length > 0, "Code is required"),
  name: z
    .string()
    .refine((value) => value.trim().length > 0, "Name is required"),
  type: z.enum(Object.values(LedgerAccountTypeEnum) as [string, ...string[]], {
    required_error: "Type is required",
  }),
});

export const updateLedgerAccountFormSchema =
  createLedgerAccountFormSchema.partial();
