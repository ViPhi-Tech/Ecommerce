import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { stripNonDigits, stripNonDigitsOrNull } from '../../../shared/utils/stringUtils';

const cnpjFieldSchema = z
  .string()
  .transform((value) => stripNonDigits(value))
  .pipe(
    z
      .string()
      .min(14, { message: 'CNPJ deve ter 14 caracteres' })
      .max(14, { message: 'CNPJ deve ter 14 caracteres' })
  );

const phoneFieldSchema = z
  .union([z.string(), z.null()])
  .optional()
  .transform((value) => stripNonDigitsOrNull(value));

// ===== INPUT DTOs (Para Use Cases) =====
export interface CreateSupplierInput {
  tradeName: string;
  legalName: string;
  cnpj: string;
  address: string;
  email?: string | null;
  phone?: string | null;
}

export interface UpdateSupplierInput {
  tradeName?: string;
  legalName?: string;
  cnpj?: string;
  address?: string;
  email?: string | null;
  phone?: string | null;
}

// ===== VALIDATION SCHEMAS (Para HTTP) =====
export const createSupplierSchema = z.object({
  tradeName: z.string().min(1, { message: "Nome fantasia é obrigatório" }),
  legalName: z.string().min(1, { message: "Razão social é obrigatória" }),
  cnpj: cnpjFieldSchema,
  address: z.string().min(1, { message: "Endereço é obrigatório" }),
  email: z.string().email({ message: "Email inválido" }).optional().nullable(),
  phone: phoneFieldSchema,
});

export const updateSupplierSchema = z.object({
  tradeName: z.string().min(1, { message: "Nome fantasia é obrigatório" }).optional(),
  legalName: z.string().min(1, { message: "Razão social é obrigatória" }).optional(),
  cnpj: cnpjFieldSchema.optional(),
  address: z.string().min(1, { message: "Endereço é obrigatório" }).optional(),
  email: z.string().email({ message: "Email inválido" }).optional().nullable(),
  phone: phoneFieldSchema,
});

export const supplierIdSchema = z.object({
  id: z.string().uuid({ message: "ID do fornecedor deve ser um UUID válido" }),
});

// ===== JSON SCHEMAS (Para Swagger) =====
export const createSupplierJsonSchema = zodToJsonSchema(createSupplierSchema);
export const updateSupplierJsonSchema = zodToJsonSchema(updateSupplierSchema);
export const supplierIdJsonSchema = zodToJsonSchema(supplierIdSchema);

// ===== TYPES (Para TypeScript) =====
export type CreateSupplierDTO = z.infer<typeof createSupplierSchema>;
export type UpdateSupplierDTO = z.infer<typeof updateSupplierSchema>;
export type SupplierIdDTO = z.infer<typeof supplierIdSchema>;

// ===== RESPONSE DTOs =====
export interface SupplierResponse {
  id: string;
  tradeName: string;
  legalName: string;
  cnpj: string;
  address: string;
  email?: string | null;
  phone?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}