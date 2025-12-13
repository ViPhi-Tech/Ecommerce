import { PrismaClient } from '@prisma/client';
import { IClientRepository } from '../../../domain/repositories/IClientRepository';
import { Client } from '../../../domain/entities/Client';
import { CreateClientDTO, UpdateClientDTO } from '../../../application/dto/client/ClientDTOs';

export class ClientRepository implements IClientRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: CreateClientDTO & { street?: string; number?: string; neighborhood?: string; zipCode?: string; city?: string; state?: string }): Promise<Client> {
    const { street, number, neighborhood, zipCode, city, state, ...clientData } = data;
    
    // Verificar se há dados de endereço para criar
    const hasAddress = street && number && zipCode && city && state;
    
    return this.prisma.client.create({
      data: {
        ...clientData,
        // Criar endereço junto com o cliente se houver dados
        address: hasAddress ? {
          create: {
            street,
            number,
            city,
            state,
            zipCode,
            complement: neighborhood || null, // Mapear neighborhood para complement
          }
        } : undefined,
      },
      include: {
        address: true
      }
    }) as any;
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

  async update(id: number, data: UpdateClientDTO): Promise<Client> {
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
  };

  async findByDocument(document: string): Promise<Client  | null> {
    return await this.prisma.client.findUnique(
      {
        where: {
          document: document, isActive: true
        }
      }
    )
  };

  async countByMonth(initialMonth: number, finalMonth: number): Promise<number> {
    return await this.prisma.client.count(
      {
        where: {
          createdAt: {
            gte: new Date(new Date().getFullYear(), initialMonth - 1, 1),
            lt: new Date(new Date().getFullYear(), finalMonth, 1),
          },
          isActive: true
        }
      }
    )
  }

}