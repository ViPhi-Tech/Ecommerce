import { FastifyRequest, FastifyReply } from 'fastify';
import { CreateDeliveryUseCase } from '../../../application/use-cases/delivery/CreateDeliveryUseCase';
import { FindByUuidDeliveryUseCase } from '../../../application/use-cases/delivery/FindByUuidDeliveryUseCase';
import { FindAllDeliveryUseCase } from '../../../application/use-cases/delivery/FindAllDeliveryUseCase';
import { UpdateDeliveryUseCase } from '../../../application/use-cases/delivery/UpdateDeliveryUseCase';
import { DeleteDeliveryUseCase } from '../../../application/use-cases/delivery/DeleteDeliveryUseCase';
import { CompleteDeliveryUseCase } from '../../../application/use-cases/delivery/CompleteDeliveryUseCase';
import { CancelDeliveryUseCase } from '../../../application/use-cases/delivery/CancelDeliveryUseCase';
import { GetDeliveryDashboardUseCase } from '../../../application/use-cases/delivery/GetDeliveryDashboardUseCase';
import { ApiResponse } from "../../../shared/types/apiResponse";
import { HTTP_STATUS } from "../../../shared/types/httpStatus";
import { HTTP_MESSAGES } from "../../../shared/types/httpMessages";
import {
  CreateDeliveryDTO,
  DeliveryUuidDTO,
  UpdateDeliveryDTO,
  createDeliverySchema,
  deliveryUuidSchema,
  updateDeliverySchema,
} from "../../../application/dto/delivery/DeliveryDTOs";
import {
  getDeliveryDashboardSchema,
} from "../../../application/dto/delivery/DeliveryDashboardDTOs";

export class DeliveryController {
  constructor(
    private createDeliveryUseCase: CreateDeliveryUseCase,
    private findByUuidDeliveryUseCase: FindByUuidDeliveryUseCase,
    private findAllDeliveryUseCase: FindAllDeliveryUseCase,
    private updateDeliveryUseCase: UpdateDeliveryUseCase,
    private deleteDeliveryUseCase: DeleteDeliveryUseCase,
    private completeDeliveryUseCase: CompleteDeliveryUseCase,
    private cancelDeliveryUseCase: CancelDeliveryUseCase,
    private getDeliveryDashboardUseCase: GetDeliveryDashboardUseCase
  ) {}

  async create(request: FastifyRequest, reply: FastifyReply): Promise<ApiResponse> {
    try {
      const deliveryData = createDeliverySchema.parse(request.body);

      return reply.status(HTTP_STATUS.API_STATUS_CREATED).send({
        status: HTTP_MESSAGES.API_STATUS_SUCCESS,
        data: await this.createDeliveryUseCase.execute(deliveryData),
      });
    } catch (error) {
      return reply.status(HTTP_STATUS.API_STATUS_BAD_REQUEST).send({
        status: HTTP_MESSAGES.API_STATUS_BAD_REQUEST,
        description: error instanceof Error ? error.message : 'Erro desconhecido ao criar entrega',
      });
    }
  }

  async findByUuid(request: FastifyRequest, reply: FastifyReply): Promise<ApiResponse> {
    try {
      const deliveryParams = deliveryUuidSchema.parse(request.params);
      return reply.status(HTTP_STATUS.API_STATUS_SUCCESS).send({
        status: HTTP_MESSAGES.API_STATUS_SUCCESS,
        data: await this.findByUuidDeliveryUseCase.execute(deliveryParams.uuid),
      });
    } catch (error) {
      return reply.status(HTTP_STATUS.API_STATUS_BAD_REQUEST).send({
        status: HTTP_MESSAGES.API_STATUS_BAD_REQUEST,
        description: error instanceof Error ? error.message : 'Erro desconhecido ao buscar entrega',
      });
    }
  }

  async findAll(request: FastifyRequest, reply: FastifyReply): Promise<ApiResponse> {
    try {
      return reply.status(HTTP_STATUS.API_STATUS_SUCCESS).send({
        status: HTTP_MESSAGES.API_STATUS_SUCCESS,
        data: await this.findAllDeliveryUseCase.execute(),
      });
    } catch (error) {
      return reply.status(HTTP_STATUS.API_STATUS_BAD_REQUEST).send({
        status: HTTP_MESSAGES.API_STATUS_BAD_REQUEST,
        description: error instanceof Error ? error.message : 'Erro desconhecido ao listar entregas',
      });
    }
  }

  async update(request: FastifyRequest, reply: FastifyReply): Promise<ApiResponse> {
    try {
      const deliveryData = updateDeliverySchema.parse(request.body);
      const deliveryParams = deliveryUuidSchema.parse(request.params);

      return reply.status(HTTP_STATUS.API_STATUS_SUCCESS).send({
        status: true,
        descricao: HTTP_MESSAGES.API_STATUS_SUCCESS,
        data: await this.updateDeliveryUseCase.execute(deliveryParams.uuid, deliveryData),
      });
    } catch (error) {
      return reply.status(HTTP_STATUS.API_STATUS_BAD_REQUEST).send({
        status: false,
        descricao: error instanceof Error ? error.message : HTTP_MESSAGES.API_STATUS_BAD_REQUEST,
      });
    }
  }

  async delete(request: FastifyRequest, reply: FastifyReply): Promise<ApiResponse> {
    try {
      const deliveryParams = deliveryUuidSchema.parse(request.params);
      await this.deleteDeliveryUseCase.execute(deliveryParams.uuid);
      return reply.status(HTTP_STATUS.API_STATUS_NO_CONTENT).send();
    } catch (error) {
      return reply.status(HTTP_STATUS.API_STATUS_BAD_REQUEST).send({
        status: HTTP_MESSAGES.API_STATUS_BAD_REQUEST,
        description: error instanceof Error ? error.message : 'Erro desconhecido ao deletar entrega',
      });
    }
  }

  async complete(request: FastifyRequest, reply: FastifyReply): Promise<ApiResponse> {
    try {
      const deliveryParams = deliveryUuidSchema.parse(request.params);
      return reply.status(HTTP_STATUS.API_STATUS_SUCCESS).send({
        status: HTTP_MESSAGES.API_STATUS_SUCCESS,
        data: await this.completeDeliveryUseCase.execute(deliveryParams.uuid),
      });
    } catch (error) {
      return reply.status(HTTP_STATUS.API_STATUS_BAD_REQUEST).send({
        status: HTTP_MESSAGES.API_STATUS_BAD_REQUEST,
        description: error instanceof Error ? error.message : 'Erro desconhecido ao finalizar entrega',
      });
    }
  }

  async cancel(request: FastifyRequest, reply: FastifyReply): Promise<ApiResponse> {
    try {
      const deliveryParams = deliveryUuidSchema.parse(request.params);
      return reply.status(HTTP_STATUS.API_STATUS_SUCCESS).send({
        status: HTTP_MESSAGES.API_STATUS_SUCCESS,
        data: await this.cancelDeliveryUseCase.execute(deliveryParams.uuid),
      });
    } catch (error) {
      return reply.status(HTTP_STATUS.API_STATUS_BAD_REQUEST).send({
        status: HTTP_MESSAGES.API_STATUS_BAD_REQUEST,
        description: error instanceof Error ? error.message : 'Erro desconhecido ao cancelar entrega',
      });
    }
  }

  async getDashboard(request: FastifyRequest, reply: FastifyReply): Promise<ApiResponse> {
    try {
      const query = request.query as { startDate?: string; endDate?: string };
      const params = getDeliveryDashboardSchema.parse(query);
      
      return reply.status(HTTP_STATUS.API_STATUS_SUCCESS).send({
        status: HTTP_MESSAGES.API_STATUS_SUCCESS,
        data: await this.getDeliveryDashboardUseCase.execute(
          params.startDate,
          params.endDate
        ),
      });
    } catch (error) {
      return reply.status(HTTP_STATUS.API_STATUS_BAD_REQUEST).send({
        status: HTTP_MESSAGES.API_STATUS_BAD_REQUEST,
        description: error instanceof Error ? error.message : 'Erro desconhecido ao buscar métricas de entregas',
      });
    }
  }
}

