import { PrismaClient, Prisma } from '@prisma/client';
import { Product, Stock, stockMovement } from '../../../domain/entities/Product';
import { IProductRepository } from "../../../domain/repositories/IProductRepository";
import {ProductCreateDTO, ProductUpdateDTO} from "../../http/dto/Product.dto";

export class ProductRepository implements IProductRepository {
  constructor(private prisma: PrismaClient | Prisma.TransactionClient) {}


    async create(data: ProductCreateDTO): Promise<Product> {
        const created = await this.prisma.product.create({
            data,
            include :{
              stock: true
            }
        });
        console.log(created)
        return created
    };

    async findAll(): Promise<(Product)[]> {
      return this.prisma.product.findMany({
        where: {
          isActive: true
        },
        include: {
          stock: true
        }
      });
    }


    async findByProductId(productIds: number[]): Promise<Stock[]> {
      return this.prisma.stock.findMany({
        where: {
          productId: {
            in: productIds,
          },
        },
      });
    };

    async findById(id: number): Promise<Product | null> {
        return this.prisma.product.findUnique({
            where: {id, isActive: true}
        });
    }

    async update(id: number, data: ProductUpdateDTO): Promise<Product> {
        return this.prisma.product.update({
            where: {id},
            data
        });
    }

    async delete(id: number): Promise<void> {
      await this.prisma.product.update({
        where: {id},
        data: {
          isActive: false
        }
      });
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


    async decrementMultipleStocks(items: { sku: number; quantity: number }[]): Promise<Stock[]> {
      const operations = items.map(({ sku, quantity }) => 
        this.prisma.stock.upsert({
          where: { productId: sku },
          update: { quantity: { decrement: quantity } },
          create: { productId: sku, quantity: -quantity }
        })
      );
      
    return await Promise.all(operations);
    };

    async incrementMultipleStocks(items: { sku: number; quantity: number }[]): Promise<Stock[]> {
      const operations = items.map(({ sku, quantity }) => 
        this.prisma.stock.upsert({
          where: { productId: sku },
          update: { quantity: { decrement: quantity } },
          create: { productId: sku, quantity: -quantity }
        })
      );
      
    return await Promise.all(operations);
    };


    async upsertStockMovement(data: stockMovement): Promise<void> {
        await this.prisma.stockMovement.create({
          data: {
            stockId: data.stockId,
            quantity: data.quantity,
            type: data.type as 'IN' | 'OUT'
          }
        })
    };
    
  async updateManyStockMovements(data: stockMovement[]): Promise<void> {
    await this.prisma.stockMovement.createMany({
    data: data.map((item) => ({
      stockId: item.stockId, // corrigido 'sotckId' para 'stockId'
      quantity: item.quantity,
      type: item.type as 'IN' | 'OUT',
      userId: item.userId ?? null
    })),
    skipDuplicates: false, // ou true se quiser ignorar duplicatas
  });
};


  
}