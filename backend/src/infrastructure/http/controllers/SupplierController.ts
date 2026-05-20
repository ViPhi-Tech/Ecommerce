import { FastifyRequest, FastifyReply } from 'fastify';
import { CreateSupplierUseCase } from '../../../application/use-cases/supplier/CreateSupplierUseCase';
import { UpdateSupplierUseCase } from '../../../application/use-cases/supplier/UpdateSupplierUseCase';
import { DeleteSupplierUseCase } from '../../../application/use-cases/supplier/DeleteSupplierUseCase';
import { FindByIdSupplierUseCase } from "../../../application/use-cases/supplier/FindByIdSupplierUseCase";
import { FindAllSupplierUseCase } from '../../../application/use-cases/supplier/FindAllSupplierUseCase';
import { ApiResponse } from "../../../shared/types/apiResponse";
import { SupplierCreateDTO, SupplierUpdateDTO } from "../../../application/dto/supplier/Supplier.dto";
import {
    createSupplierSchema,
    updateSupplierSchema,
    supplierIdSchema,
} from "../../../application/dto/supplier/SupplierDTOs";
import { HTTP_STATUS } from "../../../shared/types/httpStatus";
import { HTTP_MESSAGES } from "../../../shared/types/httpMessages";

export class SupplierController {
    constructor(
        private createSupplierUseCase: CreateSupplierUseCase,
        private findSupplierByIdUseCase: FindByIdSupplierUseCase,
        private updateSupplierUseCase: UpdateSupplierUseCase,
        private deleteSupplierUseCase: DeleteSupplierUseCase,
        private findAllSupplierUseCase: FindAllSupplierUseCase
    ) {}
    
    async create(request: FastifyRequest, reply: FastifyReply): Promise<ApiResponse> {
        try {
            const supplierData = createSupplierSchema.parse(request.body) as SupplierCreateDTO;
            const supplier = await this.createSupplierUseCase.execute(supplierData)
            return reply.code(HTTP_STATUS.API_STATUS_SUCCESS).send({status: true, descricao: HTTP_MESSAGES.API_STATUS_SUCCESS, dados: supplier})
        } catch (error) {
            console.log(error)
            return reply.code(HTTP_STATUS.API_STATUS_INTERNAL_ERROR).send({ status: false, descricao: error instanceof Error ? error.message : HTTP_MESSAGES.API_STATUS_INTERNAL_ERROR});
        }
    };

    async findAll(request: FastifyRequest, reply: FastifyReply): Promise<ApiResponse> {
        try{
            const suppliers = await this.findAllSupplierUseCase.execute()
            return reply.code(HTTP_STATUS.API_STATUS_SUCCESS).send({status: true, descricao: HTTP_MESSAGES.API_STATUS_SUCCESS, dados: suppliers})
        } catch (error) {
            console.log(error)
            return reply.code(HTTP_STATUS.API_STATUS_INTERNAL_ERROR).send({ status: false, descricao: HTTP_MESSAGES.API_STATUS_INTERNAL_ERROR});
        }
    }

    async findById(request: FastifyRequest, reply: FastifyReply): Promise<ApiResponse> {
        try{
            const { id } = supplierIdSchema.parse(request.params);
            const supplier = await this.findSupplierByIdUseCase.execute(id)
            return reply.code(HTTP_STATUS.API_STATUS_SUCCESS).send({status: true, descricao: HTTP_MESSAGES.API_STATUS_SUCCESS, dados: supplier})
        } catch (error) {
            console.log(error)
            return reply.code(HTTP_STATUS.API_STATUS_INTERNAL_ERROR).send({ status: false, descricao: HTTP_MESSAGES.API_STATUS_INTERNAL_ERROR});
        }
    };

    async update(request: FastifyRequest, reply: FastifyReply): Promise<ApiResponse> {
        try{
            const { id } = supplierIdSchema.parse(request.params);
            const supplier = updateSupplierSchema.parse(request.body) as SupplierUpdateDTO;
            const data_supplier = await this.updateSupplierUseCase.execute(id, supplier)
            return reply.code(HTTP_STATUS.API_STATUS_SUCCESS).send({status: true, descricao: HTTP_MESSAGES.API_STATUS_SUCCESS, dados: data_supplier})
        } catch (error) {
            console.log(error)
            return reply.code(HTTP_STATUS.API_STATUS_INTERNAL_ERROR).send({ status: false, descricao: error instanceof Error ? error.message : HTTP_MESSAGES.API_STATUS_INTERNAL_ERROR});
        }
    };

    async delete(request: FastifyRequest, reply: FastifyReply): Promise<ApiResponse> {
        try{
            const { id } = supplierIdSchema.parse(request.params);
            await this.deleteSupplierUseCase.execute(id)
            return reply.code(HTTP_STATUS.API_STATUS_SUCCESS).send({status: true, descricao: HTTP_MESSAGES.API_STATUS_SUCCESS, dados: null})
        } catch (error) {
            console.log(error)
            return reply.code(HTTP_STATUS.API_STATUS_INTERNAL_ERROR).send({ status: false, descricao: error instanceof Error ? error.message : HTTP_MESSAGES.API_STATUS_INTERNAL_ERROR});
        }
    }
}