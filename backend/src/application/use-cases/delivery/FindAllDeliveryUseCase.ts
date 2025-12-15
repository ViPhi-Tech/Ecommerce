import { IDeliveryRepository } from "../../../domain/repositories/IDeliveryRepository";
import { DeliveryResponse } from "../../dto/delivery/DeliveryResponse";

export class FindAllDeliveryUseCase {
  constructor(private deliveryRepository: IDeliveryRepository) {}

  async execute(): Promise<DeliveryResponse[]> {
    const deliveries = await this.deliveryRepository.findAll();
    return deliveries.map((delivery) => this.mapDeliveryToResponse(delivery));
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

