import { PrismaClient } from '@prisma/client';
import { Supplier } from '../../../domain/entities/Supplier';
import { ISupplierRepository } from "../../../domain/repositories/ISupplierRepository";

export class SupplierRepository implements ISupplierRepository {
    constructor(private prisma: PrismaClient) {
    }

    async create(data: Supplier): Promise<Supplier> {
        return await this.prisma.supplier.create({
            data: {
                tradeName: data.tradeName,
                legalName: data.legalName,
                cnpj: data.cnpj,
                address: data.address,
                email: data.email,
                phone: data.phone,
            } 
        });
    }

    async findAll(): Promise<Supplier[]> {
      return this.prisma.supplier.findMany();
    }

    async findById(id: string): Promise<Supplier | null> {
        return this.prisma.supplier.findUnique({
            where: {id}
        });
    }

    async findByCnpj(cnpj: string): Promise<Supplier | null> {
        return this.prisma.supplier.findUnique({
            where: {cnpj}
        });
    }

    async update(id: string, data: Partial<Supplier>): Promise<Supplier> {
        return this.prisma.supplier.update({
            where: {id},
            data
        });
    }

    async delete(id: string): Promise<void> {
        await this.prisma.supplier.delete({
            where: {id}
        });
    };
}