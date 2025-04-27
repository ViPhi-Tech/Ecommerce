import { PrismaClient} from "@prisma/client";
import { IPartnerRepository } from '../../../domain/repositories/IPartnerRepository';
import { Partner } from '../../../domain/entities/Partner';

export class PartnerRepository implements IPartnerRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(partner: Partner): Promise<Partner> {
    return this.prisma.partner.create({ data: partner });
  }

  async findAll(): Promise<Partner[]> {
    return this.prisma.partner.findMany();
  }

  async findById(id: number): Promise<Partner | null> {
    return this.prisma.partner.findUnique({ where: { id } });
  }

  async update(id: number, partner: Partner): Promise<Partner | null> {
    return this.prisma.partner.update({
      where: { id },
      data: partner,
    });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.partner.delete({ where: { id } });
  }
}