import { PrismaClient } from '../prismaClient';
import { Brand } from '../../../domain/entities/Brand';
import { IBrandRepository } from "../../../domain/repositories/IBrandRepository";

export class BrandRepository implements IBrandRepository {
    constructor(private prisma: PrismaClient) {
    }

    async create(data: Brand): Promise<Brand> {
        return await this.prisma.brand.create({
            data: {
                name: data.name,

            } 
        });
    }

    async findAll(): Promise<Brand[]> {
      return this.prisma.brand.findMany();
    }

    async findById(id: number): Promise<Brand | null> {
        return this.prisma.brand.findUnique({
            where: {id}
        });
    }

    async update(id: number, data: Partial<Brand>): Promise<Brand> {
        return this.prisma.brand.update({
            where: {id},
            data
        });
    }

    async delete(id: number): Promise<void> {
        await this.prisma.brand.delete({
            where: {id}
        });
    };
}