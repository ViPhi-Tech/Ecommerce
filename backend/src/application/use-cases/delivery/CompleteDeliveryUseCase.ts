import { DeliveryResponse } from "../../dto/delivery/DeliveryResponse";
import { IDeliveryRepository } from "../../../domain/repositories/IDeliveryRepository";

export class CompleteDeliveryUseCase {
  constructor(private deliveryRepository: IDeliveryRepository) {}

  async execute(uuid: string): Promise<DeliveryResponse> {
    // Verificar se a entrega existe
    const delivery = await this.deliveryRepository.findByUuid(uuid);
    
    if (!delivery) {
      throw new Error(`Entrega com UUID ${uuid} não encontrada`);
    }

    // Verificar se já está finalizada
    if (delivery.status === 'delivered') {
      throw new Error('Esta entrega já foi finalizada');
    }

    // Atualizar status para delivered
    const updatedDelivery = await this.deliveryRepository.updateByUuid(uuid, {
      status: 'delivered',
    });

    return {
      id: updatedDelivery.id!,
      uuid: updatedDelivery.uuid!,
      name: updatedDelivery.name,
      description: updatedDelivery.description,
      deliveryDate: updatedDelivery.deliveryDate,
      driverName: updatedDelivery.driverName,
      vehiclePlate: updatedDelivery.vehiclePlate,
      status: updatedDelivery.status,
      createdAt: updatedDelivery.createdAt,
      updatedAt: updatedDelivery.updatedAt,
      orders: updatedDelivery.orders?.map((order: any) => ({
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

