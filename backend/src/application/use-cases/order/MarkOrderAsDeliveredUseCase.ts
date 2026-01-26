import { IOrderRepository } from "../../../domain/repositories/IOrderRepository";
import { OrderResponse } from "../../dto/order/OrderResponse";

export class MarkOrderAsDeliveredUseCase {
  constructor(private orderRepository: IOrderRepository) {}

  async execute(orderId: number): Promise<OrderResponse> {
    // Verificar se o pedido existe
    const order = await this.orderRepository.findById(orderId) as any;
    
    if (!order) {
      throw new Error(`Pedido com ID ${orderId} não encontrado`);
    }

    // Verificar se já está entregue
    if (order.status === 'DELIVERED') {
      throw new Error('Este pedido já foi marcado como entregue');
    }

    // Atualizar status para DELIVERED
    const updatedOrder = await this.orderRepository.update(orderId, {
      status: 'DELIVERED',
    } as any);

    // Buscar o pedido atualizado com todos os relacionamentos
    const orderWithRelations = await this.orderRepository.findById(orderId) as any;

    if (!orderWithRelations) {
      throw new Error(`Erro ao buscar pedido atualizado com ID ${orderId}`);
    }

    return {
      id: orderWithRelations.id,
      clientId: orderWithRelations.clientId,
      total: orderWithRelations.total,
      status: orderWithRelations.status || 'DELIVERED',
      createdAt: orderWithRelations.createdAt,
      client: orderWithRelations.client ? {
        id: orderWithRelations.client.id,
        name: orderWithRelations.client.fullName,
        email: orderWithRelations.client.email,
        document: orderWithRelations.client.document,
        phone: orderWithRelations.client.phone,
        companyId: orderWithRelations.client.companyId,
        isActive: orderWithRelations.client.isActive,
      } : undefined,
      items: orderWithRelations.items?.map((item: any) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
    };
  }
}
