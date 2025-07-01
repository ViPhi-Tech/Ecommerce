import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

export const brandIdJsonSchema = z.object({
    id: z.number(),
});

export const brandCreateJsonSchema = z.object({
    name: z.string(),
    isActive: z.boolean().optional(),
});

export const brandUpdateJsonSchema = z.object({
    id: z.number(),
    name: z.string().optional(),
    isActive: z.boolean().optional(),
});



export const brandCreateToSchema = zodToJsonSchema(brandCreateJsonSchema);
export const brandUpdateToSchema = zodToJsonSchema(brandUpdateJsonSchema);
export const brandIdToSchema = zodToJsonSchema(brandIdJsonSchema)

export type BrandID = z.infer<typeof brandIdJsonSchema>;
export type BrandCreate = z.infer<typeof brandCreateJsonSchema>;
export type BrandUpdate = z.infer<typeof brandUpdateJsonSchema>;