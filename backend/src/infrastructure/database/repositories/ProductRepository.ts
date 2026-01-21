import { PrismaClient, Prisma } from '../prismaClient';
import { Product, Stock, stockMovement, findMoviment, TopProducts } from '../../../domain/entities/Product';
import { IProductRepository } from "../../../domain/repositories/IProductRepository";
import {CreateProductDTO, UpdateProductDTO, FindMovementDTO} from "../../../application/dto/product/ProductDTOs";

export class ProductRepository implements IProductRepository {
  constructor(private prisma: PrismaClient | Prisma.TransactionClient) {}


    async create(data: CreateProductDTO): Promise<Product> {
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

    async findByEan(ean: string): Promise<Product | null> {
        return this.prisma.product.findFirst({
            where: {ean, isActive: true},
            include: {
                stock: true
            }
        });
    };

    async update(id: number, data: UpdateProductDTO): Promise<Product> {
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

    async updateStock(sku: number, quantity: number, companyId?: number | undefined): Promise<Stock> {
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
          update: { quantity: { increment: quantity } },
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
            type: data.type as 'IN' | 'OUT',
            unitCost: data.unitCost ?? null,
            invoiceNumber: data.invoiceNumber ?? null,
            userId: data.userId ?? null
          }
        })
    };
    
  async updateManyStockMovements(data: stockMovement[]): Promise<void> {
    await this.prisma.stockMovement.createMany({
    data: data.map((item) => ({
      stockId: item.stockId, 
      quantity: item.quantity,
      type: item.type as 'IN' | 'OUT',
      userId: item.userId ?? null,
      unitCost: item.unitCost ?? null,
      invoiceNumber: item.invoiceNumber ?? null
    })),
    skipDuplicates: false, 
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



async findMovimentByDate(data: findMoviment): Promise<stockMovement[]> {

    const whereCondition: any = {
    createdAt: {
      gte: data.date,
      lt: new Date(data.date.getTime() + 24 * 60 * 60 * 1000),
    },
  };
  if (data.type === 'IN' || data.type === 'OUT') {
    whereCondition.type = data.type;
  }

const movements = await this.prisma.stockMovement.findMany({
  where: whereCondition,
  include: {
    stock: {
      select: {
        quantity: true,
        product: {
          select: {
            name: true,
            sku: true,
            id: true
          }
        }
      }
    },
    user: {
      select: {
        fullName: true 
        }
      }
    },
    orderBy: {
      id: 'desc'
    }
  });

  // Para movimentações de entrada (IN) com invoiceNumber, buscar informações da nota fiscal
  const movementsWithInvoice = await Promise.all(
    movements.map(async (movement) => {
      const result: any = {
        id: movement.id,
        userId: movement.userId ?? null,
        createdAt: movement.createdAt.toISOString(),
        stockId: movement.stockId,
        type: movement.type,
        quantity: movement.quantity,
        unitCost: movement.unitCost ?? null,
        invoiceNumber: movement.invoiceNumber ?? null,
        product: movement.stock?.product ? {
          name: movement.stock.product.name,
          sku: movement.stock.product.sku
        } : undefined,
        user: movement.user ? {
          name: movement.user.fullName
        } : undefined,
        purchaseInvoice: null
      };

      // Se for entrada e tiver invoiceNumber, buscar informações da nota fiscal
      if (movement.type === 'IN' && movement.invoiceNumber && movement.stock?.product?.id) {
        try {
          // O invoiceNumber está no formato "série-número" (ex: "1-487569")
          // Pode ter múltiplos hífens, então pegamos o primeiro como série e o resto como número
          const parts = movement.invoiceNumber.split('-');
          
          if (parts.length >= 2) {
            const series = parts[0];
            const number = parts.slice(1).join('-'); // Junta o resto caso tenha mais hífens
            
            const purchaseInvoice = await this.prisma.purchaseInvoice.findFirst({
              where: {
                series: series,
                number: number
              },
              include: {
                supplier: true,
                items: {
                  where: {
                    productId: movement.stock.product.id
                  }
                }
              }
            });

            if (purchaseInvoice && purchaseInvoice.items.length > 0) {
              const item = purchaseInvoice.items[0]; // Pega o primeiro item que corresponde ao produto
              
              result.purchaseInvoice = {
                id: purchaseInvoice.id,
                number: purchaseInvoice.number,
                series: purchaseInvoice.series,
                issueDate: purchaseInvoice.issueDate,
                entryDate: purchaseInvoice.entryDate,
                supplier: {
                  tradeName: purchaseInvoice.supplier.tradeName,
                  legalName: purchaseInvoice.supplier.legalName,
                  cnpj: purchaseInvoice.supplier.cnpj
                },
                item: {
                  quantity: Number(item.quantity),
                  unitPrice: Number(item.unitPrice),
                  totalAmount: Number(item.totalAmount),
                  description: item.description
                }
              };
            }
          }
        } catch (error) {
          console.error('Erro ao buscar informações da nota fiscal:', error);
          // Continua sem as informações da nota fiscal em caso de erro
        }
      }

      return result;
    })
  );

  return movementsWithInvoice;
};


async countStock(startDate: Date, endDate: Date): Promise<number> {
  const result = await this.prisma.stock.aggregate({
    _sum: {
      quantity: true
    },
    where: {
      createdAt: {
        gte: startDate,
        lt: endDate
      }
    }
  })
  return result._sum.quantity ?? 0;
};

async countMoviment(startDate: Date, endDate: Date, type: 'IN' | 'OUT'): Promise<number> {
  const result = await this.prisma.stockMovement.aggregate({
    _sum: {
      quantity: true
    },
    where: {
      createdAt: {
        gte: startDate,
        lt: endDate
      },
      type: type
    }
  })
  return result._sum.quantity ?? 0
};

async countByMonth(initialMonth: number, finalMonth: number): Promise<number> {
  const result = await this.prisma.stock.aggregate({
    _sum: {
      quantity: true
    },
    where: {
      createdAt: {
        gte: new Date(new Date().getFullYear(), initialMonth - 1, 1),
        lt: new Date(new Date().getFullYear(), finalMonth, 1),
      }
    }
  })
  return result._sum.quantity ?? 0
};


async getTopProductsByMonth(initialMonth: number, finalMonth: number): Promise<TopProducts[]> {
  const result = await this.prisma.orderItem.groupBy({
    by: ['productId'], 
    _sum: {
      quantity: true,
    },
    where: {
      order: { 
        createdAt: {
          gte: new Date(new Date().getFullYear(), initialMonth - 1, 1),
          lt: new Date(new Date().getFullYear(), finalMonth, 1),
        },
      },
    },
    orderBy: {
      _sum: {
        quantity: 'desc',
      },
    },
    take: 10, 
  })

  const products = await this.prisma.product.findMany({
    where: {
      id: { in: result.map(r => r.productId) },
    },
    select: { id: true, name: true },
  })

  // Montar a lista final sem duplicações
  return result.map(r => ({
    name: products.find(p => p.id === r.productId)?.name ?? 'Produto desconhecido',
    total: r._sum.quantity ?? 0,
  }))
}
  async validateProducts(products: Product[]): Promise<{
    skuExisting: string[],
    eanExisting: string[]
  }> {
    const skuList = products.map(p => p.sku);
    const eanList = products.map(p => p.ean.toString());
    try {
      const existingProducts = await this.prisma.product.findMany({
        where: {
          OR: [
            { sku: { in: skuList } },
            { ean: { in: eanList } }
          ]
        },
        select: {
          sku: true,
          ean: true
        }
      });

      const skuExisting = [...new Set(existingProducts.map(p => p.sku))];
      const eanExisting = [...new Set(existingProducts.map(p => p.ean))];

      return {
        skuExisting,
        eanExisting
      }

    } catch (error) {
      console.log(error);
      return {
        skuExisting: [],
        eanExisting: []
      };
    }
  }

}