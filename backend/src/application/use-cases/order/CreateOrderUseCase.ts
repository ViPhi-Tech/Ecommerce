import type { CreateOrderInput } from "../../dto/order/CreateOrderInput";
import type { OrderResponse } from "../../dto/order/OrderResponse";
import type { IOrderRepository } from "../../../domain/repositories/IOrderRepository";
import type { IProductRepository } from "../../../domain/repositories/IProductRepository";
import type { ITransactionRunner } from "../../../domain/repositories/ITransactionRunner";
import type { IPaymentRepository } from "../../../domain/repositories/IPaymentRepository";
import type { IAuthService } from "../../../domain/services/IAuthService";
import type { ITransactionClient } from "../../../domain/repositories/ITransactionClient"; // Added this import
import { Order } from "../../../domain/entities/Order"; // Assuming an Order entity similar to Invoice

type OrderRepositoryFactory = (tx: ITransactionClient) => IOrderRepository;
type ProductRepositoryFactory = (tx: ITransactionClient) => IProductRepository;
type PaymentRepositoryFactory = (tx: ITransactionClient) => IPaymentRepository;

export class CreateOrderUseCase {
  constructor(
    private transactionRunner: ITransactionRunner,

    private orderRepositoryFactory: OrderRepositoryFactory,
    private productRepositoryFactory: ProductRepositoryFactory,
    private paymentRepositoryFactory: PaymentRepositoryFactory,
    private authService: IAuthService, 
  ) {}

  async execute(input: CreateOrderInput, authToken: string): Promise<OrderResponse> {
    const tokenDecoded = this.authService.verifyToken(authToken);

    return this.transactionRunner.run<OrderResponse>(async (tx) => {

      const orderRepository = this.orderRepositoryFactory(tx);
      const productRepository = this.productRepositoryFactory(tx);
      const paymentRepository = this.paymentRepositoryFactory(tx);

      // Create order and its items
      const order = await orderRepository.create({
        clientId: input.clientId,
        total: input.total,
      });

      if (!order?.id) {
        throw new Error("Failed to create order."); // More specific error message
      }

      const createdItems = await orderRepository.createItems(order.id, input.items);

      if (createdItems.length > 0) {
        await this.processStockMovements(
          createdItems,
          tokenDecoded?.sub,
          productRepository
        );
      }

      if (input.payments && input.payments.length > 0) {
        await this.processPayments(order.id, input.payments, paymentRepository);
      }

      return {
        id: order.id,
        clientId: order.clientId,
        total: order.total,
        // You might want to return the `createdItems` here if OrderResponse expects them
        items: createdItems
      };
    });
  }


  private async processStockMovements(
    items: { productId: number; quantity: number }[],
    userId: number | undefined, // Explicitly allow undefined
    productRepository: IProductRepository // Ensure it's not optional here
  ): Promise<void> {
    // No need for `if (items.length === 0) return` as it's handled by the caller

    const formattedStockDecrements = items.map((item) => ({
      sku: item.productId,
      quantity: item.quantity,
    }));

    await productRepository.decrementMultipleStocks(formattedStockDecrements);

    const productIds = items.map((item) => item.productId);
    const stocks = await productRepository.findStockByProductId(productIds);

    const stockMap = new Map<number, number>();
    stocks.forEach((stock) => {
      if (stock.productId && stock.id) {
        stockMap.set(stock.productId, stock.id);
      }
    });

    const formattedStockMovements = items.map((item) => {
      const stockId = stockMap.get(item.productId);
      if (stockId === undefined) {
        throw new Error(`Stock ID not found for product ID ${item.productId}.`);
      }
      return {
        sku: item.productId,
        quantity: item.quantity,
        type: "OUT", // Assuming 'OUT' for order-related stock decrease
        stockId: stockId, // Use the retrieved stockId
        userId: userId, // Pass userId directly
      };
    });

    await productRepository.updateManyStockMovements(formattedStockMovements);
  }

  private async processPayments(
    orderId: number,
    payments: any[], // Consider defining a more specific type for payments if possible
    paymentRepository: IPaymentRepository
  ): Promise<void> {
    const paymentsToCreate = payments.map((payment) => ({
      ...payment,
      orderId: orderId, // Ensure orderId is explicitly assigned
      statusId: "pending", // Default status, adjust as needed
    }));

    // The createMany method usually implies creating multiple records related to an orderId
    await paymentRepository.createMany(orderId, paymentsToCreate); // Adjusted to remove orderId as separate arg if createMany uses it from objects
  }
}
