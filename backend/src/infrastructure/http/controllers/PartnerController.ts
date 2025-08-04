import { FastifyRequest, FastifyReply } from 'fastify';
import { CreatePartnerUseCase } from '../../../application/use-cases/partner/CreatePartnerUseCase';
import { FindAllPartnerUseCase } from '../../../application/use-cases/partner/FindAllPartnerUseCase';
import { FindByIdPartnerUseCase } from '../../../application/use-cases/partner/FindByIdPartnerUseCase';
import { UpdatePartnerUseCase } from '../../../application/use-cases/partner/UpdatePartnerUseCase';
import { DeletePartnerUseCase } from '../../../application/use-cases/partner/DeletePartnerUseCase';
import { CreatePartnerDTO, UpdatePartnerDTO, PartnerIdDTO, createPartnerSchema, updatePartnerSchema, partnerIdSchema } from '../../../application/dto/partner/PartnerDTOs';

import {ApiResponse} from "../../../shared/types/apiResponse";

import {HTTP_STATUS} from "../../../shared/types/httpStatus";
import {HTTP_MESSAGES} from "../../../shared/types/httpMessages";

export class PartnerController {
  constructor(
    private readonly createPartnerUseCase: CreatePartnerUseCase,
    private readonly findAllPartnerUseCase: FindAllPartnerUseCase,
    private readonly findByIdPartnerUseCase: FindByIdPartnerUseCase,
    private readonly updatePartnerUseCase: UpdatePartnerUseCase,
    private readonly deletePartnerUseCase: DeletePartnerUseCase,
  ) {}

  async create(request: FastifyRequest<{ Body: CreatePartnerDTO }>, reply: FastifyReply): Promise<void> {
    const validatedData = createPartnerSchema.parse(request.body);
    const partner = await this.createPartnerUseCase.execute(validatedData);
    reply.code(201).send(partner);
  }

  async findAll(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const partners = await this.findAllPartnerUseCase.execute();
    reply.send(partners);
  }

  async findById(request: FastifyRequest<{ Params: PartnerIdDTO }>, reply: FastifyReply): Promise<void> {
    const validatedParams = partnerIdSchema.parse(request.params);
    const partner = await this.findByIdPartnerUseCase.execute(validatedParams.id);
    if (!partner) {
      reply.code(404).send({ message: 'Partner not found' });
      return;
    }
    reply.send(partner);
  }

  async update(request: FastifyRequest<{ Params: PartnerIdDTO; Body: UpdatePartnerDTO }>, reply: FastifyReply): Promise<ApiResponse> {
    const validatedParams = partnerIdSchema.parse(request.params);
    const validatedData = updatePartnerSchema.parse(request.body);

    const updatedPartner = await this.updatePartnerUseCase.execute(validatedParams.id, validatedData);
    if (!updatedPartner) {
      return reply.code(HTTP_STATUS.API_STATUS_NOT_FOUND).send({status: false, descricao: HTTP_MESSAGES.API_STATUS_NOT_FOUND, data: {}})
    }
    return reply.code(HTTP_STATUS.API_STATUS_SUCCESS).send({ status: true,  descricao: HTTP_MESSAGES.API_STATUS_SUCCESS, dados: updatedPartner});
  }

  async delete(request: FastifyRequest<{ Params: PartnerIdDTO }>, reply: FastifyReply): Promise<void> {
    const validatedParams = partnerIdSchema.parse(request.params);
    await this.deletePartnerUseCase.execute(validatedParams.id);
    reply.code(HTTP_STATUS.API_STATUS_NO_CONTENT).send({status: true, descricao: HTTP_MESSAGES.API_STATUS_SUCCESS, data: {}});
  }
}