import type { CreateDeliveryInput } from "../../dto/delivery/DeliveryDTOs";
import type { DeliveryResponse } from "../../dto/delivery/DeliveryResponse";
import type { IDeliveryRepository } from "../../../domain/repositories/IDeliveryRepository";
import type { IOrderRepository } from "../../../domain/repositories/IOrderRepository";
import type { ITransactionRunner } from "../../../domain/repositories/ITransactionRunner";
import type { ITransactionClient } from "../../../domain/repositories/ITransactionClient";
import { parseDate } from "../../../shared/utils/dateUtils";

type DeliveryRepositoryFactory = (tx: ITransactionClient) => IDeliveryRepository;
type OrderRepositoryFactory = (tx: ITransactionClient) => IOrderRepository;

export class CreateDeliveryUseCase {
  constructor(
    private transactionRunner: ITransactionRunner,
    private deliveryRepositoryFactory: DeliveryRepositoryFactory,
    private orderRepositoryFactory: OrderRepositoryFactory
  ) {}

  async execute(input: CreateDeliveryInput): Promise<DeliveryResponse> {
    return this.transactionRunner.run<DeliveryResponse>(async (tx) => {
      const deliveryRepository = this.deliveryRepositoryFactory(tx);
      const orderRepository = this.orderRepositoryFactory(tx);

      // Validar e parsear a data
      const parsedDate = parseDate(input.deliveryDate);
      if (isNaN(parsedDate.getTime())) {
        throw new Error(`Data de entrega inválida: ${input.deliveryDate}`);
      }

      // Validar se os pedidos existem
      if (input.orderIds && input.orderIds.length > 0) {
        await this.validateOrders(input.orderIds, orderRepository);
      }

      // Criar a entrega
      const delivery = await deliveryRepository.create({
        name: input.name,
        description: input.description,
        deliveryDate: parsedDate,
        driverName: input.driverName,
        vehiclePlate: input.vehiclePlate,
        status: 'PENDING',
      });

      if (!delivery?.id) {
        throw new Error("Falha ao criar entrega.");
      }

      // Atribuir pedidos à entrega se fornecidos
      if (input.orderIds && input.orderIds.length > 0 && delivery.uuid) {
        await deliveryRepository.assignOrdersToDelivery(delivery.uuid, input.orderIds);
      }

      // Buscar a entrega completa com pedidos
      const deliveryWithOrders = await deliveryRepository.findByUuid(delivery.uuid!);

      if (!deliveryWithOrders) {
        throw new Error("Falha ao buscar entrega criada.");
      }

      return this.mapDeliveryToResponse(deliveryWithOrders);
    });
  }

  private async validateOrders(
    orderIds: number[],
    orderRepository: IOrderRepository
  ): Promise<void> {
    // Usar método otimizado que faz uma única query em vez de loop
    const foundIds = await orderRepository.validateIds(orderIds);
    
    // Verificar se todos os IDs foram encontrados
    const missingIds = orderIds.filter(id => !foundIds.includes(id));
    if (missingIds.length > 0) {
      throw new Error(`Pedidos com IDs ${missingIds.join(', ')} não encontrados.`);
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
          address: order.client.address ? {
            id: order.client.address.id,
            street: order.client.address.street,
            number: order.client.address.number,
            city: order.client.address.city,
            state: order.client.address.state,
            zipCode: order.client.address.zipCode,
            complement: order.client.address.complement,
          } : null,
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

