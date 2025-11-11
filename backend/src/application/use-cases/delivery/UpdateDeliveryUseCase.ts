import type { UpdateDeliveryInput } from "../../dto/delivery/DeliveryDTOs";
import type { DeliveryResponse } from "../../dto/delivery/DeliveryResponse";
import type { IDeliveryRepository } from "../../../domain/repositories/IDeliveryRepository";
import type { IOrderRepository } from "../../../domain/repositories/IOrderRepository";
import type { ITransactionRunner } from "../../../domain/repositories/ITransactionRunner";
import type { ITransactionClient } from "../../../domain/repositories/ITransactionClient";
import { parseDate } from "../../../shared/utils/dateUtils";

type DeliveryRepositoryFactory = (tx: ITransactionClient) => IDeliveryRepository;
type OrderRepositoryFactory = (tx: ITransactionClient) => IOrderRepository;

export class UpdateDeliveryUseCase {
  constructor(
    private transactionRunner: ITransactionRunner,
    private deliveryRepositoryFactory: DeliveryRepositoryFactory,
    private orderRepositoryFactory: OrderRepositoryFactory
  ) {}

  async execute(deliveryUuid: string, input: UpdateDeliveryInput): Promise<DeliveryResponse> {
    return this.transactionRunner.run<DeliveryResponse>(async (tx) => {
      const deliveryRepository = this.deliveryRepositoryFactory(tx);
      const orderRepository = this.orderRepositoryFactory(tx);

      // Verificar se a entrega existe
      const existingDelivery = await deliveryRepository.findByUuid(deliveryUuid);
      if (!existingDelivery) {
        throw new Error(`Entrega com UUID ${deliveryUuid} não encontrada.`);
      }

      // Validar pedidos se fornecidos
      if (input.orderIds && input.orderIds.length > 0) {
        await this.validateOrders(input.orderIds, orderRepository);
      }

      // Preparar dados para atualização
      const updateData: Partial<{
        name: string;
        description: string | null;
        deliveryDate: Date;
        driverName: string | null;
        vehiclePlate: string | null;
      }> = {};

      if (input.name !== undefined) updateData.name = input.name;
      if (input.description !== undefined) updateData.description = input.description;
      if (input.deliveryDate !== undefined) {
        const parsedDate = parseDate(input.deliveryDate);
        if (isNaN(parsedDate.getTime())) {
          throw new Error(`Data de entrega inválida: ${input.deliveryDate}`);
        }
        updateData.deliveryDate = parsedDate;
      }
      if (input.driverName !== undefined) updateData.driverName = input.driverName;
      if (input.vehiclePlate !== undefined) updateData.vehiclePlate = input.vehiclePlate;

      // Atualizar a entrega
      const updatedDelivery = await deliveryRepository.updateByUuid(deliveryUuid, updateData);

      // Atualizar pedidos se fornecidos
      if (input.orderIds && input.orderIds.length > 0) {
        await deliveryRepository.assignOrdersToDelivery(deliveryUuid, input.orderIds);
      }

      // Buscar a entrega completa atualizada
      const deliveryWithOrders = await deliveryRepository.findByUuid(deliveryUuid);

      if (!deliveryWithOrders) {
        throw new Error("Falha ao buscar entrega atualizada.");
      }

      return this.mapDeliveryToResponse(deliveryWithOrders);
    });
  }

  private async validateOrders(
    orderIds: number[],
    orderRepository: IOrderRepository
  ): Promise<void> {
    for (const orderId of orderIds) {
      const order = await orderRepository.findById(orderId);
      if (!order) {
        throw new Error(`Pedido com ID ${orderId} não encontrado.`);
      }
    }
  }

  private mapDeliveryToResponse(delivery: any): DeliveryResponse {
    return {
      id: delivery.id!,
      uuid: delivery.uuid!,
      name: delivery.name,
      description: delivery.description,
      deliveryDate: delivery.deliveryDate,
      driverName: delivery.driverName,
      vehiclePlate: delivery.vehiclePlate,
      status: delivery.status,
      createdAt: delivery.createdAt,
      updatedAt: delivery.updatedAt,
      orders: delivery.orders?.map((order: any) => ({
        id: order.id,
        clientId: order.clientId,
        total: order.total,
        status: order.status,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        client: order.client ? {
          id: order.client.id,
          fullName: order.client.fullName,
          document: order.client.document,
        } : null,
        items: order.items?.map((item: any) => ({
          id: item.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          product: item.product ? {
            id: item.product.id,
            name: item.product.name,
            sku: item.product.sku,
          } : undefined,
        })),
      })),
    };
  }
}

