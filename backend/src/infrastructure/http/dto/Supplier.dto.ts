import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

export const supplierIdJsonSchema = z.object({
    id: z.string().uuid(),
});

export const supplierCreateJsonSchema = z.object({
    tradeName: z.string().min(1, "Nome fantasia é obrigatório"),
    legalName: z.string().min(1, "Razão social é obrigatória"),
    cnpj: z.string().min(14, "CNPJ deve ter 14 caracteres").max(14, "CNPJ deve ter 14 caracteres"),
    address: z.string().min(1, "Endereço é obrigatório"),
    email: z.string().email("Email inválido").optional().nullable(),
    phone: z.string().optional().nullable(),
});

export const supplierUpdateJsonSchema = z.object({
    tradeName: z.string().min(1, "Nome fantasia é obrigatório").optional(),
    legalName: z.string().min(1, "Razão social é obrigatória").optional(),
    cnpj: z.string().min(14, "CNPJ deve ter 14 caracteres").max(14, "CNPJ deve ter 14 caracteres").optional(),
    address: z.string().min(1, "Endereço é obrigatório").optional(),
    email: z.string().email("Email inválido").optional().nullable(),
    phone: z.string().optional().nullable(),
});

export const supplierCreateToSchema = zodToJsonSchema(supplierCreateJsonSchema);
export const supplierUpdateToSchema = zodToJsonSchema(supplierUpdateJsonSchema);
export const supplierIdToSchema = zodToJsonSchema(supplierIdJsonSchema);

export type SupplierID = z.infer<typeof supplierIdJsonSchema>;
export type SupplierCreate = z.infer<typeof supplierCreateJsonSchema>;
export type SupplierUpdate = z.infer<typeof supplierUpdateJsonSchema>;