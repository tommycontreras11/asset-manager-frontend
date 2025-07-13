import { z } from "zod";

export const createAssetTypeFormSchema = z.object({
    name: z.string().refine((value) => value.trim().length > 0, "Name is required"),
    purchaseAccountUUID: z.string().uuid("Purchase account must be a valid UUID"),
    depreciationAccountUUID: z.string().uuid("Depreciation account must be a valid UUID"),
})

export const updateAssetTypeFormSchema = createAssetTypeFormSchema.partial();