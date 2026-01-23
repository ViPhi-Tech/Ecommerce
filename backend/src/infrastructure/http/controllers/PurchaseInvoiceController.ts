import { FastifyRequest, FastifyReply } from 'fastify';
import { CreatePurchaseInvoiceUseCase } from '../../../application/use-cases/purchaseInvoice/CreatePurchaseInvoiceUseCase';
import { FindPurchaseInvoiceByIdUseCase } from '../../../application/use-cases/purchaseInvoice/FindPurchaseInvoiceByIdUseCase';
import { FindAllPurchaseInvoicesUseCase } from '../../../application/use-cases/purchaseInvoice/FindAllPurchaseInvoicesUseCase';
import { ApiResponse } from '../../../shared/types/apiResponse';
import { HTTP_STATUS } from '../../../shared/types/httpStatus';
import { HTTP_MESSAGES } from '../../../shared/types/httpMessages';
import { CreatePurchaseInvoiceInput } from '../../../application/dto/purchaseInvoice/PurchaseInvoiceDTOs';

export class PurchaseInvoiceController {
  constructor(
    private createPurchaseInvoiceUseCase: CreatePurchaseInvoiceUseCase,
    private findPurchaseInvoiceByIdUseCase: FindPurchaseInvoiceByIdUseCase,
    private findAllPurchaseInvoicesUseCase: FindAllPurchaseInvoicesUseCase
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

  async findById(request: FastifyRequest, reply: FastifyReply): Promise<ApiResponse> {
    try {
      const params = request.params as { id: string };
      const id = Number(params.id);
      
      if (isNaN(id)) {
        return reply.status(HTTP_STATUS.API_STATUS_BAD_REQUEST).send({
          status: false,
          descricao: 'ID inválido',
        });
      }

      const purchaseInvoice = await this.findPurchaseInvoiceByIdUseCase.execute(id);
      return reply.status(HTTP_STATUS.API_STATUS_SUCCESS).send({
        status: true,
        descricao: HTTP_MESSAGES.API_STATUS_SUCCESS,
        dados: purchaseInvoice,
      });
    } catch (error: any) {
      console.error('Erro ao buscar nota fiscal:', error);
      return reply.status(HTTP_STATUS.API_STATUS_BAD_REQUEST).send({
        status: false,
        descricao: error.message || 'Erro ao buscar nota fiscal',
      });
    }
  }

  async findAll(request: FastifyRequest, reply: FastifyReply): Promise<ApiResponse> {
    try {
      const purchaseInvoices = await this.findAllPurchaseInvoicesUseCase.execute();
      return reply.status(HTTP_STATUS.API_STATUS_SUCCESS).send({
        status: true,
        descricao: HTTP_MESSAGES.API_STATUS_SUCCESS,
        dados: purchaseInvoices,
      });
    } catch (error: any) {
      console.error('Erro ao listar notas fiscais:', error);
      return reply.status(HTTP_STATUS.API_STATUS_BAD_REQUEST).send({
        status: false,
        descricao: error.message || 'Erro ao listar notas fiscais',
      });
    }
  }
}
