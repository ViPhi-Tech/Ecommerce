import { FastifyRequest, FastifyReply } from 'fastify';
import { CreatePartnerUseCase } from '../../../application/use-cases/partner/CreatePartnerUseCase';
import { FindAllPartnerUseCase } from '../../../application/use-cases/partner/FindAllPartnerUseCase';
import { FindByIdPartnerUseCase } from '../../../application/use-cases/partner/FindByIdPartnerUseCase';
import { UpdatePartnerUseCase } from '../../../application/use-cases/partner/UpdatePartnerUseCase';
import { DeletePartnerUseCase } from '../../../application/use-cases/partner/DeletePartnerUseCase';
import { Partner } from '../../../domain/entities/Partner';
import { PartnerCreateDTO, PartnerUpdateDTO, PartnerIdDTO } from '../dto/Partner.dto';

export class PartnerController {
  constructor(
    private readonly createPartnerUseCase: CreatePartnerUseCase,
    private readonly findAllPartnerUseCase: FindAllPartnerUseCase,
    private readonly findByIdPartnerUseCase: FindByIdPartnerUseCase,
    private readonly updatePartnerUseCase: UpdatePartnerUseCase,
    private readonly deletePartnerUseCase: DeletePartnerUseCase,
  ) {}

  async create(request: FastifyRequest<{ Body: PartnerCreateDTO }>, reply: FastifyReply): Promise<void> {
    const partnerData = request.body;
    const partner = new Partner();
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
    const partner = await this.findByIdPartnerUseCase.execute(String(id));
    if (!partner) {
      reply.code(404).send({ message: 'Partner not found' });
      return;
    }
    reply.send(partner);
  }

  async update(request: FastifyRequest<{ Params: PartnerIdDTO; Body: PartnerUpdateDTO }>, reply: FastifyReply): Promise<void> {
    const { id } = request.params;
    const partnerData = request.body;

    const partner = new Partner();
    partner.name = partnerData.name;
    partner.email = partnerData.email;
    partner.document = partnerData.document;
    partner.phone = partnerData.phone;

    const updatedPartner = await this.updatePartnerUseCase.execute(String(id), partner);
    if (!updatedPartner) {
      reply.code(404).send({ message: 'Partner not found' });
      return;
    }
    reply.send(updatedPartner);
  }

  async delete(request: FastifyRequest<{ Params: PartnerIdDTO }>, reply: FastifyReply): Promise<void> {
    const { id } = request.params;
    await this.deletePartnerUseCase.execute(String(id));
    reply.code(204).send();
  }
}