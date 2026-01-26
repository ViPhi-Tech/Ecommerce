import { IOrderRepository } from "../../../domain/repositories/IOrderRepository";
import { OrderResponse } from "../../dto/order/OrderResponse";

export class FindAvailableOrdersUseCase {
  constructor(private orderRepository: IOrderRepository) {}

  async execute(): Promise<OrderResponse[]> {
    // Busca pedidos que não estão entregues diretamente do repositório
    const orders = await this.orderRepository.findAvailable();
    return orders;
  }
}
