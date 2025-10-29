import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';


export interface DatesFilter {
    startDate?: string;
    endDate?: string;
}
// ===== INPUT DTOs (Para Use Cases) =====
export interface CreateAccountsReceivableInput {
  // originalDueDate: string;
  issueDate: string;
  dueDate: string;
  // competenceDate: string;
  amount: number;
  recurringIncome?: boolean;
  description: string;
  clientId: number;
  status?: 'pending' | 'received' | 'overdue' | 'cancelled';
  orders: number[];
}

export interface UpdateAccountsReceivableInput {
  clientId?: number;
  // originalDueDate?: string;
  issueDate?: string;
  dueDate?: string;
  // competenceDate?: string;
  amount?: number;
  recurringIncome?: boolean;
  description?: string;
  status?: 'pending' | 'received' | 'overdue' | 'cancelled';
}

export interface FindAccountsReceivableByClientInput {
  clientId: number;
}

export interface FindAccountsReceivableByStatusInput {
  status: 'pending' | 'received' | 'overdue' | 'cancelled';
}

export interface UpdateAccountsReceivableStatusInput {
  status: 'pending' | 'received' | 'overdue' | 'cancelled';
}

// ===== VALIDATION SCHEMAS (Para HTTP) =====
// Todas as datas devem ser enviadas no formato 'YYYY-MM-DD' (ex: 2023-12-31)
export const createAccountsReceivableSchema = z.object({
  // originalDueDate: z.string().min(1, { message: 'Data de vencimento original é obrigatória' }),
  issueDate: z.string().min(1, { message: 'Data de emissão é obrigatória' }),
  dueDate: z.string().min(1, { message: 'Data de vencimento é obrigatória' }),
  // competenceDate: z.string().min(1, { message: 'Data de competência é obrigatória' }),
  amount: z.number().positive({ message: 'Valor deve ser positivo' }),
  recurringIncome: z.boolean().optional(),
  description: z.string().optional(),
  clientId: z.number().int().positive({ message: 'ID do cliente deve ser um número inteiro positivo' }),
  status: z.enum(['pending', 'received', 'overdue', 'cancelled'], {
    message: 'Status deve ser: pending, received, overdue ou cancelled'
  }).optional(),
  orders: z.array(z.number().int().positive({ message: 'IDs dos pedidos devem ser números inteiros positivos' })).optional(),
});

export const createAccountsReceivableJsonSchema = zodToJsonSchema(createAccountsReceivableSchema);

export const updateAccountsReceivableSchema = z.object({
  clientId: z.number().int().positive({ message: 'ID do cliente deve ser um número inteiro positivo' }).optional(),
  // originalDueDate: z.string().min(1, { message: 'Data de vencimento original inválida' }).optional(),
  issueDate: z.string().min(1, { message: 'Data de emissão inválida' }).optional(),
  dueDate: z.string().min(1, { message: 'Data de vencimento inválida' }).optional(),
  // competenceDate: z.string().min(1, { message: 'Data de competência inválida' }).optional(),
  amount: z.number().positive({ message: 'Valor deve ser positivo' }).optional(),
  recurringIncome: z.boolean().optional(),
  description: z.string().min(1, { message: 'Descrição é obrigatória' }).optional(),
  status: z.enum(['pending', 'received', 'overdue', 'cancelled'], {
    message: 'Status deve ser: pending, received, overdue ou cancelled'
  }).optional(),
});

export const accountsReceivableIdSchema = z.object({
  id: z.number().int().positive({ message: 'ID deve ser um número inteiro positivo' }),
});

export const accountsReceivableClientSchema = z.object({
  clientId: z.number().int().positive({ message: 'ID do cliente deve ser um número inteiro positivo' }),
});

export const accountsReceivableStatusSchema = z.object({
  status: z.enum(['pending', 'received', 'overdue', 'cancelled'], {
    message: 'Status deve ser: pending, received, overdue ou cancelled'
  }),
});

export const datesFilterSchema = z.object({
  startDate: z.string().min(1).optional(),
  endDate: z.string().min(1).optional(),
});

export const dateFilterJsonSchema = zodToJsonSchema(datesFilterSchema);

// ===== RESPONSE DTOs =====
export interface AccountsReceivableResponse {
  id: number;
  // originalDueDate: Date;
  issueDate: Date;
  dueDate: Date;
  // competenceDate: Date;
  amount: number;
  recurringIncome: boolean;
  description: string;
  status: 'pending' | 'received' | 'overdue' | 'cancelled';
  clientId?: number;
  createdAt: Date;
  updatedAt: Date;
  client?: {
    id: number;
    name: string;
    email: string;
  };
}
