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

async findStockByProductId(productId: number[]): Promise<Stock[]> {
  return this.prisma.stock.findMany({
    where: {
      productId: {
        in: productId
      }
    }
  });
}

  async findMovimentByProductId(stockId: number[]): Promise<stockMovement[]> {
    return this.prisma.stockMovement.findMany({
      where: {
        stockId: {
          in: stockId
        }
      }
    });
  }

  async findByName(param: string): Promise<Product[]> {
    return this.prisma.$queryRawUnsafe<Product[]>(`
      SELECT *
      FROM "Product"
      WHERE "name" % $1 AND "isActive" = true
      ORDER BY similarity("name", $1) DESC
      LIMIT 20
    `, param);
  };


    async findByAnyParam(param: string): Promise<Product[]> {
      const searchTerm = `%${param}%`;

      const resp = await this.prisma.$queryRaw<Product[]>(Prisma.sql`
        SELECT *
        FROM "Product"
        WHERE
          "isActive" = true AND (
            CAST("ean" AS TEXT) ILIKE ${searchTerm} OR
            CAST("sku" AS TEXT) ILIKE ${searchTerm} OR
            CAST("id" AS TEXT) ILIKE ${searchTerm} OR  -- Adicionado: Busca por ID
            "name" % ${param}
          )
        ORDER BY
          CASE
            WHEN CAST("id" AS TEXT) ILIKE ${searchTerm} THEN -1 -- Prioriza ID (-1 é o valor mais baixo, logo o primeiro)
            WHEN CAST("ean" AS TEXT) ILIKE ${searchTerm} THEN 0
            WHEN CAST("sku" AS TEXT) ILIKE ${searchTerm} THEN 1
            ELSE 2
          END,
          similarity("name", ${param}) DESC
        LIMIT 20;
      `);

  console.log(resp)
  return resp
};



}