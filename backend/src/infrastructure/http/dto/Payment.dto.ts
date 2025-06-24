import { z } from 'zod'

export const PaymentSchema = z.object({
  id: z.string().uuid().optional(),
  orderId: z.string().uuid(),
  amount: z.number().positive(),
  currency: z.string(),
  status: z.enum(['pending', 'completed', 'failed', 'refunded']),
  paymentMethod: z.enum(['credit_card', 'debit_card', 'pix', 'bank_transfer']),
  paymentDate: z.date().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
})

export type Payment = z.infer<typeof PaymentSchema>

export const CreatePaymentSchema = PaymentSchema.omit({
  id: true,
  paymentDate: true,
  createdAt: true,
  updatedAt: true
})

export type CreatePayment = z.infer<typeof CreatePaymentSchema>

export const UpdatePaymentSchema = PaymentSchema.partial().omit({
  id: true,
  createdAt: true,
  updatedAt: true
})

export type UpdatePayment = z.infer<typeof UpdatePaymentSchema>
