import { Order } from "../../../domain/entities/Order";
import { OrderItem } from "../../../domain/entities/OrderItem";
import { IOrderRepository } from "../../../domain/repositories/IOrderRepository";
import { PrismaClient } from "@prisma/client";

export class OrderRepository implements IOrderRepository {
  constructor(private prisma: PrismaClient) {}

  async findAll(): Promise<Order[]> {
    return this.prisma.order.findMany({
        include: {
            items: true,
            client: true
        },
    });
  }

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
  }

  
  async findById(id: number): Promise<Order | null> {
    return this.prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
      },
    });
  }

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
  }

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
  }

  async delete(id: number): Promise<void> {
    const sale = await this.findById(id);
    if (sale) {
      await this.prisma.order.delete(
        {
            where: { id },
        }
      );
    }
  }
}