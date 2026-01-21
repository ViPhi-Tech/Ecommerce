import { FastifyRequest, FastifyReply } from 'fastify';
import { CreatePurchaseInvoiceUseCase } from '../../../application/use-cases/purchaseInvoice/CreatePurchaseInvoiceUseCase';
import { ApiResponse } from '../../../shared/types/apiResponse';
import { HTTP_STATUS } from '../../../shared/types/httpStatus';
import { HTTP_MESSAGES } from '../../../shared/types/httpMessages';
import { CreatePurchaseInvoiceInput } from '../../../application/dto/purchaseInvoice/PurchaseInvoiceDTOs';

export class PurchaseInvoiceController {
  constructor(
    private createPurchaseInvoiceUseCase: CreatePurchaseInvoiceUseCase
  ) {}

  async create(request: FastifyRequest, reply: FastifyReply): Promise<ApiResponse> {
    try {
      const data = request.body as CreatePurchaseInvoiceInput;
      const purchaseInvoice = await this.createPurchaseInvoiceUseCase.execute(data);
      return reply.status(HTTP_STATUS.API_STATUS_CREATED).send({
        status: true,
        descricao: HTTP_MESSAGES.API_STATUS_CREATED,
        dados: purchaseInvoice,
      });
    } catch (error: any) {
      console.error('Erro ao criar nota fiscal de compra:', error);
      return reply.status(HTTP_STATUS.API_STATUS_BAD_REQUEST).send({
        status: false,
        descricao: error.message || 'Erro ao processar nota fiscal',
      });
    }
  }
}
