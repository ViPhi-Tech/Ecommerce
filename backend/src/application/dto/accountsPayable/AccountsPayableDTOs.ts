import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

// ===== INPUT DTOs (Para Use Cases) =====
export interface CreateAccountsPayableInput {
  originalDueDate: string;
  issueDate: string;
  dueDate: string;
  competenceDate: string;
  amount: number;
  recurringPurchase?: boolean;
  description: string;
  supplierId: number;
  status?: 'pending' | 'paid' | 'overdue' | 'cancelled';
}

export interface UpdateAccountsPayableInput {
  supplierId?: number;
  originalDueDate?: string;
  issueDate?: string;
  dueDate?: string;
  competenceDate?: string;
  amount?: number;
  recurringPurchase?: boolean;
  description?: string;
  status?: 'pending' | 'paid' | 'overdue' | 'cancelled';
}

export interface FindAccountsPayableBySupplierInput {
  supplierId: number;
}

export interface FindAccountsPayableByStatusInput {
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
}

export interface UpdateAccountsPayableStatusInput {
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
}

// ===== VALIDATION SCHEMAS (Para HTTP) =====
// Todas as datas devem ser enviadas no formato 'YYYY-MM-DD' (ex: 2023-12-31)
export const createAccountsPayableSchema = z.object({
  originalDueDate: z.string().min(1, { message: 'Data de vencimento original é obrigatória' }),
  issueDate: z.string().min(1, { message: 'Data de emissão é obrigatória' }),
  dueDate: z.string().min(1, { message: 'Data de vencimento é obrigatória' }),
  competenceDate: z.string().min(1, { message: 'Data de competência é obrigatória' }),
  amount: z.number().positive({ message: 'Valor deve ser positivo' }),
  recurringPurchase: z.boolean().optional(),
  description: z.string().min(1, { message: 'Descrição é obrigatória' }),
  supplierId: z.number().int().positive({ message: 'ID do fornecedor deve ser um número inteiro positivo' }),
  status: z.enum(['pending', 'paid', 'overdue', 'cancelled'], { 
    message: 'Status deve ser: pending, paid, overdue ou cancelled' 
  }).optional()
});

export const updateAccountsPayableSchema = z.object({
  supplierId: z.number().int().positive({ message: 'ID do fornecedor deve ser um número inteiro positivo' }).optional(),
  originalDueDate: z.string().min(1, { message: 'Data de vencimento original inválida' }).optional(),
  issueDate: z.string().min(1, { message: 'Data de emissão inválida' }).optional(),
  dueDate: z.string().min(1, { message: 'Data de vencimento inválida' }).optional(),
  competenceDate: z.string().min(1, { message: 'Data de competência inválida' }).optional(),
  amount: z.number().positive({ message: 'Valor deve ser positivo' }).optional(),
  recurringPurchase: z.boolean().optional(),
  description: z.string().min(1, { message: 'Descrição é obrigatória' }).optional(),
  status: z.enum(['pending', 'paid', 'overdue', 'cancelled'], { 
    message: 'Status deve ser: pending, paid, overdue ou cancelled' 
  }).optional(),
});

export const accountsPayableIdSchema = z.object({
  id: z.number().int().positive({ message: 'ID deve ser um número inteiro positivo' }),
});

export const accountsPayableSupplierSchema = z.object({
  supplierId: z.number().int().positive({ message: 'ID do fornecedor deve ser um número inteiro positivo' }),
});

export const accountsPayableStatusSchema = z.object({
  status: z.enum(['pending', 'paid', 'overdue', 'cancelled'], { 
    message: 'Status deve ser: pending, paid, overdue ou cancelled' 
  }),
});

export const updateAccountsPayableStatusSchema = z.object({
  status: z.enum(['pending', 'paid', 'overdue', 'cancelled'], { 
    message: 'Status deve ser: pending, paid, overdue ou cancelled' 
  }),
});

// ===== JSON SCHEMAS (Para Swagger) =====
export const createAccountsPayableJsonSchema = zodToJsonSchema(createAccountsPayableSchema);
export const updateAccountsPayableJsonSchema = zodToJsonSchema(updateAccountsPayableSchema);
export const accountsPayableIdJsonSchema = zodToJsonSchema(accountsPayableIdSchema);
export const accountsPayableSupplierJsonSchema = zodToJsonSchema(accountsPayableSupplierSchema);
export const accountsPayableStatusJsonSchema = zodToJsonSchema(accountsPayableStatusSchema);
export const updateAccountsPayableStatusJsonSchema = zodToJsonSchema(updateAccountsPayableStatusSchema);

// ===== TYPES (Para TypeScript) =====
export type CreateAccountsPayableDTO = z.infer<typeof createAccountsPayableSchema>;
export type UpdateAccountsPayableDTO = z.infer<typeof updateAccountsPayableSchema>;
export type AccountsPayableIdDTO = z.infer<typeof accountsPayableIdSchema>;
export type AccountsPayableSupplierDTO = z.infer<typeof accountsPayableSupplierSchema>;
export type AccountsPayableStatusDTO = z.infer<typeof accountsPayableStatusSchema>;
export type UpdateAccountsPayableStatusDTO = z.infer<typeof updateAccountsPayableStatusSchema>;

// ===== RESPONSE DTOs =====
export interface AccountsPayableResponse {
  id: number;
  originalDueDate: Date;
  issueDate: Date;
  dueDate: Date;
  competenceDate: Date;
  amount: number;
  recurringPurchase: boolean;
  description: string;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  supplierId?: number;
  createdAt: Date;
  updatedAt: Date;
  supplier?: {
    id: number;
    name: string;
    email: string;
  };
}