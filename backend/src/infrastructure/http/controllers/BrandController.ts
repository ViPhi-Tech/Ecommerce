import { FastifyRequest, FastifyReply } from 'fastify';
import { CreateBrandUseCase } from '../../../application/use-cases/brand/CreateBrandUseCase';
import { UpdateBrandUseCase } from '../../../application/use-cases/brand/UpdateBrandUseCase';
import { DeleteBrandUseCase } from '../../../application/use-cases/brand/DeleteBrandUseCase';
import { FindByIdBrandUseCase } from "../../../application/use-cases/brand/FindByIdBrandUseCase";
import { FindAllBrandUseCase } from '../../../application/use-cases/brand/FindAllBrandUseCase';
import { ApiResponse } from "../../../shared/types/apiResponse";
import { BrandCreateDTO, BrandUpdateDTO } from "../../../application/dto/brand/Brand.dto";
import { HTTP_STATUS } from "../../../shared/types/httpStatus";
import { HTTP_MESSAGES } from "../../../shared/types/httpMessages";

export class BrandController {
    constructor(
        private createBrandUseCase: CreateBrandUseCase,
        private findBrandByIdUseCase: FindByIdBrandUseCase,
        private updateBrandUseCase: UpdateBrandUseCase,
        private deleteBrandUseCase: DeleteBrandUseCase,
        private findAllBrandUseCase: FindAllBrandUseCase
    ) {}
    
    async create(request: FastifyRequest, reply: FastifyReply): Promise<ApiResponse> {
        try {
            const brandData = request.body as BrandCreateDTO;
            const brand = await this.createBrandUseCase.execute(brandData)
            return reply.code(HTTP_STATUS.API_STATUS_SUCCESS).send({status: true, descricao: HTTP_MESSAGES.API_STATUS_SUCCESS, dados: brand})
        } catch (error) {
            console.log(error)
            return reply.code(HTTP_STATUS.API_STATUS_INTERNAL_ERROR).send({ status: false, descricao: HTTP_MESSAGES.API_STATUS_INTERNAL_ERROR});
        }
    };

    async findAll(request: FastifyRequest, reply: FastifyReply): Promise<ApiResponse> {
        try{
            const brands = await this.findAllBrandUseCase.execute()
            return reply.code(HTTP_STATUS.API_STATUS_SUCCESS).send({status: true, descricao: HTTP_MESSAGES.API_STATUS_SUCCESS, dados: brands})
        } catch (error) {
            console.log(error)
            return reply.code(HTTP_STATUS.API_STATUS_INTERNAL_ERROR).send({ status: false, descricao: HTTP_MESSAGES.API_STATUS_INTERNAL_ERROR});
        }
    }

    async findById(request: FastifyRequest, reply: FastifyReply): Promise<ApiResponse> {
        try{
            const { id } = request.params as { id: string };
            const brand = await this.findBrandByIdUseCase.execute(parseInt(id))
            return reply.code(HTTP_STATUS.API_STATUS_SUCCESS).send({status: true, descricao: HTTP_MESSAGES.API_STATUS_SUCCESS, dados: brand})
        } catch (error) {
            console.log(error)
            return reply.code(HTTP_STATUS.API_STATUS_INTERNAL_ERROR).send({ status: false, descricao: HTTP_MESSAGES.API_STATUS_INTERNAL_ERROR});
        }
    };

    async update(request: FastifyRequest, reply: FastifyReply): Promise<ApiResponse> {
        try{
            const { id } = request.params as { id: string };
            const brand = request.body as BrandUpdateDTO
            const data_brand = await this.updateBrandUseCase.execute(parseInt(id), brand)
            return reply.code(HTTP_STATUS.API_STATUS_SUCCESS).send({status: true, descricao: HTTP_MESSAGES.API_STATUS_SUCCESS, dados: data_brand})
        } catch (error) {
            console.log(error)
            return reply.code(HTTP_STATUS.API_STATUS_INTERNAL_ERROR).send({ status: false, descricao: HTTP_MESSAGES.API_STATUS_INTERNAL_ERROR});
        }
    };

    async delete(request: FastifyRequest, reply: FastifyReply): Promise<ApiResponse> {
        try{
            const { id } = request.params as { id: string };
            const data_brand = await this.deleteBrandUseCase.execute(parseInt(id))
            return reply.code(HTTP_STATUS.API_STATUS_SUCCESS).send({status: true, descricao: HTTP_MESSAGES.API_STATUS_SUCCESS, dados: data_brand})
        } catch (error) {
            console.log(error)
            return reply.code(HTTP_STATUS.API_STATUS_INTERNAL_ERROR).send({ status: false, descricao: HTTP_MESSAGES.API_STATUS_INTERNAL_ERROR});
        }
    }
}