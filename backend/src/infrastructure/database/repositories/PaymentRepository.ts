import { IPaymentRepository } from "../../../domain/repositories/IPaymentRepository";
import { PrismaClient } from "@prisma/client";
import { Payment } from "../../../domain/entities/Payment";
import { PaymentCreateDTO, PaymentUpdateDTO } from "../../http/dto/Payment.dto";
export class paymentRepository implements IPaymentRepository {
    constructor(
        private prisma: PrismaClient
    ) {}


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
    }
}