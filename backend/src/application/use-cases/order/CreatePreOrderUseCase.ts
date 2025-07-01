import { OrderResponse } from '../../dto/order/OrderResponse';
import { IOrderRepository } from '../../../domain/repositories/IOrderRepository';

export class CreatePreOrderUseCase {
  constructor(
    private orderRepository: IOrderRepository
  ) {}

  async execute(clientId: number): Promise<OrderResponse> {
  return await this.orderRepository.createPreOrder(clientId)
}
}