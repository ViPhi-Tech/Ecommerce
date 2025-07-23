import type { CreateOrderInput } from "../../dto/order/CreateOrderInput";
import type { OrderResponse } from "../../dto/order/OrderResponse";
import type { IOrderRepository } from "../../../domain/repositories/IOrderRepository";
import type { IProductRepository } from "../../../domain/repositories/IProductRepository";
import type { IPaymentRepository } from "../../../domain/repositories/IPaymentRepository";
import type { ITransactionRunner } from "../../../domain/repositories/ITransactionRunner";
import type { ITransactionClient } from "../../../domain/repositories/ITransactionClient";
import type { OrderItem } from "../../../domain/entities/OrderItem"; 

type OrderRepositoryFactory = (tx: ITransactionClient) => IOrderRepository;
type ProductRepositoryFactory = (tx: ITransactionClient) => IProductRepository;
type PaymentRepositoryFactory = (tx: ITransactionClient) => IPaymentRepository;

export class UpdateOrderUseCase {
  constructor(
    private transactionRunner: ITransactionRunner,
    private orderRepositoryFactory: OrderRepositoryFactory,
    private productRepositoryFactory: ProductRepositoryFactory, 
    private paymentRepositoryFactory: PaymentRepositoryFactory
  ) {}

  async execute(orderId: number, input: CreateOrderInput): Promise<OrderResponse> {
    return this.transactionRunner.run<OrderResponse>(async (tx) => {
      const orderRepository = this.orderRepositoryFactory(tx);
      const productRepository = this.productRepositoryFactory(tx);
      const paymentRepository = this.paymentRepositoryFactory(tx);

      const order = await orderRepository.update(orderId, input);

      if (!order || !order.id) {
        throw new Error(`Failed to update order with ID ${orderId}. Order not found or creation failed.`);
      }

      const updatedItems = await this.processOrderItems(order.id, input.items, orderRepository);

      if (updatedItems.length > 0) {
        await this.handleStockMovementPlaceholder(updatedItems, productRepository);
      }

      if (input.payments && input.payments.length > 0) {
        await this.processPayments(order.id, input.payments, paymentRepository);
      }

      return {
        id: order.id,
        clientId: order.clientId,
        total: order.total,
        items: updatedItems, 
      };
    });
  }


  private async processOrderItems(
    orderId: number,
    itemsInput: CreateOrderInput['items'],
    orderRepository: IOrderRepository
  ): Promise<OrderItem[]> {

    return orderRepository.createItems(orderId, itemsInput);
  }

  private async handleStockMovementPlaceholder(
    items: OrderItem[],
    productRepository: IProductRepository
  ): Promise<void> {

    const formattedItems = items.map(item => ({
      sku: item.productId,
      quantity: item.quantity
    }));
  }

  private async processPayments(
    orderId: number,
    paymentsInput: CreateOrderInput['payments'],
    paymentRepository: IPaymentRepository
  ): Promise<void> {
    const enrichedPayments = [];
    for (const payment of paymentsInput) {
      enrichedPayments.push({
        ...payment,
        orderId: orderId, 
        statusId: 'pending' 
      });
    }
    await paymentRepository.createMany(orderId, enrichedPayments);

  }
}