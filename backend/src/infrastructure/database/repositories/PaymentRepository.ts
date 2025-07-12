import { IPaymentRepository } from "../../../domain/repositories/IPaymentRepository";
import { PrismaClient, Prisma } from "@prisma/client";
import { Payment, PaymentType } from "../../../domain/entities/Payment";
import { PaymentCreateDTO, PaymentUpdateDTO } from "../../http/dto/Payment.dto";
export class PaymentRepository implements IPaymentRepository {
  constructor(private prisma: PrismaClient | Prisma.TransactionClient) {}



    async createMany(orderId: number, payments: Payment[]): Promise<Payment[]> {
  // Cria os pagamentos em lote
    await this.prisma.payment.createMany({
        data: payments
    });

    return await this.prisma.payment.findMany({
        where: {
        orderId
        }
    });
    }

    async create(data: PaymentCreateDTO): Promise<Payment> {
        return await this.prisma.payment.create({
            data
        })
    };

    async updateStatus(id: number, status: string ): Promise<Payment> {
        return await this.prisma.payment.update({
            where: {id},
            data: {statusId: status}
        })
    };

    async getAll(): Promise<PaymentType[]> {
        return this.prisma.paymentType.findMany().then(types => types.map(type => ({
            ...type,
            createdAt: type.createdAt.toISOString(),
            updatedAt: type.updatedAt.toISOString()
        })))
    }
}