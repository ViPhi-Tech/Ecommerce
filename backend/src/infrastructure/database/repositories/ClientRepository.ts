import { PrismaClient } from '@prisma/client';
import { IClientRepository } from '../../../domain/repositories/IClientRepository';
import { Client } from '../../../domain/entities/Client';
import { ClientCreateDTO, ClientUpdateDTO } from '../../http/dto/Client.dto';

export class ClientRepository implements IClientRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: ClientCreateDTO): Promise<Client> {
    return this.prisma.client.create({ data });
  }

  async findAll(): Promise<Client[]> {
    return this.prisma.client.findMany(
      {
        where: { isActive: true }
      }
    ) as any;
  }

  async findById(id: number): Promise<Client | null> {
    return this.prisma.client.findUnique({ where: { id, isActive: true } }) as any;
  }

  async update(id: number, data: ClientUpdateDTO): Promise<Client> {
    return this.prisma.client.update({ where: { id }, data }) as any;
  }

  async delete(id: number): Promise<void> {
    const deleted = await this.prisma.client.update(
      {
        where: { id },
        data : {
          isActive: false
        }
      }
    );
    console.log(deleted)
  }
} 