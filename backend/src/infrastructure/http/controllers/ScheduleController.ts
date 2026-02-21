import { FastifyRequest, FastifyReply } from 'fastify';
import { CreateScheduleUseCase } from '../../../application/use-cases/schedule/CreateScheduleUseCase';
import { FindByIdScheduleUseCase } from '../../../application/use-cases/schedule/FindByIdScheduleUseCase';
import { FindAllScheduleUseCase } from '../../../application/use-cases/schedule/FindAllScheduleUseCase';
import { UpdateScheduleUseCase } from '../../../application/use-cases/schedule/UpdateScheduleUseCase';
import { DeleteScheduleUseCase } from '../../../application/use-cases/schedule/DeleteScheduleUseCase';
import { ApiResponse } from '../../../shared/types/apiResponse';
import { HTTP_STATUS } from '../../../shared/types/httpStatus';
import { HTTP_MESSAGES } from '../../../shared/types/httpMessages';
import {
  createScheduleSchema,
  updateScheduleSchema,
  scheduleIdSchema,
} from '../../../application/dto/schedule/ScheduleDTOs';

export class ScheduleController {
  constructor(
    private createScheduleUseCase: CreateScheduleUseCase,
    private findByIdScheduleUseCase: FindByIdScheduleUseCase,
    private findAllScheduleUseCase: FindAllScheduleUseCase,
    private updateScheduleUseCase: UpdateScheduleUseCase,
    private deleteScheduleUseCase: DeleteScheduleUseCase
  ) {}

  private getUserId(request: FastifyRequest): number {
    const user = request.user as { userId?: number; sub?: number } | undefined;
    const userId = user?.userId ?? user?.sub;
    if (userId == null) {
      throw new Error('User not authenticated');
    }
    return typeof userId === 'number' ? userId : parseInt(String(userId), 10);
  }

  async create(request: FastifyRequest, reply: FastifyReply): Promise<ApiResponse> {
    try {
      const userId = this.getUserId(request);
      const body = createScheduleSchema.parse(request.body);
      const schedule = await this.createScheduleUseCase.execute(body, userId);
      return reply.status(HTTP_STATUS.API_STATUS_CREATED).send({
        status: HTTP_MESSAGES.API_STATUS_SUCCESS,
        data: schedule,
      });
    } catch (error) {
      return reply.status(HTTP_STATUS.API_STATUS_BAD_REQUEST).send({
        status: HTTP_MESSAGES.API_STATUS_BAD_REQUEST,
        description:
          error instanceof Error ? error.message : 'An unknown error occurred',
      });
    }
  }

  async findById(request: FastifyRequest, reply: FastifyReply): Promise<ApiResponse> {
    try {
      const userId = this.getUserId(request);
      const { id } = scheduleIdSchema.parse(request.params);
      const schedule = await this.findByIdScheduleUseCase.execute(id, userId);
      if (!schedule) {
        return reply.status(HTTP_STATUS.API_STATUS_NOT_FOUND).send({
          status: HTTP_MESSAGES.API_STATUS_BAD_REQUEST,
          description: 'Schedule not found',
        });
      }
      return reply.status(HTTP_STATUS.API_STATUS_SUCCESS).send({
        status: HTTP_MESSAGES.API_STATUS_SUCCESS,
        data: schedule,
      });
    } catch (error) {
      return reply.status(HTTP_STATUS.API_STATUS_BAD_REQUEST).send({
        status: HTTP_MESSAGES.API_STATUS_BAD_REQUEST,
        description:
          error instanceof Error ? error.message : 'An unknown error occurred',
      });
    }
  }

  async findAll(request: FastifyRequest, reply: FastifyReply): Promise<ApiResponse> {
    try {
      const userId = this.getUserId(request);
      const schedules = await this.findAllScheduleUseCase.execute(userId);
      return reply.status(HTTP_STATUS.API_STATUS_SUCCESS).send({
        status: HTTP_MESSAGES.API_STATUS_SUCCESS,
        data: schedules,
      });
    } catch (error) {
      return reply.status(HTTP_STATUS.API_STATUS_BAD_REQUEST).send({
        status: HTTP_MESSAGES.API_STATUS_BAD_REQUEST,
        description:
          error instanceof Error ? error.message : 'An unknown error occurred',
      });
    }
  }

  async update(request: FastifyRequest, reply: FastifyReply): Promise<ApiResponse> {
    try {
      const userId = this.getUserId(request);
      const { id } = scheduleIdSchema.parse(request.params);
      const body = updateScheduleSchema.parse(request.body);
      const schedule = await this.updateScheduleUseCase.execute(id, userId, body);
      return reply.status(HTTP_STATUS.API_STATUS_SUCCESS).send({
        status: HTTP_MESSAGES.API_STATUS_SUCCESS,
        data: schedule,
      });
    } catch (error) {
      return reply.status(HTTP_STATUS.API_STATUS_BAD_REQUEST).send({
        status: HTTP_MESSAGES.API_STATUS_BAD_REQUEST,
        description:
          error instanceof Error ? error.message : 'An unknown error occurred',
      });
    }
  }

  async delete(request: FastifyRequest, reply: FastifyReply): Promise<ApiResponse> {
    try {
      const userId = this.getUserId(request);
      const { id } = scheduleIdSchema.parse(request.params);
      await this.deleteScheduleUseCase.execute(id, userId);
      return reply.status(HTTP_STATUS.API_STATUS_NO_CONTENT).send();
    } catch (error) {
      return reply.status(HTTP_STATUS.API_STATUS_BAD_REQUEST).send({
        status: HTTP_MESSAGES.API_STATUS_BAD_REQUEST,
        description:
          error instanceof Error ? error.message : 'An unknown error occurred',
      });
    }
  }
}
