import { IOrderRepository } from '../../../domain/repositories/IOrderRepository';

export class DeleteOrderUseCase {
  constructor(private orderRepository: IOrderRepository) {}

  async execute(id: number): Promise<void> {
    try {
      await this.orderRepository.delete(id);
    } catch (error: any) {
      const message = error?.message?.toLowerCase() ?? '';
      if (message.includes('not found')) {
        throw new Error('Order not found.');
      }
      throw new Error(error?.message || 'Internal server error while deleting order.');
    }
  }
}


