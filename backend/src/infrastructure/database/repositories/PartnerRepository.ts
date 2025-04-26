import { PrismaClient } from '../prismaClient';
import { IPartnerRepository } from '../../../domain/repositories/IPartnerRepository';
import { Partner } from '../../../domain/entities/Partner';

export class PartnerRepository implements IPartnerRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(partner: Partner): Promise<Partner> {
    return await this.prisma.partner.create({ data: partner });
  }

  async findAll(): Promise<Partner[]> {
    return await this.prisma.partner.findMany();
  }

  async findById(id: string): Promise<Partner | null> {
    return await this.prisma.partner.findUnique({ where: { id } });
  }

  async update(id: string, partner: Partner): Promise<Partner | null> {
    return await this.prisma.partner.update({
      where: { id },
      data: partner,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.partner.delete({ where: { id } });
  }
}