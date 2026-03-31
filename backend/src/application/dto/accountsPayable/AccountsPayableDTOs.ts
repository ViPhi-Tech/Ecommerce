import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

// ===== INPUT DTOs (Para Use Cases) =====
export interface CreateAccountsPayableInput {
  originalDueDate: string;
  issueDate: string;
  dueDate: string;
  // competenceDate: string;
  amount: number;
  recurringPurchase?: boolean;
  description?: string | null;
  supplierId: number;
  status?: 'pending' | 'paid' | 'overdue' | 'cancelled';
}

export interface UpdateAccountsPayableInput {
  supplierId?: number;
  // originalDueDate?: string;
  issueDate?: string;
  dueDate?: string;
  // competenceDate?: string;
  amount?: number;
  recurringPurchase?: boolean;
  description?: string | null;
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
  // originalDueDate: z.string().min(1, { message: 'Data de vencimento original é obrigatória' }),
  issueDate: z.string().min(1, { message: 'Data de emissão é obrigatória' }),
  dueDate: z.string().min(1, { message: 'Data de vencimento é obrigatória' }),
  // competenceDate: z.string().min(1, { message: 'Data de competência é obrigatória' }),
  amount: z.number().positive({ message: 'Valor deve ser positivo' }),
  recurringPurchase: z.boolean().optional(),
  description: z.string().optional(),
  supplierId: z.number().int().positive({ message: 'ID do fornecedor deve ser um número inteiro positivo' }),
  status: z.enum(['pending', 'paid', 'overdue', 'cancelled'], { 
    message: 'Status deve ser: pending, paid, overdue ou cancelled' 
  }).optional()
});

export const updateAccountsPayableSchema = z.object({
  supplierId: z.number().int().positive({ message: 'ID do fornecedor deve ser um número inteiro positivo' }).optional(),
  // originalDueDate: z.string().min(1, { message: 'Data de vencimento original inválida' }).optional(),
  issueDate: z.string().min(1, { message: 'Data de emissão inválida' }).optional(),
  dueDate: z.string().min(1, { message: 'Data de vencimento inválida' }).optional(),
  // competenceDate: z.string().min(1, { message: 'Data de competência inválida' }).optional(),
  amount: z.number().positive({ message: 'Valor deve ser positivo' }).optional(),
  recurringPurchase: z.boolean().optional(),
  description: z.string().min(1, { message: 'Descrição é obrigatória' }).optional(),
  status: z.enum(['pending', 'paid', 'overdue', 'cancelled', 'due_soon'], { 
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
  status: z.enum(['pending', 'paid', 'overdue', 'cancelled', 'due_soon'], { 
    message: 'Status deve ser: pending, paid, overdue ou cancelled' 
  }),
});

const accountsPayableListStatusValues = [
  'all',
  'pending',
  'paid',
  'overdue',
  'due_soon',
  'cancelled',
] as const;

/** Query opcional em GET /all: filtra `dueDate` inclusivo e/ou `status` no banco. */
export const accountsPayableListQuerySchema = z
  .object({
    dueDateFrom: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'dueDateFrom must be YYYY-MM-DD',
      })
      .optional(),
    dueDateTo: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'dueDateTo must be YYYY-MM-DD',
      })
      .optional(),
    status: z.enum(accountsPayableListStatusValues).optional(),
  })
  .refine(
    q =>
      (q.dueDateFrom === undefined && q.dueDateTo === undefined) ||
      (q.dueDateFrom !== undefined && q.dueDateTo !== undefined),
    {
      message: 'dueDateFrom and dueDateTo must both be provided or both omitted',
    }
  )
  .refine(
    q => !q.dueDateFrom || !q.dueDateTo || q.dueDateFrom <= q.dueDateTo,
    { message: 'dueDateFrom must be on or before dueDateTo' }
  );

export type AccountsPayableListQueryDTO = z.infer<
  typeof accountsPayableListQuerySchema
>;

// ===== JSON SCHEMAS (Para Swagger) =====
export const createAccountsPayableJsonSchema = zodToJsonSchema(createAccountsPayableSchema);
export const updateAccountsPayableJsonSchema = zodToJsonSchema(updateAccountsPayableSchema);
export const accountsPayableIdJsonSchema = zodToJsonSchema(accountsPayableIdSchema);
export const accountsPayableSupplierJsonSchema = zodToJsonSchema(accountsPayableSupplierSchema);
export const accountsPayableStatusJsonSchema = zodToJsonSchema(accountsPayableStatusSchema);
export const updateAccountsPayableStatusJsonSchema = zodToJsonSchema(updateAccountsPayableStatusSchema);
export const accountsPayableListQueryJsonSchema = zodToJsonSchema(
  accountsPayableListQuerySchema
);

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
  // originalDueDate: Date;
  issueDate: Date;
  dueDate: Date;
  // competenceDate: Date;
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