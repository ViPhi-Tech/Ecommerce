import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

// ===== INPUT DTOs (Para Use Cases) =====
export interface CreatePaymentInput {
  orderId: number;
  value: number;
  statusId: string;
  typeId: string;
}

export interface UpdatePaymentInput {
  status?: string;
  amount?: number;
  currency?: string;
  paymentMethod?: string;
  paymentDate?: Date;
}

export interface PaymentTypeInput {
  name: string;
  label: string;
}

// ===== VALIDATION SCHEMAS (Para HTTP) =====
export const createPaymentSchema = z.object({
  orderId: z.number().min(1, { message: "ID do pedido é obrigatório" }),
  value: z.number().min(0, { message: "Valor deve ser maior que zero" }),
  statusId: z.string().min(1, { message: "Status é obrigatório" }),
  typeId: z.string().min(1, { message: "Tipo de pagamento é obrigatório" })
});

export const updatePaymentSchema = z.object({
  status: z.string().optional(),
  amount: z.number().min(0, { message: "Valor deve ser maior que zero" }).optional(),
  currency: z.string().min(1, { message: "Moeda é obrigatória" }).optional(),
  paymentMethod: z.enum(['credit_card', 'debit_card', 'pix', 'bank_transfer']).optional(),
  paymentDate: z.date().optional()
});

export const paymentIdSchema = z.object({
  id: z.string().uuid({ message: "ID do pagamento inválido" })
});

export const paymentTypeSchema = z.object({
  name: z.string().min(1, { message: "Nome do tipo é obrigatório" }),
  label: z.string().min(1, { message: "Label do tipo é obrigatório" })
});

export const paymentLabelSchema = z.object({
  value: z.number().min(0, { message: "Valor deve ser maior que zero" }),
  typeId: z.string().min(1, { message: "Tipo de pagamento é obrigatório" })
});

// ===== JSON SCHEMAS (Para Swagger) =====
export const createPaymentJsonSchema = zodToJsonSchema(createPaymentSchema);
export const updatePaymentJsonSchema = zodToJsonSchema(updatePaymentSchema);
export const paymentIdJsonSchema = zodToJsonSchema(paymentIdSchema);
export const paymentTypeJsonSchema = zodToJsonSchema(paymentTypeSchema);
export const paymentLabelJsonSchema = zodToJsonSchema(paymentLabelSchema);

// ===== TYPES (Para TypeScript) =====
export type CreatePaymentDTO = z.infer<typeof createPaymentSchema>;
export type UpdatePaymentDTO = z.infer<typeof updatePaymentSchema>;
export type PaymentIdDTO = z.infer<typeof paymentIdSchema>;
export type PaymentTypeDTO = z.infer<typeof paymentTypeSchema>;
export type PaymentLabelDTO = z.infer<typeof paymentLabelSchema>;

// ===== RESPONSE DTOs =====
export interface PaymentResponse {
  id: string;
  orderId: number;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: 'credit_card' | 'debit_card' | 'pix' | 'bank_transfer';
  paymentDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentTypeResponse {
  id: string;
  name: string;
  label: string;
  createdAt: Date;
  updatedAt: Date;
}