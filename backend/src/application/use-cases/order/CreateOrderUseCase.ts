import type { CreateOrderInput } from "../../dto/order/CreateOrderInput"
import type { OrderResponse } from "../../dto/order/OrderResponse"
import type { IOrderRepository } from "../../../domain/repositories/IOrderRepository"
import type { IProductRepository } from "../../../domain/repositories/IProductRepository"
import type { ITransactionRunner } from "../../../domain/repositories/ITransactionRunner"
import type { IPaymentRepository } from "../../../domain/repositories/IPaymentRepository"
import type { IAuthService } from "../../../domain/services/IAuthService"
import { OrderRepository } from "../../../infrastructure/database/repositories/OrderRepository"
import { ProductRepository } from "../../../infrastructure/database/repositories/ProductRepository"
import { PaymentRepository } from "../../../infrastructure/database/repositories/PaymentRepository"

export class CreateOrderUseCase {
  constructor(
    private transactionRunner: ITransactionRunner,
    private orderRepository: IOrderRepository,
    private productRepository: IProductRepository,
    private paymentRepository: IPaymentRepository,
    private jwtService: IAuthService,
  ) {}

  async execute(input: CreateOrderInput, authToken: string): Promise<OrderResponse> {
    const tokenDecoded = this.jwtService.verifyToken(authToken)

    return this.transactionRunner.run<OrderResponse>(async (tx) => {
      // Cria novas instâncias dos repositórios usando a transação
      const txOrderRepository = new OrderRepository(tx)
      const txProductRepository = new ProductRepository(tx)
      const txPaymentRepository = new PaymentRepository(tx)

      const { order, items } = await this.createOrderAndItems(input, txOrderRepository)

      await this.processStockMovements(items, tokenDecoded?.sub, txProductRepository)

      if (!order.id) {
        throw new Error("Order ID is required for processing payments")
      }

      await this.processPayments(order.id, input.payments, txPaymentRepository)

      return {
        id: order.id,
        clientId: order.clientId,
        total: order.total,
        items,
      }
    })
  }

  private async createOrderAndItems(input: CreateOrderInput, orderRepository: IOrderRepository) {
    const order = await orderRepository.create({
      clientId: input.clientId,
      total: input.total,
    })

    if (!order?.id) {
      throw new Error("Order not created")
    }

    const items = await orderRepository.createItems(order.id, input.items)
    return { order, items }
  }

  private async processStockMovements(
    items: { productId: number; quantity: number }[],
    userId?: number,
    productRepository?: IProductRepository,
  ): Promise<void> {
    if (items.length === 0) return

    const formattedItems = items.map((item) => ({
      sku: item.productId,
      quantity: item.quantity,
    }))

    await productRepository!.decrementMultipleStocks(formattedItems)

    const productIds = items.map((item) => item.productId)
    const stocks = await productRepository!.findByProductId(productIds)

    const stockMap = new Map<number, number>()
    stocks.forEach((stock) => {
      if (stock.productId && stock.id) {
        stockMap.set(stock.productId, stock.id)
      }
    })

    const movimentFormated = items.map((item) => {
      const stockId = stockMap.get(item.productId)
      if (stockId === undefined) {
        throw new Error(`Stock ID not found for product ID ${item.productId}`)
      }
      return {
        sku: item.productId,
        quantity: item.quantity,
        type: "OUT",
        stockId,
        userId: userId,
      }
    })

    await productRepository!.updateManyStockMovements(movimentFormated)
  }

  private async processPayments(
    orderId: number,
    payments: any[],
    paymentRepository: IPaymentRepository,
  ): Promise<void> {
    const enrichedPayments = payments.map((payment) => ({
      ...payment,
      orderId,
      statusId: "pending",
    }))

    await paymentRepository.createMany(orderId, enrichedPayments)
  }
}
