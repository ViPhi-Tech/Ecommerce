import { number, z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

export const paymentSchemaDTO = z.object({
  id: number().optional(),
  orderId: z.number().optional(),
  amount: z.number().min(0, { message: "Valor deve ser maior que zero" }),
  currency: z.string().min(1, { message: "Moeda é obrigatória" }),
  status: z.enum(['pending', 'completed', 'failed', 'refunded'], {
    message: "Status deve ser: pending, completed, failed ou refunded"
  }),
  paymentMethod: z.enum(['credit_card', 'debit_card', 'pix', 'bank_transfer'], {
    message: "Método de pagamento deve ser: credit_card, debit_card, pix ou bank_transfer"
  })
});

export const paymentCreateSchema = z.object({
  orderId: z.number(),
  value: z.number().min(0, { message: "Valor deve ser maior que zero" }),
  statusId: z.string(),
  typeId: z.string()
});

export const PaymentLabel = z.object({
  value: z.number().min(0, { message: "Valor deve ser maior que zero" }),
  typeId: z.string()
})

export const paymentIDSchema = z.object({
  id: z.string().uuid({ message: "ID do pagamento inválido" })
});

export const paymentUpdateSchema = z.object({
  id: z.number(),
  status: z.string().optional(),
  amount: z.number().min(0, { message: "Valor deve ser maior que zero" }).optional(),
  currency: z.string().min(1, { message: "Moeda é obrigatória" }).optional(),
  paymentMethod: z.string().optional(),
  paymentDate: z.date().optional()
});

export const paymentJsonSchema = zodToJsonSchema(paymentSchemaDTO);
export const paymentCreateJsonSchema = zodToJsonSchema(paymentCreateSchema);
export const paymentIdJsonSchema = zodToJsonSchema(paymentIDSchema);
export const paymentUpdateJsonSchema = zodToJsonSchema(paymentUpdateSchema);

export type PaymentDTO = z.infer<typeof paymentSchemaDTO>;
export type PaymentCreateDTO = z.infer<typeof paymentCreateSchema>;
export type PaymentID = z.infer<typeof paymentIDSchema>;
export type PaymentUpdateDTO = z.infer<typeof paymentUpdateSchema>;
