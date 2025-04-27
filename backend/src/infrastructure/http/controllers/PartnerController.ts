import { FastifyRequest, FastifyReply } from 'fastify';
import { CreatePartnerUseCase } from '../../../application/use-cases/partner/CreatePartnerUseCase';
import { FindAllPartnerUseCase } from '../../../application/use-cases/partner/FindAllPartnerUseCase';
import { FindByIdPartnerUseCase } from '../../../application/use-cases/partner/FindByIdPartnerUseCase';
import { UpdatePartnerUseCase } from '../../../application/use-cases/partner/UpdatePartnerUseCase';
import { DeletePartnerUseCase } from '../../../application/use-cases/partner/DeletePartnerUseCase';
import { PartnerCreateDTO, PartnerUpdateDTO, PartnerIdDTO } from '../dto/Partner.dto';

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

  async create(request: FastifyRequest<{ Body: PartnerCreateDTO }>, reply: FastifyReply): Promise<void> {
    const partnerData = request.body as PartnerCreateDTO;
    const partner = await this.createPartnerUseCase.execute(partnerData)
    partner.name = partnerData.name;
    partner.email = partnerData.email;
    partner.document = partnerData.document;
    partner.phone = partnerData.phone;

    const newPartner = await this.createPartnerUseCase.execute(partner);
    reply.code(201).send(newPartner);
  }

  async findAll(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const partners = await this.findAllPartnerUseCase.execute();
    reply.send(partners);
  }

  async findById(request: FastifyRequest<{ Params: PartnerIdDTO }>, reply: FastifyReply): Promise<void> {
    const { id } = request.params;
    const partner = await this.findByIdPartnerUseCase.execute(id);
    if (!partner) {
      reply.code(404).send({ message: 'Partner not found' });
      return;
    }
    reply.send(partner);
  }

  async update(request: FastifyRequest<{ Params: PartnerIdDTO; Body: PartnerUpdateDTO }>, reply: FastifyReply): Promise<ApiResponse> {
    const { id } = request.params;
    const partnerData = request.body;

    const updatedPartner = await this.updatePartnerUseCase.execute(id, partnerData);
    if (!updatedPartner) {
      return reply.code(HTTP_STATUS.API_STATUS_NOT_FOUND).send({status: false, descricao: HTTP_MESSAGES.API_STATUS_NOT_FOUND, data: {}})
    }
    return reply.code(HTTP_STATUS.API_STATUS_INTERNAL_ERROR).send({ status: false,  descricao: HTTP_MESSAGES.API_STATUS_INTERNAL_ERROR});
  }

  async delete(request: FastifyRequest<{ Params: PartnerIdDTO }>, reply: FastifyReply): Promise<void> {
    const { id } = request.params;
    await this.deletePartnerUseCase.execute(id);
    return reply.code(HTTP_STATUS.API_STATUS_NOT_FOUND).send({status: false, descricao: HTTP_MESSAGES.API_STATUS_NOT_FOUND, data: {}})

  }
}