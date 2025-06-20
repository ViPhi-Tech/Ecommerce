import { FastifyRequest, FastifyReply } from 'fastify';
import { ClientCreateDTO, ClientUpdateDTO, ClientID } from '../dto/Client.dto';
import { CreateClientUseCase } from '../../../application/use-cases/client/CreateClientUseCase';
import { FindAllClientUseCase } from '../../../application/use-cases/client/FindAllClientUseCase';
import { FindByIdClientUseCase } from '../../../application/use-cases/client/FindByIdClientUseCase';
import { UpdateClientUseCase } from '../../../application/use-cases/client/UpdateClientUseCase';
import { DeleteClientUseCase } from '../../../application/use-cases/client/DeleteClientUseCase';
import { ApiResponse } from '../../../shared/types/apiResponse';
import { HTTP_MESSAGES } from '../../../shared/types/httpMessages';
import { HTTP_STATUS } from '../../../shared/types/httpStatus';

export class ClientController {
  constructor(
    private createClientUseCase: CreateClientUseCase,
    private findAllClientUseCase: FindAllClientUseCase,
    private findByIdClientUseCase: FindByIdClientUseCase,
    private updateClientUseCase: UpdateClientUseCase,
    private deleteClientUseCase: DeleteClientUseCase,
  ) {}

  async create(request: FastifyRequest<{ Body: ClientCreateDTO }>, reply: FastifyReply): Promise<ApiResponse> {
    try {
      const client = await this.createClientUseCase.execute(request.body);
      return reply.code(HTTP_STATUS.API_STATUS_SUCCESS).send({status: true, descricao: HTTP_MESSAGES.API_STATUS_SUCCESS, dados: client})

    } catch (error: any) {
      return reply.code(HTTP_STATUS.API_STATUS_INTERNAL_ERROR).send({ 
        status: false,  
        descricao: error.message || HTTP_MESSAGES.API_STATUS_INTERNAL_ERROR
    });
  }
  }

  async findAll(request: FastifyRequest, reply: FastifyReply): Promise<ApiResponse> {
    try {
      const clients = await this.findAllClientUseCase.execute();
      return reply.send({
        status: true,
        descricao: HTTP_MESSAGES.API_STATUS_CREATED,
        dados: clients
      });
    } catch (error: any) {
      return reply.code(HTTP_STATUS.API_STATUS_INTERNAL_ERROR).send({
        status: false,
        descricao: error.message || HTTP_MESSAGES.API_STATUS_INTERNAL_ERROR
      });
    }
  }

  async findById(request: FastifyRequest<{ Params: ClientID }>, reply: FastifyReply):Promise<ApiResponse> {
    try {
      const client = await this.findByIdClientUseCase.execute(request.params.id);
      if (!client) return reply.code(HTTP_STATUS.API_STATUS_NOT_FOUND).send({ status: false, descricao: 'Cliente não encontrado' });
      return reply.code(HTTP_STATUS.API_STATUS_SUCCESS).send({status: true, descricao: HTTP_MESSAGES.API_STATUS_SUCCESS, data: client});
    } catch (error: any) {
      return reply.code(HTTP_STATUS.API_STATUS_INTERNAL_ERROR).send({status:false, descricao: error.message || HTTP_MESSAGES.API_STATUS_INTERNAL_ERROR })
    }

  }

  async update(request: FastifyRequest<{ Params: ClientID; Body: ClientUpdateDTO }>, reply: FastifyReply): Promise<ApiResponse> {
    try {
      const client = await this.updateClientUseCase.execute(request.params.id, request.body);
      return reply.code(HTTP_STATUS.API_STATUS_SUCCESS).send({status: true, descricao: HTTP_MESSAGES.API_STATUS_SUCCESS, dados: client});
    } catch (error: any) {
      return reply.code(HTTP_STATUS.API_STATUS_INTERNAL_ERROR).send({status:false, descricao: error.message || HTTP_MESSAGES.API_STATUS_INTERNAL_ERROR })

    }

  }

  async delete(request: FastifyRequest<{ Params: ClientID }>, reply: FastifyReply): Promise<ApiResponse> {
    try {
      await this.deleteClientUseCase.execute(request.params.id);
      return reply.code(HTTP_STATUS.API_STATUS_NO_CONTENT).send({status: true, descricao: HTTP_MESSAGES.API_STATUS_SUCCESS, dados: {}});
    } catch (error: any) {
      return reply.code(HTTP_STATUS.API_STATUS_INTERNAL_ERROR).send({status:false, descricao: error.message || HTTP_MESSAGES.API_STATUS_INTERNAL_ERROR })
    }

  }
} 