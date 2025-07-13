import { z } from "zod";
import { salaryRegex } from "./fixed-asset.schema";

export const createDepreciationCalculationFormSchema = z.object({
  process_date: z.date().refine((value) => value, "Process date is required"),
  depreciation_amount: z
    .string()
    .regex(salaryRegex, {
      message:
        "Depreciation amount must have at most 10 digits in total and 2 decimal places (optional)",
    })
    .refine((val) => parseFloat(val) > 0, {
      message: "Depreciation amount must be greater than 0",
    }),
  accumulated_depreciation: z
    .string()
    .regex(salaryRegex, {
      message:
        "Accumulated depreciation must have at most 10 digits in total and 2 decimal places (optional)",
    })
    .refine((val) => parseFloat(val) > 0, {
      message: "Accumulated depreciation must be greater than 0",
    }),
  fixedAssetUUID: z.string().uuid("Fixed asset must be a valid UUID"),
});

export const updateDepreciationCalculationFormSchema =
  createDepreciationCalculationFormSchema.partial();
