import { MovementTypeEnum } from "@/enums/common.enum";
import { z } from "zod";
import { salaryRegex } from "./fixed-asset.schema";

export const createJournalEntryFormSchema = z.object({
  description: z.string(),
  entry_date: z.date().refine((value) => value, "Entry date is required"),
  amount: z
    .string()
    .regex(salaryRegex, {
      message:
        "Amount must have at most 10 digits in total and 2 decimal places (optional)",
    })
    .refine((val) => parseFloat(val) > 0, {
      message: "Amount must be greater than 0",
    }),
  inventoryTypeUUID: z.string().uuid("Inventory type must be a valid UUID"),
  ledgerAccountUUID: z.string().uuid("Ledger account must be a valid UUID"),
  movementType: z.enum(
    Object.values(MovementTypeEnum) as [string, ...string[]],
    {
      required_error: "Movement type is required",
    }
  ),
});

export const updateJournalEntryFormSchema =
  createJournalEntryFormSchema.partial();
