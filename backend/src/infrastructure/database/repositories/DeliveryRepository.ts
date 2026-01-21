import { Delivery } from "../../../domain/entities/Delivery";
import { IDeliveryRepository, DeliveryMetrics } from "../../../domain/repositories/IDeliveryRepository";
import { Prisma, PrismaClient } from "../prismaClient";

export class DeliveryRepository implements IDeliveryRepository {
  constructor(private prisma: PrismaClient | Prisma.TransactionClient) {}

  async findAll(): Promise<Delivery[]> {
    return this.prisma.delivery.findMany({
      include: {
        orders: {
          include: {
            client: {
              include: {
                address: true,
              },
            },
            items: {
              include: {
                product: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findByUuid(uuid: string): Promise<Delivery | null> {
    return this.prisma.delivery.findUnique({
      where: { uuid },
      include: {
        orders: {
          include: {
            client: {
              include: {
                address: true,
              },
            },
            items: {
              include: {
                product: true,
              },
            },
            payments: true,
          },
        },
      },
    });
  }

  async create(data: Delivery): Promise<Delivery> {
    const { orders, ...deliveryData } = data;
    const result = await this.prisma.delivery.create({
      data: {
        name: deliveryData.name,
        description: deliveryData.description,
        deliveryDate: deliveryData.deliveryDate,
        driverName: deliveryData.driverName,
        vehiclePlate: deliveryData.vehiclePlate,
        status: deliveryData.status || 'pending',
      },
      include: {
        orders: {
          include: {
            client: true,
            items: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });
    return result as Delivery;
  }

  async updateByUuid(uuid: string, data: Partial<Delivery>): Promise<Delivery> {
    const delivery = await this.findByUuid(uuid);

    if (!delivery) {
      throw new Error(`Entrega com UUID ${uuid} não encontrada`);
    }

    const { id: _, createdAt, updatedAt, orders, uuid: __, ...restDeliveryData } = data;

    const updatedDelivery = await this.prisma.delivery.update({
      where: { uuid },
      data: restDeliveryData as any,
      include: {
        orders: {
          include: {
            client: {
              include: {
                address: true,
              },
            },
            items: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });

    return updatedDelivery as Delivery;
  }

  async deleteByUuid(uuid: string): Promise<void> {
    const delivery = await this.findByUuid(uuid);
    if (!delivery) {
      throw new Error('Entrega não encontrada.');
    }
    await this.prisma.delivery.delete({
      where: { uuid },
    });
  }

  async assignOrdersToDelivery(deliveryUuid: string, orderIds: number[]): Promise<void> {
    const delivery = await this.findByUuid(deliveryUuid);
    if (!delivery || !delivery.id) {
      throw new Error(`Entrega com UUID ${deliveryUuid} não encontrada`);
    }

    await this.prisma.order.updateMany({
      where: {
        id: { in: orderIds },
      },
      data: {
        deliveryId: delivery.id,
      },
    });
  }

  async getDeliveryMetrics(startDate?: Date, endDate?: Date): Promise<DeliveryMetrics> {
    const whereClause: Prisma.DeliveryWhereInput = {};
    
    if (startDate || endDate) {
      whereClause.createdAt = {};
      if (startDate) {
        whereClause.createdAt.gte = startDate;
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        whereClause.createdAt.lte = end;
      }
    }

    // Total de entregas
    const totalDeliveries = await this.prisma.delivery.count({
      where: whereClause,
    });

    // Entregas por status
    const deliveriesByStatusRaw = await this.prisma.delivery.groupBy({
      by: ['status'],
      where: whereClause,
      _count: {
        status: true,
      },
    });

    const deliveriesByStatus = deliveriesByStatusRaw.map((item) => ({
      status: item.status || 'unknown',
      count: item._count.status,
    }));

    const pendingDeliveries = deliveriesByStatus.find((item) => item.status === 'pending')?.count || 0;
    const deliveredDeliveries = deliveriesByStatus.find((item) => item.status === 'delivered')?.count || 0;

    // Buscar todas as entregas com pedidos para calcular métricas
    const deliveries = await this.prisma.delivery.findMany({
      where: whereClause,
      include: {
        orders: {
          select: {
            id: true,
            total: true,
          },
        },
      },
    });

    // Calcular totais
    let totalOrders = 0;
    let totalValue = 0;

    deliveries.forEach((delivery) => {
      totalOrders += delivery.orders.length;
      totalValue += delivery.orders.reduce((sum, order) => sum + order.total, 0);
    });

    const averageOrdersPerDelivery = totalDeliveries > 0 ? totalOrders / totalDeliveries : 0;

    // Top entregas por valor
    const topDeliveriesByValue = deliveries
      .map((delivery) => {
        const deliveryValue = delivery.orders.reduce((sum, order) => sum + order.total, 0);
        return {
          uuid: delivery.uuid,
          name: delivery.name,
          totalValue: deliveryValue,
          ordersCount: delivery.orders.length,
        };
      })
      .sort((a, b) => b.totalValue - a.totalValue)
      .slice(0, 10);

    return {
      totalDeliveries,
      pendingDeliveries,
      deliveredDeliveries,
      totalOrders,
      totalValue,
      averageOrdersPerDelivery: Number(averageOrdersPerDelivery.toFixed(2)),
      deliveriesByStatus,
      topDeliveriesByValue,
    };
  }
}

