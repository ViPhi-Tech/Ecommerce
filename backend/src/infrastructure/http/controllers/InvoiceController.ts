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
        private deleteInvoiceUseCase: DeleteInvoiceUseCase
    ) {}

    async create(request: FastifyRequest, reply: FastifyReply): Promise<ApiResponse> {
        try {
            const invoiceData = createInvoiceSchema.parse(request.body);
            const invoice = await this.createInvoiceUseCase.execute(invoiceData);
            return reply.status(HTTP_STATUS.API_STATUS_CREATED).send({
                status: HTTP_MESSAGES.API_STATUS_SUCCESS,
                data: invoice,
            });
        } catch (error) {
            return reply.status(HTTP_STATUS.API_STATUS_BAD_REQUEST).send({
                status: HTTP_MESSAGES.API_STATUS_BAD_REQUEST,
                description: error instanceof Error ? error.message : 'An unknown error occurred',
            });
        }
    }

    async findById(request: FastifyRequest, reply: FastifyReply): Promise<ApiResponse> {
        try {
            const invoiceParams = invoiceIdSchema.parse(request.params);
            const invoice = await this.findInvoiceByIdUseCase.execute(invoiceParams.id);
            return reply.status(HTTP_STATUS.API_STATUS_SUCCESS).send({
                status: HTTP_MESSAGES.API_STATUS_SUCCESS,
                data: invoice,
            });
        } catch (error) {
            return reply.status(HTTP_STATUS.API_STATUS_BAD_REQUEST).send({
                status: HTTP_MESSAGES.API_STATUS_BAD_REQUEST,
                description: error instanceof Error ? error.message : 'An unknown error occurred',
            });
        }
    }

    async findAll(request: FastifyRequest, reply: FastifyReply): Promise<ApiResponse> {
        try {
            const invoices = await this.findAllInvoicesUseCase.execute();
            return reply.status(HTTP_STATUS.API_STATUS_SUCCESS).send({
                status: HTTP_MESSAGES.API_STATUS_SUCCESS,
                data: invoices,
            });
        } catch (error) {
            return reply.status(HTTP_STATUS.API_STATUS_BAD_REQUEST).send({
                status: HTTP_MESSAGES.API_STATUS_BAD_REQUEST,
                description: error instanceof Error ? error.message : 'An unknown error occurred',
            });
        }
    }

    async update(request: FastifyRequest, reply: FastifyReply): Promise<ApiResponse> {
        try {
            const invoiceData = updateInvoiceSchema.parse(request.body);
            const invoice = await this.updateInvoiceUseCase.execute(invoiceData);
            return reply.status(HTTP_STATUS.API_STATUS_SUCCESS).send({
                status: HTTP_MESSAGES.API_STATUS_SUCCESS,
                data: invoice,
            });
        } catch (error) {
            return reply.status(HTTP_STATUS.API_STATUS_BAD_REQUEST).send({
                status: HTTP_MESSAGES.API_STATUS_BAD_REQUEST,
                description: error instanceof Error ? error.message : 'An unknown error occurred',
            });
        }
    }

    async delete(request: FastifyRequest, reply: FastifyReply): Promise<ApiResponse> {
        try {
            const invoiceParams = invoiceIdSchema.parse(request.params);
            await this.deleteInvoiceUseCase.execute(invoiceParams.id);
            return reply.status(HTTP_STATUS.API_STATUS_SUCCESS).send({
                status: HTTP_MESSAGES.API_STATUS_SUCCESS,
                message: 'Invoice deleted successfully',
            });
        } catch (error) {
            return reply.status(HTTP_STATUS.API_STATUS_BAD_REQUEST).send({
                status: HTTP_MESSAGES.API_STATUS_BAD_REQUEST,
                description: error instanceof Error ? error.message : 'An unknown error occurred',
            });
        }
    }
}