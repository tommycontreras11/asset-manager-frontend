import { z } from "zod";

export const createDepartmentFormSchema = z.object({
    name: z.string().refine((value) => value.trim().length > 0, "Name is required"),
    description: z.string()
})

export const updateDepartmentFormSchema = createDepartmentFormSchema.partial();