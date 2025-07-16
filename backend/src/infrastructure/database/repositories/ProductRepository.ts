import { PrismaClient, Prisma } from '@prisma/client';
import { Product, Stock, stockMovement, Metric } from '../../../domain/entities/Product';
import { IProductRepository } from "../../../domain/repositories/IProductRepository";
import {ProductCreateDTO, ProductUpdateDTO, metricDTO} from "../../http/dto/Product.dto";

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
    };


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
    };

    async update(id: number, data: ProductUpdateDTO): Promise<Product> {
        return this.prisma.product.update({
            where: {id},
            data
        });
    };

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
};

  async findMovimentByProductId(stockId: number[]): Promise<stockMovement[]> {
    return this.prisma.stockMovement.findMany({
      where: {
        stockId: {
          in: stockId
        }
      }
    });
  };

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
  try {
    const searchTerm = `%${param}%`;

    const resp = await this.prisma.$queryRaw<Product[]>(Prisma.sql`
      SELECT 
        p.id,
        p.name,
        p.description,
        p."shortDescription",
        p."initialPrice",
        p."finalPrice",
        p."brandId",
        b."name" as brandName,
        p."image",
        p."sku",
        p."ean",
        p."companyId",
        p."categoryId",
        json_build_object(
          'id', c.id,
          'name', c.name
        ) AS category,
        json_build_object(
          'id', s.id,
          'productId', s."productId",
          'quantity', s.quantity,
          'createdAt', s."createdAt",
          'updatedAt', s."updatedAt"
        ) AS stock
      FROM "Product" p
      LEFT JOIN "Stock" s ON s."productId" = p.id
      LEFT JOIN "Brand" b ON p."brandId" = b.id
      LEFT JOIN "Category" c ON p."categoryId" = c.id
      WHERE
        p."isActive" = true AND (
          CAST(p."ean" AS TEXT) ILIKE ${searchTerm} OR
          CAST(p."sku" AS TEXT) ILIKE ${searchTerm} OR
          CAST(p."id" AS TEXT) ILIKE ${searchTerm} OR
          p."name" ILIKE ${searchTerm} OR
          similarity(p."name", ${param}) > 0.1
        )
      ORDER BY
        CASE
          WHEN CAST(p."id" AS TEXT) ILIKE ${searchTerm} THEN -1
          WHEN CAST(p."ean" AS TEXT) ILIKE ${searchTerm} THEN 0
          WHEN CAST(p."sku" AS TEXT) ILIKE ${searchTerm} THEN 1
          WHEN p."name" ILIKE ${searchTerm} THEN 2
          ELSE 3
        END,
        similarity(p."name", ${param}) DESC
      LIMIT 20;
    `);

    return resp;
  } catch (err) {
    console.error('Erro ao buscar produtos:', err);
    return [];
  }
};


async getMetrics(data: Metric): Promise<{ total: number }> {
  
  const whereCondition: any = {
    createdAt: {
      gte: data.date,
      lt: new Date(data.date.getTime() + 24 * 60 * 60 * 1000),
    },
  };
  if (data.type === 'IN' || data.type === 'OUT') {
    whereCondition.type = data.type;
  }
  const result = await this.prisma.stockMovement.aggregate({
    _sum: {
      quantity: true,
    },
    where: whereCondition,
  });

  return { total: result._sum.quantity ?? 0 };
}
    



}