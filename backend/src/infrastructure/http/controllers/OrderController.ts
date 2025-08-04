import { FastifyRequest, FastifyReply } from 'fastify';
import { CreateOrderUseCase } from '../../../application/use-cases/order/CreateOrderUseCase';
import { FindByIdOrderUseCase } from '../../../application/use-cases/order/FindByIdOrderUseCase';
import { FindAllOrderUseCase } from '../../../application/use-cases/order/FindAllOrderUseCase';
import { CreatePreOrderUseCase } from '../../../application/use-cases/order/CreatePreOrderUseCase';
import { ApiResponse } from "../../../shared/types/apiResponse";
import { HTTP_STATUS } from "../../../shared/types/httpStatus";
import { HTTP_MESSAGES } from "../../../shared/types/httpMessages";

import { UpdateOrderUseCase } from '../../../application/use-cases/order/UpdateOrderUseCase';
import { CreateOrderDTO, OrderIdDTO, CreatePreOrderDTO, createOrderSchema, orderIdSchema, createPreOrderSchema } from "../../../application/dto/order/OrderDTOs";

export class OrderController {
    constructor(
        private createOrderUseCase: CreateOrderUseCase,
        private findByIdOrderUseCase: FindByIdOrderUseCase,
        private findallOrderUseCase: FindAllOrderUseCase,
        private createPreOrderUseCase: CreatePreOrderUseCase,
        private updateOrderUseCase: UpdateOrderUseCase
    ) {}
    async create(request: FastifyRequest, reply: FastifyReply): Promise<ApiResponse> {
    try {
        const authHeader = request.headers.authorization ?? '';
        const token = authHeader.startsWith('Bearer ')
        ? authHeader.slice(7).trim()
        : authHeader;

        const orderData = createOrderSchema.parse(request.body);

        return reply.status(HTTP_STATUS.API_STATUS_CREATED).send({
        status: HTTP_MESSAGES.API_STATUS_SUCCESS,
        data: await this.createOrderUseCase.execute(
            orderData,
            token
        ),
        });
    } catch (error) {
        return reply.status(HTTP_STATUS.API_STATUS_BAD_REQUEST).send({
        status: HTTP_MESSAGES.API_STATUS_BAD_REQUEST,
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        });
    }
    };


    async findById(request: FastifyRequest, reply: FastifyReply): Promise<ApiResponse> {
        const orderParams = orderIdSchema.parse(request.params);
        try {
            return reply.status(HTTP_STATUS.API_STATUS_SUCCESS).send({
                status: HTTP_MESSAGES.API_STATUS_SUCCESS,
                data: await this.findByIdOrderUseCase.execute(orderParams.id),
            }); 
        } catch (error) {
            return reply.status(HTTP_STATUS.API_STATUS_BAD_REQUEST).send({
                status: HTTP_MESSAGES.API_STATUS_BAD_REQUEST,
                description: error instanceof Error? error.message : 'An unknown error occurred',
            });
        }
    };

    async findAll(request: FastifyRequest, reply: FastifyReply): Promise<ApiResponse> {
        try {
            return reply.status(HTTP_STATUS.API_STATUS_SUCCESS).send({
                status: HTTP_MESSAGES.API_STATUS_SUCCESS,
                data: await this.findallOrderUseCase.execute(),
            });
        } catch (error) {
            return reply.status(HTTP_STATUS.API_STATUS_BAD_REQUEST).send({
                status: HTTP_MESSAGES.API_STATUS_BAD_REQUEST,
                description: error instanceof Error? error.message : 'An unknown error occurred',
            });
        }
    };

    async createPreOrder(request: FastifyRequest, reply: FastifyReply): Promise<ApiResponse> {
        const client = request.body as CreatePreOrderDTO
        return reply.status(HTTP_STATUS.API_STATUS_SUCCESS).send({
            status: HTTP_MESSAGES.API_STATUS_SUCCESS,
            data: await this.createPreOrderUseCase.execute(client.clientId),
        });
    };

    async updateOrder(request: FastifyRequest, reply: FastifyReply): Promise<ApiResponse> {
        try {
            const orderData = createOrderSchema.parse(request.body);
            return reply.status(HTTP_STATUS.API_STATUS_SUCCESS).send({
                status: true,
                descricao: HTTP_MESSAGES.API_STATUS_SUCCESS,
                data: await this.updateOrderUseCase.execute(orderData.clientId, orderData)
            });
        } catch (error) {
            return reply.status(HTTP_STATUS.API_STATUS_BAD_REQUEST).send({
                status: false,
                descricao: error instanceof Error? error.message : HTTP_MESSAGES.API_STATUS_BAD_REQUEST
            });
        }
    }
}