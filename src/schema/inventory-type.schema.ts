import { z } from "zod";

export const createInventoryTypeFormSchema = z.object({
    name: z.string().refine((value) => value.trim().length > 0, "Name is required"),
    description: z.string()
})

export const updateInventoryTypeFormSchema = createInventoryTypeFormSchema.partial();