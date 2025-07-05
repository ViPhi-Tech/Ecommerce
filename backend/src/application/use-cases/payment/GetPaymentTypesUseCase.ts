import { PaymentType } from "../../dto/payment/PaymentType";
import { IPaymentRepository } from "../../../domain/repositories/IPaymentRepository";
export class GetPaymentTypeUseCase {
    constructor(
        private paymentRepository: IPaymentRepository
    ){}

    async execute(): Promise<PaymentType[]> {
        return await this.paymentRepository.getAll()
    }
}