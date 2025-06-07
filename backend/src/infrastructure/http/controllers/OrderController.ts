import { FastifyRequest, FastifyReply } from 'fastify';
import { CreateOrderUseCase } from '../../../application/use-cases/order/CreateOrderUseCase';
import { ApiResponse } from "../../../shared/types/apiResponse";
import { HTTP_STATUS } from "../../../shared/types/httpStatus";
import { HTTP_MESSAGES } from "../../../shared/types/httpMessages";

import { OrderCreateDTO } from "../dto/Order.dto";

export class OrderController {
    constructor(
        private createOrderUseCase: CreateOrderUseCase,
    ) {}
    async create(request: FastifyRequest, reply: FastifyReply): Promise<ApiResponse> {
        try{
            const orderCreate = request.body as OrderCreateDTO;
            const created = await this.createOrderUseCase.execute(orderCreate);
            return reply.status(HTTP_STATUS.API_STATUS_CREATED).send({
                status: HTTP_MESSAGES.API_STATUS_SUCCESS,
                data: await this.createOrderUseCase.execute(request.body as any),
            });
        } catch (error) {
            return reply.status(HTTP_STATUS.API_STATUS_BAD_REQUEST).send({
                status: HTTP_MESSAGES.API_STATUS_BAD_REQUEST,
                description: error instanceof Error ? error.message : 'An unknown error occurred',
            });
        }

    }
}