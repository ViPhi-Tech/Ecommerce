import { IOrderRepository } from "../../../domain/repositories/IOrderRepository";
import { OrderResponse } from "../../dto/order/OrderResponse";

export class FindAvailableOrdersUseCase {
  constructor(private orderRepository: IOrderRepository) {}

  async execute(excludeDeliveryId?: number): Promise<OrderResponse[]> {
    // Busca pedidos que não estão entregues diretamente do repositório
    // Se excludeDeliveryId for fornecido, inclui pedidos dessa entrega (para edição)
    const orders = await this.orderRepository.findAvailable(excludeDeliveryId);
    return orders;
  }
}
