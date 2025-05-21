import { FastifyRequest, FastifyReply } from 'fastify';
import { CreateProductUseCase } from "../../../application/use-cases/product/CreateProductUseCase";
import { UpdateStockUseCase } from "../../../application/use-cases/product/UpdateStockUseCase";
import { UpdateProductUseCase } from '../../../application/use-cases/product/UpdateProductUseCase';
import { DeleteProductUseCase } from "../../../application/use-cases/product/DeleteProductUseCase"
import { FindByIdProductUseCase } from "../../../application/use-cases/product/FindByIdProductUseCase";
import { FindAllProductUseCase } from '../../../application/use-cases/product/FindAllProductUseCase';
import {ApiResponse} from "../../../shared/types/apiResponse";
import {ProductCreateDTO, ProductID, ProductUpdateStock} from "../dto/Product.dto";
import { HTTP_STATUS } from "../../../shared/types/httpStatus";
import { HTTP_MESSAGES } from "../../../shared/types/httpMessages";


export class ProductController {
    constructor(
        private createProductUseCase: CreateProductUseCase,
        private findProductByIdUseCase: FindByIdProductUseCase,
        private updateStockUseCase: UpdateStockUseCase,
        private updateProductUseCase: UpdateProductUseCase,
        private deleteProductUseCase: DeleteProductUseCase,
        private findAllProductUseCase: FindAllProductUseCase
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
    };

    async findAll(request: FastifyRequest, reply: FastifyReply): Promise<ApiResponse> {
        try{
            const products = await this.findAllProductUseCase.execute()
            return reply.code(HTTP_STATUS.API_STATUS_SUCCESS).send({status: true, descricao: HTTP_MESSAGES.API_STATUS_SUCCESS, dados: products})
        } catch (error) {
            console.log(error)
            return reply.code(HTTP_STATUS.API_STATUS_INTERNAL_ERROR).send({ status: false,  descricao: HTTP_MESSAGES.API_STATUS_INTERNAL_ERROR});
        }
    }

    async findById(request: FastifyRequest, reply: FastifyReply): Promise<ApiResponse> {
        try{
            const ProductID = request.body as ProductID
            const product = await this.findProductByIdUseCase.execute(ProductID)
            return reply.code(HTTP_STATUS.API_STATUS_SUCCESS).send({status: true, descricao: HTTP_MESSAGES.API_STATUS_SUCCESS, dados: product})
        } catch (error) {
            console.log(error)
            return reply.code(HTTP_STATUS.API_STATUS_INTERNAL_ERROR).send({ status: false,  descricao: HTTP_MESSAGES.API_STATUS_INTERNAL_ERROR});
        }

    };

    async updateStock(request: FastifyRequest, reply: FastifyReply): Promise<ApiResponse> {
        try{
            const stock = request.body as ProductUpdateStock
            const data_stock = await this.updateStockUseCase.execute(stock)
            return reply.code(HTTP_STATUS.API_STATUS_SUCCESS).send({status: true, descricao: HTTP_MESSAGES.API_STATUS_SUCCESS, dados: data_stock})
        } catch (error) {
            console.log(error)
            return reply.code(HTTP_STATUS.API_STATUS_INTERNAL_ERROR).send({ status: false,  descricao: HTTP_MESSAGES.API_STATUS_INTERNAL_ERROR});
        }
    };

    async update(request: FastifyRequest, reply: FastifyReply): Promise<ApiResponse> {
        try{
            const product = request.body as ProductCreateDTO
            const data_product = await this.updateProductUseCase.execute(product)
            return reply.code(HTTP_STATUS.API_STATUS_SUCCESS).send({status: true, descricao: HTTP_MESSAGES.API_STATUS_SUCCESS, dados: data_product})
        } catch (error) {
            console.log(error)
            return reply.code(HTTP_STATUS.API_STATUS_INTERNAL_ERROR).send({ status: false,  descricao: HTTP_MESSAGES.API_STATUS_INTERNAL_ERROR});
        }
    };

    async delete (request: FastifyRequest, reply: FastifyReply): Promise<ApiResponse> {
        try{
            const product = request.body as ProductID
            const data_product = await this.deleteProductUseCase.execute(product.id)
            return reply.code(HTTP_STATUS.API_STATUS_SUCCESS).send({status: true, descricao: HTTP_MESSAGES.API_STATUS_SUCCESS, dados: data_product})
        } catch (error) {
            console.log(error)
            return reply.code(HTTP_STATUS.API_STATUS_INTERNAL_ERROR).send({ status: false,  descricao: HTTP_MESSAGES.API_STATUS_INTERNAL_ERROR});
        }
    }
}
