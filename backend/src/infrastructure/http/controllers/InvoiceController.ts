import { FastifyRequest, FastifyReply } from 'fastify';
import { CreateInvoiceUseCase } from '../../../application/use-cases/invoice/CreateInvoiceUseCase';
import { FindInvoiceByIdUseCase } from '../../../application/use-cases/invoice/FindInvoiceByIdUseCase';
import { FindAllInvoicesUseCase } from '../../../application/use-cases/invoice/FindAllInvoicesUseCase';
import { UpdateInvoiceUseCase } from '../../../application/use-cases/invoice/UpdateInvoiceUseCase';
import { DeleteInvoiceUseCase } from '../../../application/use-cases/invoice/DeleteInvoiceUseCase';
import { ApiResponse } from "../../../shared/types/apiResponse";
import { HTTP_STATUS } from "../../../shared/types/httpStatus";
import { HTTP_MESSAGES } from "../../../shared/types/httpMessages";
import { CreateInvoiceDTO, UpdateInvoiceDTO, InvoiceIdDTO, createInvoiceSchema, updateInvoiceSchema, invoiceIdSchema } from "../../../application/dto/invoice/InvoiceDTOs";

export class InvoiceController {
  constructor(
    private createInvoiceUseCase: CreateInvoiceUseCase,
    private findInvoiceByIdUseCase: FindInvoiceByIdUseCase,
    private findAllInvoicesUseCase: FindAllInvoicesUseCase,
    private updateInvoiceUseCase: UpdateInvoiceUseCase,
    private deleteInvoiceUseCase: DeleteInvoiceUseCase,
  ) {}

  async create(request: FastifyRequest, reply: FastifyReply): Promise<ApiResponse> {
    try {
      const data = request.body as CreateInvoiceDTO
      const invoice = await this.createInvoiceUseCase.execute(data);
      return reply.status(HTTP_STATUS.API_STATUS_CREATED).send({ status: true, descricao: HTTP_MESSAGES.API_STATUS_CREATED, data: invoice });
    } catch (error) {
      return reply.status(HTTP_STATUS.API_STATUS_BAD_REQUEST).send({
                status: HTTP_MESSAGES.API_STATUS_BAD_REQUEST,
                description: error instanceof Error ? error.message : 'An unknown error occurred',
            });
        }
  }

  async findById(request: FastifyRequest, reply: FastifyReply): Promise<ApiResponse> {
    try {
      const param = request.params as InvoiceIdDTO
      const invoice = await this.findInvoiceByIdUseCase.execute(param.id);
      return reply.status(HTTP_STATUS.API_STATUS_SUCCESS).send({status: true, descricao: HTTP_MESSAGES.API_STATUS_SUCCESS ,data: invoice });
    } catch (error) {
        return reply.status(HTTP_STATUS.API_STATUS_BAD_REQUEST).send({status: HTTP_MESSAGES.API_STATUS_BAD_REQUEST,
                description: error instanceof Error ? error.message : 'An unknown error occurred',
            });
      }
  }

  async findAll(request: FastifyRequest, reply: FastifyReply): Promise<ApiResponse> {
    try {
      const invoices = await this.findAllInvoicesUseCase.execute();
      return reply.status(200).send({status: true, descricao: HTTP_MESSAGES.API_STATUS_SUCCESS, data: invoices });
    } catch (error) {
            return reply.status(HTTP_STATUS.API_STATUS_BAD_REQUEST).send({
                status: HTTP_MESSAGES.API_STATUS_BAD_REQUEST,
                description: error instanceof Error ? error.message : 'An unknown error occurred',
            });
        }
  }

  async update(request: FastifyRequest, reply: FastifyReply): Promise<ApiResponse> {
    try {
      const data = request.body as UpdateInvoiceDTO
    const { id, ...updateData } = data;

      const invoiceUpdated = await this.updateInvoiceUseCase.execute(updateData);
      return reply.status(HTTP_STATUS.API_STATUS_SUCCESS).send({ status: true, descricao: HTTP_MESSAGES.API_STATUS_SUCCESS, data: invoiceUpdated });
    } catch (error) {
            return reply.status(HTTP_STATUS.API_STATUS_BAD_REQUEST).send({
                status: HTTP_MESSAGES.API_STATUS_BAD_REQUEST,
                description: error instanceof Error ? error.message : 'An unknown error occurred',
            });
        }
  };

  async delete(request: FastifyRequest, reply: FastifyReply): Promise<ApiResponse> {
    try {
      const invoice = request.params as InvoiceIdDTO
      await this.deleteInvoiceUseCase.execute(invoice.id);
      return reply.status(HTTP_STATUS.API_STATUS_NO_CONTENT).send();
    } catch (error) {
            return reply.status(HTTP_STATUS.API_STATUS_BAD_REQUEST).send({
                status: HTTP_MESSAGES.API_STATUS_BAD_REQUEST,
                description: error instanceof Error ? error.message : 'An unknown error occurred',
            });
        }
  }
}