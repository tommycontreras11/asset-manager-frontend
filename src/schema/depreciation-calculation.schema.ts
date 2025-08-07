import { z } from "zod";

export const createDepreciationCalculationFormSchema = z.object({
  process_date: z.date().refine((value) => value, "Process date is required"),
  fixedAssetUUID: z.string().uuid("Fixed asset must be a valid UUID"),
});

export const updateDepreciationCalculationFormSchema =
  createDepreciationCalculationFormSchema.partial();
