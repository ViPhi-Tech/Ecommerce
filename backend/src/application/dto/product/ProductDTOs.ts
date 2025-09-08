import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

// ===== INPUT DTOs (Para Use Cases) =====
export interface CreateProductInput {
  name: string;
  ean: string;
  description?: string;
  shortDescription?: string;
  initialPrice: number;
  finalPrice: number;
  brandId?: number;
  image?: string;
  sku: string;
  cost?: number;
  companyId: number;
  categoryId: number;
  quantity: number;
}

export interface UpdateProductInput {
  name: string;
  ean: string;
  description?: string;
  shortDescription?: string;
  initialPrice: number;
  finalPrice: number;
  brandId?: number;
  image?: string;
  sku: string;
  cost?: number;
}

export interface UpdateStockInput {
  productId: number;
  quantity: number;
}

export interface FindMovementInput {
  date: string;
  type?: "IN" | "OUT" | null;
}

// ===== VALIDATION SCHEMAS (Para HTTP) =====
export const createProductSchema = z.object({
  name: z.string().min(1, { message: "Nome é obrigatório" }),
  ean: z.string().min(1, { message: "EAN é obrigatório" }),
  description: z.string().optional(),
  shortDescription: z.string().optional(),
  initialPrice: z.number().min(0, { message: "Preço inicial deve ser maior que zero" }),
  finalPrice: z.number().min(0, { message: "Preço final deve ser maior que zero" }),
  brandId: z.number().optional(),
  image: z.string().optional(),
  sku: z.string().min(1, { message: "SKU é obrigatório" }),
  cost: z.number().optional(),
  companyId: z.number().min(1, { message: "ID da empresa é obrigatório" }),
  categoryId: z.number().min(1, { message: "ID da categoria é obrigatório" }),
  quantity: z.number().min(0, { message: "Quantidade deve ser maior ou igual a zero" }),
});

export const updateProductSchema = z.object({
  name: z.string().min(1, { message: "Nome é obrigatório" }),
  ean: z.string().min(1, { message: "EAN é obrigatório" }),
  description: z.string().optional(),
  shortDescription: z.string().optional(),
  initialPrice: z.number().min(0, { message: "Preço inicial deve ser maior que zero" }),
  finalPrice: z.number().min(0, { message: "Preço final deve ser maior que zero" }),
  brandId: z.number().optional(),
  image: z.string().optional(),
  sku: z.string().min(1, { message: "SKU é obrigatório" }),
  cost: z.number().optional(),
});

export const updateStockSchema = z.object({
  productId: z.number().min(1, { message: "ID do produto é obrigatório" }),
  quantity: z.number().min(1, { message: "Quantidade deve ser maior que zero" })
});

export const updateManyStockSchema = z.object({
  type: z.enum(["IN", "OUT"]),
  stocks: z.array(updateStockSchema)
});

export const findMovementSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: "A data deve estar no formato YYYY-MM-DD",
  }),
  type: z.enum(["IN", "OUT"]).optional().nullable(),
});

export const productIdSchema = z.object({
  id: z.number().min(1, { message: "ID do produto é obrigatório" })
});

export const productIdsMovementSchema = z.object({
  productIds: z.string().min(1, { message: "IDs dos produtos são obrigatórios" }),
});

export const stockMovementSchema = z.object({
  productId: z.number().min(1, { message: "ID do produto é obrigatório" }),
  quantity: z.number().min(1, { message: "Quantidade deve ser maior que zero" }),
  type: z.enum(["IN", "OUT"]),
  user: z.object({
    id: z.number().min(1, { message: "ID do usuário é obrigatório" }),
    fullName: z.string().min(1, { message: "Nome do usuário é obrigatório" }),
  })
});

export const validateProductsSchema = z.object({
  products: z.array(createProductSchema)
});

export const createProductJsonSchema = zodToJsonSchema(createProductSchema);
export const updateProductJsonSchema = zodToJsonSchema(updateProductSchema);
export const updateStockJsonSchema = zodToJsonSchema(updateStockSchema);
export const updateManyStockJsonSchema = zodToJsonSchema(updateManyStockSchema);
export const findMovementJsonSchema = zodToJsonSchema(findMovementSchema);
export const productIdJsonSchema = zodToJsonSchema(productIdSchema);
export const productIdsMovementJsonSchema = zodToJsonSchema(productIdsMovementSchema);
export const stockMovementJsonSchema = zodToJsonSchema(stockMovementSchema);
export const validateProductsJsonSchema = zodToJsonSchema(validateProductsSchema);
export type CreateProductDTO = z.infer<typeof createProductSchema>;
export type UpdateProductDTO = z.infer<typeof updateProductSchema>;
export type UpdateStockDTO = z.infer<typeof updateStockSchema>;
export type UpdateManyStockDTO = z.infer<typeof updateManyStockSchema>;
export type FindMovementDTO = z.infer<typeof findMovementSchema>;
export type ProductIdDTO = z.infer<typeof productIdSchema>;
export type ProductIdsMovementDTO = z.infer<typeof productIdsMovementSchema>;
export type StockMovementDTO = z.infer<typeof stockMovementSchema>;
export type ValidateProductsDTO = z.infer<typeof validateProductsSchema>;
export interface ProductResponse {
  id: number;
  name: string;
  ean: string;
  description?: string;
  shortDescription?: string;
  initialPrice: number;
  finalPrice: number;
  brand?: string;
  image?: string;
  sku: string;
  cost?: number;
  companyId: number;
  categoryId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface StockMovementResponse {
  id: number;
  productId: number;
  quantity: number;
  type: "IN" | "OUT";
  userId: number;
  createdAt: Date;
  user?: {
    id: number;
    fullName: string;
  };
  product?: {
    id: number;
    name: string;
    sku: string;
  };
}