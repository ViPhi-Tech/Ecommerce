import { IPaymentRepository } from "../../../domain/repositories/IPaymentRepository";
import { PrismaClient } from "@prisma/client";
import { Payment } from "../../../domain/entities/Payment";
export class paymentRepository implements IPaymentRepository {
    constructor(
        private prisma: PrismaClient
    ) {}

    async create(data: CreatePaymentInput): Promise<Payment> {
        return await this.prisma.payment.create({
            data
        })
    };

    async updateStatus(id: number, status: string) {
        return await this.prisma.payment.update({
            where: {id},
            data: {statusId: 1}
        })
    }
}