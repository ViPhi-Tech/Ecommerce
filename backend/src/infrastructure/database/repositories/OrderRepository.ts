import { Order } from "../../../domain/entities/Order";
import { AggregateOrderResponse, AggregateOrderStatusResponse, OrderItem, AggregateOrderCategoryResponse } from "../../../domain/entities/OrderItem";
import { IOrderRepository } from "../../../domain/repositories/IOrderRepository";
import { Prisma, PrismaClient } from "../prismaClient";

export class OrderRepository implements IOrderRepository {
  constructor(private prisma:  PrismaClient | Prisma.TransactionClient) {}

  async findAll(): Promise<Order[]> {
    return this.prisma.order.findMany({
        include: {
          items: true,
          client: true,
          payments: true,
        },
        where: {
          isActive: true
        },
        orderBy: {
          createdAt: 'desc'
        }
    });
  };

  async findAvailable(): Promise<Order[]> {
    return this.prisma.order.findMany({
        include: {
          items: true,
          client: true,
          payments: true,
        },
        where: {
          isActive: true,
          status: {
            not: 'DELIVERED'
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
    });
  };

  async createItems(orderId: number, items: any[]): Promise<OrderItem[]> {
    await this.prisma.orderItem.createMany({
      data: items.map((item) => ({
        orderId,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
    });
    // Fetch the created items since createMany only returns count
    return await this.prisma.orderItem.findMany({
      where: {
        orderId
      }
    });
  };

  
  async findById(id: number): Promise<Order | null> {
    return this.prisma.order.findUnique({
      where: { id },
      include: {
        payments: true, // Include payment details in the order
        client: true,
        items: {
          include: {
            product: true, // Include product details in the order items
          },
        }
      },
    });
  };

  // Método otimizado para validar múltiplos IDs sem includes pesados
  async validateIds(ids: number[]): Promise<number[]> {
    const orders = await this.prisma.order.findMany({
      where: {
        id: { in: ids },
        isActive: true
      },
      select: {
        id: true // Apenas o ID, sem includes pesados
      }
    });
    return orders.map(order => order.id);
  };

  async create(saleData: Partial<Order>): Promise<Order> {
    const { clientId, total } = saleData;
    const result = await this.prisma.order.create(
      {
        data: {
          clientId: clientId as number,
          total: total as number,
        }
      }
    );
    return result as Order;
  };

  async update(id: number, saleData: Partial<Order>): Promise<Order> {
    const sale = await this.findById(id);
    
    if (!sale) {
      throw new Error(`Venda com ID ${id} não encontrada`);
    }
    
    const { id: _, createdAt, updatedAt, ...restSaleData } = saleData;
    
    const updatedSale = await this.prisma.order.update({
      where: { id },
      data: restSaleData as any,
      include: { items: true }
    });
    
    return updatedSale as Order;
  };

  async delete(id: number): Promise<void> {
    const sale = await this.findById(id);
    if (sale && sale.isActive) {
      await this.prisma.order.update({
        where: { id },
        data: { isActive: false }
      });
    }else {
      throw new Error('Order not found.');
    }
  };

  async createPreOrder(clientId: number): Promise<Order> {
    return await this.prisma.order.create({
      data: {
        clientId,
        total: 0,
      },
    });
  };

  async countByMonth(initialMonth: number, finalMonth: number): Promise<number> {
    return await this.prisma.order.count({
      where: {
        createdAt: {
          gte: new Date(new Date().getFullYear(), initialMonth - 1, 1),
          lt: new Date(new Date().getFullYear(), finalMonth, 1),
        }
      }
    })
  };
  

  async countSalesByMonth(initialMonth: number, finalMonth: number): Promise<number> {
  const result = await this.prisma.order.aggregate({
    _sum: {
      total: true
    },
    where: {
      createdAt: {
        gte: new Date(new Date().getFullYear(), initialMonth - 1, 1),
        lt: new Date(new Date().getFullYear(), finalMonth, 1),
      }
    }
  })
  return result._sum.total ?? 0
};

async aggregateSalesByMonth(initialMonth: number, finalMonth: number): Promise<AggregateOrderResponse[]> {
  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const results = await this.prisma.$queryRaw<
    { year: number; month: number; total: number }[]
  >`
    SELECT 
      EXTRACT(YEAR FROM "createdAt")::int AS year,
      EXTRACT(MONTH FROM "createdAt")::int AS month,
      COALESCE(SUM("total"), 0) AS total
    FROM "Order"
    WHERE EXTRACT(MONTH FROM "createdAt") BETWEEN ${initialMonth} AND ${finalMonth}
    GROUP BY year, month
    ORDER BY year, month;
  `;

  return results.map(r => ({
    year: r.year,
    month: monthNames[r.month - 1],
    total: Number(r.total) ?? 0,
  }));
};

async aggregateSalesByStatus(initialMonth: number, finalMonth: number): Promise<AggregateOrderStatusResponse[]> {
  const results = await this.prisma.$queryRaw<
    { name: string; total: number }[]
  >`
    SELECT 
      o."status" AS name,
      COALESCE(SUM(oi."quantity")::int, 0) AS total
    FROM "Order" o
    JOIN "OrderItem" oi ON oi."orderId" = o."id"
    WHERE EXTRACT(MONTH FROM o."createdAt") BETWEEN ${initialMonth} AND ${finalMonth}
    GROUP BY o."status"
    ORDER BY total DESC;
  `;

  return results;
};

async aggregateSalesByCategory(initialMonth: number, finalMonth: number): Promise<AggregateOrderCategoryResponse[]> {
  const results = await this.prisma.$queryRaw<{ name: string; total: number }[]
  >`
    SELECT 
      c."name" AS category_name,
      COALESCE(SUM(oi."quantity")::int, 0) AS total_quantity
    FROM "OrderItem" oi
    JOIN "Product" p ON p."id" = oi."productId"
    JOIN "Category" c ON c."id" = p."categoryId"
    JOIN "Order" o ON o."id" = oi."orderId"
    WHERE EXTRACT(MONTH FROM o."createdAt") BETWEEN ${initialMonth} AND ${finalMonth}
    GROUP BY c."id", c."name"
    ORDER BY total_quantity DESC;
  `;

  return results;
};


async getOrdersByClient(clientId: number, startDate: string, endDate: string, paymentTypeId: string): Promise<Order[]> {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const now = new Date();
  start.setDate(start.getDate() + 1);
  end.setDate(end.getDate() + 1);
  end.setHours(23, 59, 59, 999);
  if (now.getHours() >= 21) {
    end.setDate(end.getDate() + 1);
}
  
  return this.prisma.order.findMany({
      where: { 
        clientId, 
        createdAt: { 
          gte: start, 
          lte: end 
        }, 
        accountsReceivableId: null,
        payments: paymentTypeId ? { some: { typeId: paymentTypeId } } : undefined 
      },
      include: {
        items: true,
        client: true,
        payments: true,
      },
      orderBy: {
        id: 'desc'
      }
  })};

  async assignOrdersToAccountsReceivable(orders: number[], accountsReceivableId: number): Promise<void> {
    await this.prisma.order.updateMany({
      where: {
        id: { in: orders }
      },
      data: {
        accountsReceivableId
      }
    });
  };

  async assignOrdersToDelivery(orderIds: number[], deliveryId: number): Promise<void> {
    await this.prisma.order.updateMany({
      where: {
        id: { in: orderIds }
      },
      data: {
        deliveryId
      }
    });
  }

  async removeDeliveryFromOrders(orderIds: number[]): Promise<void> {
    await this.prisma.order.updateMany({
      where: {
        id: { in: orderIds }
      },
      data: {
        deliveryId: null
      }
    });
  }
}
