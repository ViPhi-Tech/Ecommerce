import { FastifyRequest, FastifyReply } from 'fastify';
import { CreateOrderUseCase } from '../../../application/use-cases/order/CreateOrderUseCase';
import { FindByIdOrderUseCase } from '../../../application/use-cases/order/FindByIdOrderUseCase';
import { FindAllOrderUseCase } from '../../../application/use-cases/order/FindAllOrderUseCase';
import { FindAvailableOrdersUseCase } from '../../../application/use-cases/order/FindAvailableOrdersUseCase';
import { CreatePreOrderUseCase } from '../../../application/use-cases/order/CreatePreOrderUseCase';
import { GetOrderByClientUseCase } from '../../../application/use-cases/order/GetOrderByClientUseCase';
import { ApiResponse } from "../../../shared/types/apiResponse";
import { HTTP_STATUS } from "../../../shared/types/httpStatus";
import { HTTP_MESSAGES } from "../../../shared/types/httpMessages";

import { UpdateOrderUseCase } from '../../../application/use-cases/order/UpdateOrderUseCase';
import { CreateOrderDTO, OrderIdDTO, CreatePreOrderDTO, createOrderSchema, orderIdSchema, createPreOrderSchema } from "../../../application/dto/order/OrderDTOs";
import { DeleteOrderUseCase } from '../../../application/use-cases/order/DeleteOrderUseCase';
import { MarkOrderAsDeliveredUseCase } from '../../../application/use-cases/order/MarkOrderAsDeliveredUseCase';

export class OrderController {
    constructor(
        private createOrderUseCase: CreateOrderUseCase,
        private findByIdOrderUseCase: FindByIdOrderUseCase,
        private findallOrderUseCase: FindAllOrderUseCase,
        private createPreOrderUseCase: CreatePreOrderUseCase,
        private updateOrderUseCase: UpdateOrderUseCase,
        private getOrderByClientUseCase: GetOrderByClientUseCase,
        private deleteOrderUseCase: DeleteOrderUseCase,
        private markOrderAsDeliveredUseCase: MarkOrderAsDeliveredUseCase,
        private findAvailableOrdersUseCase: FindAvailableOrdersUseCase
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
            const { id } = request.params as { id?: number };
            if (typeof id !== 'number') {
                return reply.status(HTTP_STATUS.API_STATUS_BAD_REQUEST).send({
                    status: false,
                    descricao: 'Order ID is required and must be a number'
                });
            }
            return reply.status(HTTP_STATUS.API_STATUS_SUCCESS).send({
                status: true,
                descricao: HTTP_MESSAGES.API_STATUS_SUCCESS,
                data: await this.updateOrderUseCase.execute(id, orderData)
            });
        } catch (error) {
            return reply.status(HTTP_STATUS.API_STATUS_BAD_REQUEST).send({
                status: false,
                descricao: error instanceof Error? error.message : HTTP_MESSAGES.API_STATUS_BAD_REQUEST
            });
        }
    };


    async getOrdersByClient(request: FastifyRequest, reply: FastifyReply): Promise<ApiResponse> {
        try {
            const query = request.query as { clientId?: string; startDate?: string; endDate?: string; paymentTypeId?: string };
            if (!query.clientId || !query.startDate || !query.endDate) {
                return reply.status(HTTP_STATUS.API_STATUS_BAD_REQUEST).send({
                    status: false,
                    descricao: 'clientId, startDate and endDate are required'
                });
            }
            const orders = await this.getOrderByClientUseCase.execute({
                clientId: parseInt(query.clientId),
                startDate: query.startDate,
                endDate: query.endDate,
                paymentTypeId: query.paymentTypeId
            });
            return reply.status(HTTP_STATUS.API_STATUS_SUCCESS).send({
                status: true,
                descricao: HTTP_MESSAGES.API_STATUS_SUCCESS,
                data: orders
            });
        } catch (error) {
            return reply.status(HTTP_STATUS.API_STATUS_BAD_REQUEST).send({
                status: false,
                descricao: error instanceof Error? error.message : HTTP_MESSAGES.API_STATUS_BAD_REQUEST
            });
        }
    };

    async delete(request: FastifyRequest, reply: FastifyReply): Promise<ApiResponse> {
        try {
            const { id } = request.params as OrderIdDTO;
            await this.deleteOrderUseCase.execute(id);
            return reply.status(HTTP_STATUS.API_STATUS_NO_CONTENT).send();
        } catch (error) {
            return reply.status(HTTP_STATUS.API_STATUS_BAD_REQUEST).send({
                status: HTTP_MESSAGES.API_STATUS_BAD_REQUEST,
                description: error instanceof Error ? error.message : 'An unknown error occurred',
            });
        }
    }

    async markAsDelivered(request: FastifyRequest, reply: FastifyReply): Promise<ApiResponse> {
        try {
            const { id } = request.params as OrderIdDTO;
            return reply.status(HTTP_STATUS.API_STATUS_SUCCESS).send({
                status: HTTP_MESSAGES.API_STATUS_SUCCESS,
                data: await this.markOrderAsDeliveredUseCase.execute(id),
            });
        } catch (error) {
            return reply.status(HTTP_STATUS.API_STATUS_BAD_REQUEST).send({
                status: HTTP_MESSAGES.API_STATUS_BAD_REQUEST,
                description: error instanceof Error ? error.message : 'Erro desconhecido ao marcar pedido como entregue',
            });
        }
    }

    async findAvailable(request: FastifyRequest, reply: FastifyReply): Promise<ApiResponse> {
        try {
            return reply.status(HTTP_STATUS.API_STATUS_SUCCESS).send({
                status: HTTP_MESSAGES.API_STATUS_SUCCESS,
                data: await this.findAvailableOrdersUseCase.execute(),
            });
        } catch (error) {
            return reply.status(HTTP_STATUS.API_STATUS_BAD_REQUEST).send({
                status: HTTP_MESSAGES.API_STATUS_BAD_REQUEST,
                description: error instanceof Error ? error.message : 'Erro desconhecido ao buscar pedidos disponíveis',
            });
        }
    }
}