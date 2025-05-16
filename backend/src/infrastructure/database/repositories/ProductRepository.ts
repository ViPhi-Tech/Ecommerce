import { PrismaClient } from '@prisma/client';
import { Product, Stock } from '../../../domain/entities/Product';
import { IProductRepository } from "../../../domain/repositories/IProductRepository";
import {ProductCreateDTO, ProductDTO} from "../../http/dto/Product.dto";

export class ProductRepository implements IProductRepository {
    constructor(private prisma: PrismaClient) {
    }

    async create(data: Product): Promise<Product> {
        return this.prisma.product.create({
            data
        });
    }

    async findAll(): Promise<Product[]> {
        return this.prisma.product.findMany();
    }

    async findById(id: number): Promise<Product | null> {
        return this.prisma.product.findUnique({
            where: {id}
        });
    }

    async update(id: number, data: Partial<ProductDTO>): Promise<Product> {
        return this.prisma.product.update({
            where: {id},
            data
        });
    }

    async delete(id: number): Promise<void> {
    };

    async updateStock(sku: number, quantity: number, companyId: number): Promise<Stock> {
        return this.prisma.stock.upsert({
            where: {
              companyId_productId: {
                companyId: companyId,
                productId: sku
              }
            },
            update: {
              quantity: quantity
            },
            create: {
              companyId: companyId,
              productId: sku,
              quantity: quantity
            }
          });
    };
}