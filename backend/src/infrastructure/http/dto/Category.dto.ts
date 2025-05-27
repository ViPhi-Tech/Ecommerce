import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

export const categorySchemaDTO = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    id: z.number().min(1, { message: "Category ID is required" }),
    isActive: z.boolean().optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
});

export const categoryCreateSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    isActive: z.boolean().optional().nullable(),
});

export const categoryIDSchema = z.object({
    id: z.number().min(1, { message: "Category ID is required" })
});

export const categoryUpdateSchema = z.object({
    id: z.number().min(1, { message: "Category ID is required" }),
    name: z.string().min(1, { message: "Name is required" }),
    isActive: z.boolean().optional(),
});

export const categoryJsonSchema = zodToJsonSchema(categorySchemaDTO);
export const categoryCreateJsonSchema = zodToJsonSchema(categoryCreateSchema);
export const categoryIdJsonSchema = zodToJsonSchema(categoryIDSchema);
export const categoryUpdateJsonSchema = zodToJsonSchema(categoryUpdateSchema);

export type CategoryDTO = z.infer<typeof categorySchemaDTO>;
export type CategoryCreateDTO = z.infer<typeof categoryCreateSchema>;
export type CategoryID = z.infer<typeof categoryIDSchema>;
export type CategoryUpdateDTO = z.infer<typeof categoryUpdateSchema>;
