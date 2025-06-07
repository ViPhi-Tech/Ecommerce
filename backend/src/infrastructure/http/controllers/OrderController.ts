import { FastifyRequest, FastifyReply } from 'fastify';
import { CreateOrderUseCase } from '../../../application/use-cases/order/CreateOrderUseCase';
import { FindByIdOrderUseCase } from '../../../application/use-cases/order/FindByIdOrderUseCase';
import { FindAllOrderUseCase } from '../../../application/use-cases/order/FindAllOrderUseCase';
import { ApiResponse } from "../../../shared/types/apiResponse";
import { HTTP_STATUS } from "../../../shared/types/httpStatus";
import { HTTP_MESSAGES } from "../../../shared/types/httpMessages";

import { OrderCreateDTO, OrderID } from "../dto/Order.dto";

export class OrderController {
    constructor(
        private createOrderUseCase: CreateOrderUseCase,
        private findByIdOrderUseCase: FindByIdOrderUseCase,
        private findallOrderUseCase: FindAllOrderUseCase,
    ) {}
    async create(request: FastifyRequest, reply: FastifyReply): Promise<ApiResponse> {
        try{

            return reply.status(HTTP_STATUS.API_STATUS_CREATED).send({
                status: HTTP_MESSAGES.API_STATUS_SUCCESS,
                data: await this.createOrderUseCase.execute(request.body as OrderCreateDTO),
            });
        } catch (error) {
            return reply.status(HTTP_STATUS.API_STATUS_BAD_REQUEST).send({
                status: HTTP_MESSAGES.API_STATUS_BAD_REQUEST,
                description: error instanceof Error ? error.message : 'An unknown error occurred',
            });
        }

    };


    async findById(request: FastifyRequest, reply: FastifyReply): Promise<ApiResponse> {
        const order = request.params as OrderID;
        try {
            return reply.status(HTTP_STATUS.API_STATUS_SUCCESS).send({
                status: HTTP_MESSAGES.API_STATUS_SUCCESS,
                data: await this.findByIdOrderUseCase.execute(order.id),
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
    }
}