import { PrismaClient } from '../prismaClient';
import { Supplier } from '../../../domain/entities/Supplier';
import { ISupplierRepository } from "../../../domain/repositories/ISupplierRepository";
import { stripNonDigits, stripNonDigitsOrNull } from '../../../shared/utils/stringUtils';

export class SupplierRepository implements ISupplierRepository {
    constructor(private prisma: PrismaClient) {
    }

    async create(data: Supplier): Promise<Supplier> {
        return await this.prisma.supplier.create({
            data: {
                tradeName: data.tradeName,
                legalName: data.legalName,
                cnpj: stripNonDigits(data.cnpj),
                address: data.address,
                email: data.email,
                phone: stripNonDigitsOrNull(data.phone) ?? null,
            } 
        });
    }

    async findAll(): Promise<Supplier[]> {
      return this.prisma.supplier.findMany();
    }

    async findById(uuid: string): Promise<Supplier | null> {
        return this.prisma.supplier.findUnique({
            where: {uuid: uuid}
        });
    }

    async findByCnpj(cnpj: string): Promise<Supplier | null> {
        return this.prisma.supplier.findUnique({
            where: { cnpj: stripNonDigits(cnpj) }
        });
    }

    async update(uuid: string, data: Partial<Supplier>): Promise<Supplier> {
        const sanitizedData: Partial<Supplier> = { ...data };

        if (typeof sanitizedData.cnpj === 'string') {
            sanitizedData.cnpj = stripNonDigits(sanitizedData.cnpj);
        }

        if ('phone' in sanitizedData) {
            sanitizedData.phone = stripNonDigitsOrNull(sanitizedData.phone) ?? null;
        }

        return this.prisma.supplier.update({
            where: {uuid: uuid},
            data: sanitizedData
        });
    }

    async delete(uuid: string): Promise<void> {
        await this.prisma.supplier.delete({
            where: {uuid:uuid}
        });
    };
}