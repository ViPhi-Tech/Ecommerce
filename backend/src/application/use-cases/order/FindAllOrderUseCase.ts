import { IOrderRepository } from "../../../domain/repositories/IOrderRepository";
import { OrderResponse } from "../../dto/order/OrderResponse";

export class FindAllOrderUseCase {
  constructor(private orderRepository: IOrderRepository) {}
  async execute(): Promise<OrderResponse[]> {
    const orders = await this.orderRepository.findAll();
    return orders;
  }
}