import { CreateOrderInput } from '../../dto/order/CreateOrderInput';
import { OrderResponse } from '../../dto/order/OrderResponse';
import { IOrderRepository } from '../../../domain/repositories/IOrderRepository';
import { IProductRepository } from '../../../domain/repositories/IProductRepository';

export class CreateOrderUseCase {
  constructor(
    private orderRepository: IOrderRepository,
    private productRepository: IProductRepository
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
    if (items.length > 0) {
      const formattedItems = items.map(item => ({
        sku: item.productId,
        quantity: item.quantity,
      }));
      await this.productRepository.updateMultipleStocks(formattedItems);
    }
    return {
      id: order.id,
      clientId: order.clientId,
      total: order.total,
      items: items
    };
  }
}
