import { CreatePaymentInput } from "../../dto/payment/CreatePaymentInput";
import { ResponsePayment } from "../../dto/payment/ResponsePayment";
import { IPaymentRepository } from "../../../domain/repositories/IPaymentRepository";
export class CreatePaymentUseCase {
    constructor(
        private paymentRepository: IPaymentRepository
    ){}

    async execute(data: CreatePaymentInput): Promise<ResponsePayment> {
        return await this.paymentRepository.create(data)
    }
}