import { IOrderRepository, FindAllOrderFilter } from "../../../domain/repositories/IOrderRepository";
import { OrderResponse } from "../../dto/order/OrderResponse";

export class FindAllOrderUseCase {
  constructor(private orderRepository: IOrderRepository) {}
  async execute(filter?: FindAllOrderFilter): Promise<OrderResponse[]> {
    const orders = await this.orderRepository.findAll(filter);
    return orders;
  }
}