import { FastifyRequest, FastifyReply } from 'fastify';
import { CreateProductUseCase } from "../../../domain/use-cases/product/CreateProductUseCase";
import {ApiResponse} from "../../../shared/types/apiResponse";
import { ProductCreateDTO } from "../../../shared/dtos/Product.dto";
import { HTTP_STATUS } from "../../../shared/types/httpStatus";
import { HTTP_MESSAGES } from "../../../shared/types/httpMessages";


export class ProductController {
    constructor(
        private createProductUseCase: CreateProductUseCase
    ) {}

    async create(request: FastifyRequest, reply: FastifyReply): Promise<ApiResponse> {
        try {
            const productData = request.body as ProductCreateDTO;
            const product = await this.createProductUseCase.execute(productData)
            return reply.code(HTTP_STATUS.API_STATUS_SUCCESS).send({status: true, descricao: HTTP_MESSAGES.API_STATUS_SUCCESS, dados: product})
        } catch (error) {
            console.log(error)
            return reply.code(HTTP_STATUS.API_STATUS_INTERNAL_ERROR).send({ status: false,  descricao: HTTP_MESSAGES.API_STATUS_INTERNAL_ERROR});
        }
    }
}