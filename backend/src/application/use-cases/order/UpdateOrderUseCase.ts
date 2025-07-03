import { CreateOrderInput } from "../../dto/order/CreateOrderInput";
import { IOrderRepository } from "../../../domain/repositories/IOrderRepository";
import { OrderResponse } from "../../dto/order/OrderResponse";
import { ITransactionRunner } from "../../../domain/repositories/ITransactionRunner";
import { IProductRepository } from "../../../domain/repositories/IProductRepository";
import { IPaymentRepository } from "../../../domain/repositories/IPaymentRepository";

export class UpdateOrderUseCase {
  constructor(
    private transactionRunner: ITransactionRunner,
    private orderRepository: IOrderRepository,
    private productRepository: IProductRepository,
    private paymentRepository: IPaymentRepository
  ) {}

  async execute(orderId: number, input: CreateOrderInput): Promise<OrderResponse> {
  return this.transactionRunner.run(async () => {
    const order = await this.orderRepository.update(orderId, input);

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

    if (input.payments.length >0){

        const enrichedPayments = [];
        for (const payment of input.payments) {
        enrichedPayments.push({
            ...payment,
            orderId: order.id,
            statusId: 'pending'
        });
        }
        await this.paymentRepository.createMany(order.id, enrichedPayments);
    }
    
    return {
      id: order.id,
      clientId: order.clientId,
      total: order.total,
      items: items,
    };
  });
}
}
