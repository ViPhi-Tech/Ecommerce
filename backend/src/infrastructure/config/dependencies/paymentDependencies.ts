import { GetPaymentTypeUseCase } from "../../../application/use-cases/payment/GetPaymentTypesUseCase";
import { IPaymentRepository } from "../../../domain/repositories/IPaymentRepository";
import { PaymentRepository } from "../../database/repositories/PaymentRepository";
import { prisma } from "../../database/prismaClient";
import { PaymentController } from "../../http/controllers/PaymentController";



const paymentRepository: IPaymentRepository = new PaymentRepository(prisma);

const getPaymentUseCase = new GetPaymentTypeUseCase(paymentRepository);

export const paymentController = new PaymentController(getPaymentUseCase);
