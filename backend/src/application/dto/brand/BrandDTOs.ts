import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

// ===== INPUT DTOs (Para Use Cases) =====
export interface CreateBrandInput {
  name: string;
  isActive?: boolean;
}

export interface UpdateBrandInput {
  name?: string;
  isActive?: boolean;
}

// ===== VALIDATION SCHEMAS (Para HTTP) =====
export const createBrandSchema = z.object({
  name: z.string().min(1, { message: "Nome da marca é obrigatório" }),
  isActive: z.boolean().optional().default(true),
});

export const updateBrandSchema = z.object({
  name: z.string().min(1, { message: "Nome da marca é obrigatório" }).optional(),
  isActive: z.boolean().optional(),
});

export const brandIdSchema = z.object({
  id: z.number().min(1, { message: "ID da marca é obrigatório" }),
});

// ===== JSON SCHEMAS (Para Swagger) =====
export const createBrandJsonSchema = zodToJsonSchema(createBrandSchema);
export const updateBrandJsonSchema = zodToJsonSchema(updateBrandSchema);
export const brandIdJsonSchema = zodToJsonSchema(brandIdSchema);

// ===== TYPES (Para TypeScript) =====
export type CreateBrandDTO = z.infer<typeof createBrandSchema>;
export type UpdateBrandDTO = z.infer<typeof updateBrandSchema>;
export type BrandIdDTO = z.infer<typeof brandIdSchema>;

// ===== RESPONSE DTOs =====
export interface BrandResponse {
  id: number;
  name: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}