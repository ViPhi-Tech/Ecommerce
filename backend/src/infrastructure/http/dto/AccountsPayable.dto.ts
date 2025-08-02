import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

// Schema para ID
export const accountsPayableIdSchema = z.object({
  id: z.number().int().positive(),
});

// Schema para criação
export const accountsPayableCreateSchema = z.object({
  originalDueDate: z.string().datetime(),
  issueDate: z.string().datetime(),
  dueDate: z.string().datetime(),
  competenceDate: z.string().datetime(),
  amount: z.number().positive(),
  recurringPurchase: z.boolean().optional().default(false),
  description: z.string().min(1, 'Descrição é obrigatória'),
});

// Schema para atualização
export const accountsPayableUpdateSchema = z.object({
  supplierId: z.number().int().positive().optional(),
  originalDueDate: z.string().datetime().optional(),
  issueDate: z.string().datetime().optional(),
  dueDate: z.string().datetime().optional(),
  competenceDate: z.string().datetime().optional(),
  amount: z.number().positive().optional(),
  recurringPurchase: z.boolean().optional(),
  description: z.string().min(1).optional(),
  status: z.enum(['pending', 'paid', 'overdue', 'cancelled']).optional(),
});

// Schema para busca por fornecedor
export const accountsPayableSupplierSchema = z.object({
  supplierId: z.number().int().positive(),
});

// Schema para busca por status
export const accountsPayableStatusSchema = z.object({
  status: z.enum(['pending', 'paid', 'overdue', 'cancelled']),
});

// Conversão para JSON Schema
export const accountsPayableIdJsonSchema = zodToJsonSchema(accountsPayableIdSchema);
export const accountsPayableCreateJsonSchema = zodToJsonSchema(accountsPayableCreateSchema);
export const accountsPayableUpdateJsonSchema = zodToJsonSchema(accountsPayableUpdateSchema);
export const accountsPayableSupplierJsonSchema = zodToJsonSchema(accountsPayableSupplierSchema);
export const accountsPayableStatusJsonSchema = zodToJsonSchema(accountsPayableStatusSchema);

// Tipos TypeScript
export type AccountsPayableIdType = z.infer<typeof accountsPayableIdSchema>;
export type AccountsPayableCreateType = z.infer<typeof accountsPayableCreateSchema>;
export type AccountsPayableUpdateType = z.infer<typeof accountsPayableUpdateSchema>;
export type AccountsPayableSupplierType = z.infer<typeof accountsPayableSupplierSchema>;
export type AccountsPayableStatusType = z.infer<typeof accountsPayableStatusSchema>;