import { DeliveryResponse } from "../../dto/delivery/DeliveryResponse";
import { IDeliveryRepository } from "../../../domain/repositories/IDeliveryRepository";

export class FindByUuidDeliveryUseCase {
  constructor(private deliveryRepository: IDeliveryRepository) {}

  async execute(uuid: string): Promise<DeliveryResponse> {
    const delivery = await this.deliveryRepository.findByUuid(uuid);
    if (!delivery) {
      throw new Error(`Entrega com UUID ${uuid} não encontrada`);
    }
    return this.mapDeliveryToResponse(delivery);
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

