import { z } from "zod";

export const salaryRegex = /^\d{1,10}(\.\d{0,2})?$/;

export const createFixedAssetFormSchema = z.object({
  name: z
    .string()
    .refine((value) => value.trim().length > 0, "Name is required"),
  purchase_value: z
    .string()
    .regex(salaryRegex, {
      message:
        "Purchase value must have at most 10 digits in total and 2 decimal places (optional)",
    })
    .refine((val) => parseFloat(val) > 0, {
      message: "Purchase value must be greater than 0",
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
  departmentUUID: z.string().uuid("Department must be a valid UUID"),
  assetTypeUUID: z.string().uuid("Asset type must be a valid UUID"),
  employeeUUID: z.string().uuid("Employee must be a valid UUID"),
});

export const updateFixedAssetFormSchema = createFixedAssetFormSchema.partial();
