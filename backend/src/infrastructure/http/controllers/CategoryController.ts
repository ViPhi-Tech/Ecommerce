import { FastifyRequest, FastifyReply } from 'fastify';
import { CreateCategoryUseCase } from '../../../application/use-cases/category/CreateCategoryUseCase';
import { UpdateCategoryUseCase } from '../../../application/use-cases/category/UpdateCategoryUseCase';
import { DeleteCategoryUseCase } from '../../../application/use-cases/category/DeleteCategoryUseCase';
import { FindByIdCategoryUseCase } from "../../../application/use-cases/category/FindByIdCategoryUseCase";
import { FindAllCategoryUseCase } from '../../../application/use-cases/category/FindAllCategoryUseCase';
import { ApiResponse } from "../../../shared/types/apiResponse";
import { CategoryCreateDTO, CategoryID } from "../dto/Category.dto";
import { HTTP_STATUS } from "../../../shared/types/httpStatus";
import { HTTP_MESSAGES } from "../../../shared/types/httpMessages";

export class CategoryController {
    constructor(
        private createCategoryUseCase: CreateCategoryUseCase,
        private findCategoryByIdUseCase: FindByIdCategoryUseCase,
        private updateCategoryUseCase: UpdateCategoryUseCase,
        private deleteCategoryUseCase: DeleteCategoryUseCase,
        private findAllCategoryUseCase: FindAllCategoryUseCase
    ) {}
    
    async create(request: FastifyRequest, reply: FastifyReply): Promise<ApiResponse> {
        try {
            const categoryData = request.body as CategoryCreateDTO;
            const category = await this.createCategoryUseCase.execute(categoryData)
            return reply.code(HTTP_STATUS.API_STATUS_SUCCESS).send({status: true, descricao: HTTP_MESSAGES.API_STATUS_SUCCESS, dados: category})
        } catch (error) {
            console.log(error)
            return reply.code(HTTP_STATUS.API_STATUS_INTERNAL_ERROR).send({ status: false, descricao: HTTP_MESSAGES.API_STATUS_INTERNAL_ERROR});
        }
    };

    async findAll(request: FastifyRequest, reply: FastifyReply): Promise<ApiResponse> {
        try{
            const categories = await this.findAllCategoryUseCase.execute()
            return reply.code(HTTP_STATUS.API_STATUS_SUCCESS).send({status: true, descricao: HTTP_MESSAGES.API_STATUS_SUCCESS, dados: categories})
        } catch (error) {
            console.log(error)
            return reply.code(HTTP_STATUS.API_STATUS_INTERNAL_ERROR).send({ status: false, descricao: HTTP_MESSAGES.API_STATUS_INTERNAL_ERROR});
        }
    }

    async findById(request: FastifyRequest, reply: FastifyReply): Promise<ApiResponse> {
        try{
            const categoryID = request.body as CategoryID
            const category = await this.findCategoryByIdUseCase.execute(categoryID.id)
            return reply.code(HTTP_STATUS.API_STATUS_SUCCESS).send({status: true, descricao: HTTP_MESSAGES.API_STATUS_SUCCESS, dados: category})
        } catch (error) {
            console.log(error)
            return reply.code(HTTP_STATUS.API_STATUS_INTERNAL_ERROR).send({ status: false, descricao: HTTP_MESSAGES.API_STATUS_INTERNAL_ERROR});
        }
    };

    async update(request: FastifyRequest, reply: FastifyReply): Promise<ApiResponse> {
        try{
            const category = request.body as CategoryCreateDTO
            const data_category = await this.updateCategoryUseCase.execute(category)
            return reply.code(HTTP_STATUS.API_STATUS_SUCCESS).send({status: true, descricao: HTTP_MESSAGES.API_STATUS_SUCCESS, dados: data_category})
        } catch (error) {
            console.log(error)
            return reply.code(HTTP_STATUS.API_STATUS_INTERNAL_ERROR).send({ status: false, descricao: HTTP_MESSAGES.API_STATUS_INTERNAL_ERROR});
        }
    };

    async delete(request: FastifyRequest, reply: FastifyReply): Promise<ApiResponse> {
        try{
            const category = request.body as CategoryID
            const data_category = await this.deleteCategoryUseCase.execute(category.id)
            return reply.code(HTTP_STATUS.API_STATUS_SUCCESS).send({status: true, descricao: HTTP_MESSAGES.API_STATUS_SUCCESS, dados: data_category})
        } catch (error) {
            console.log(error)
            return reply.code(HTTP_STATUS.API_STATUS_INTERNAL_ERROR).send({ status: false, descricao: HTTP_MESSAGES.API_STATUS_INTERNAL_ERROR});
        }
    }
}
