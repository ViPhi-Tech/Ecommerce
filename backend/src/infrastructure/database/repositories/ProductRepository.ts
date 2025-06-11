import { PrismaClient } from '@prisma/client';
import { Product, Stock } from '../../../domain/entities/Product';
import { IProductRepository } from "../../../domain/repositories/IProductRepository";
import {ProductCreateDTO, ProductDTO} from "../../http/dto/Product.dto";

export class ProductRepository implements IProductRepository {
    constructor(private prisma: PrismaClient) {
    }

    async create(data: ProductCreateDTO): Promise<Product> {
        return this.prisma.product.create({
            data
        });
    };

    async findAll(): Promise<(Product)[]> {
      return this.prisma.product.findMany({
        include: {
          stock: true
        }
      });
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
      const deleted = await this.prisma.product.delete({
        where: {id}
      });
      console.log(deleted)
    };

    async updateStock(sku: number, quantity: number, companyId: number): Promise<Stock> {
        return this.prisma.stock.upsert({
            where: {
              productId: sku
            },
            update: {
              quantity: quantity
            },
            create: {
              productId: sku,
              quantity: quantity
            }
          });
    };


    async updateMultipleStocks(items: { sku: number; quantity: number }[]): Promise<Stock[]> {
      const operations = items.map(({ sku, quantity }) => 
        this.prisma.stock.upsert({
          where: { productId: sku },
          update: { quantity: { decrement: quantity } },
          create: { productId: sku, quantity: -quantity }
        })
      );
      
      return await this.prisma.$transaction(operations);
    };
    
}