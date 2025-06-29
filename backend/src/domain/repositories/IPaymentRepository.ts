import { Payment } from "../entities/Payment"
export interface IPaymentRepository{
    create: (payment: Payment) => Promise<Payment>
    updateStatus: (paymentId: number, status: string) => Promise<Payment>,
    createMany: (orderId: number, payments: Payment[]) => Promise<Payment[]>
}