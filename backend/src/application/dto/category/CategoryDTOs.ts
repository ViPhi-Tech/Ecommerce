import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

// ===== INPUT DTOs (Para Use Cases) =====
export interface CreateCategoryInput {
  name: string;
  isActive?: boolean;
}

export interface UpdateCategoryInput {
  name: string;
  isActive?: boolean;
}

// ===== VALIDATION SCHEMAS (Para HTTP) =====
export const createCategorySchema = z.object({
  name: z.string().min(1, { message: "Nome da categoria é obrigatório" }),
  isActive: z.boolean().optional().default(true),
});

export const updateCategorySchema = z.object({
  name: z.string().min(1, { message: "Nome da categoria é obrigatório" }),
  isActive: z.boolean().optional(),
});

export const categoryIdSchema = z.object({
  id: z.number().min(1, { message: "ID da categoria é obrigatório" })
});

// ===== JSON SCHEMAS (Para Swagger) =====
export const createCategoryJsonSchema = zodToJsonSchema(createCategorySchema);
export const updateCategoryJsonSchema = zodToJsonSchema(updateCategorySchema);
export const categoryIdJsonSchema = zodToJsonSchema(categoryIdSchema);

// ===== TYPES (Para TypeScript) =====
export type CreateCategoryDTO = z.infer<typeof createCategorySchema>;
export type UpdateCategoryDTO = z.infer<typeof updateCategorySchema>;
export type CategoryIdDTO = z.infer<typeof categoryIdSchema>;

// ===== RESPONSE DTOs =====
export interface CategoryResponse {
  id: number;
  name: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}