import { FastifyRequest, FastifyReply } from 'fastify';
import { HTTP_STATUS } from '../../../shared/types/httpStatus';
import { HTTP_MESSAGES } from '../../../shared/types/httpMessages';
import { ApiResponse } from '../../../shared/types/apiResponse';
import { GetPaymentTypeUseCase } from '../../../application/use-cases/payment/GetPaymentTypesUseCase';

export class PaymentController {
    constructor(
        private readonly getPaymentTypeUseCase: GetPaymentTypeUseCase
    ){}

  async getTypes(request: FastifyRequest, reply: FastifyReply): Promise<ApiResponse> {
    try {
     
      const paymentTypes = await this.getPaymentTypeUseCase.execute();
      return reply.code(HTTP_STATUS.API_STATUS_SUCCESS).send({
        status: true,
        descricao: HTTP_MESSAGES.API_STATUS_SUCCESS,
        dados: paymentTypes,
      });
    } catch (error) {
      console.error(error);
      return reply
        .code(HTTP_STATUS.API_STATUS_INTERNAL_ERROR)
        .send({
          status: false,
          descricao: HTTP_MESSAGES.API_STATUS_INTERNAL_ERROR,
          dados: null
        });
    }
  }
}
