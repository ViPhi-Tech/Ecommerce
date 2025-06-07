import { CreateOrderInput } from '../../dto/order/CreateOrderInput';
import { OrderResponse } from '../../dto/order/OrderResponse';
import { IOrderRepository } from '../../../domain/repositories/IOrderRepository';

export class CreateOrderUseCase {
  constructor(
    private orderRepository: IOrderRepository
  ) {}

  async execute(input: CreateOrderInput): Promise<OrderResponse> {
    const order = await this.orderRepository.create({
      clientId: input.clientId,
      total: input.total
    });

    if (!order || !order.id) {
      throw new Error('Order not created');
    }
    const items = await this.orderRepository.createItems(order.id, input.items);

    return {
      id: order.id,
      clientId: order.clientId,
      total: order.total,
      items: items
    };
  }
}
