import { Delivery } from '../entities/Delivery';

export interface DeliveryMetrics {
  totalDeliveries: number;
  pendingDeliveries: number;
  deliveredDeliveries: number;
  totalOrders: number;
  totalValue: number;
  averageOrdersPerDelivery: number;
  deliveriesByStatus: Array<{ status: string; count: number }>;
  topDeliveriesByValue: Array<{ uuid: string; name: string; totalValue: number; ordersCount: number }>;
}

export interface IDeliveryRepository {
  create(data: Delivery): Promise<Delivery>;
  findByUuid(uuid: string): Promise<Delivery | null>;
  findAll(): Promise<Delivery[]>;
  updateByUuid(uuid: string, data: Partial<Delivery>): Promise<Delivery>;
  deleteByUuid(uuid: string): Promise<void>;
  assignOrdersToDelivery(deliveryUuid: string, orderIds: number[]): Promise<void>;
  getDeliveryMetrics(startDate?: Date, endDate?: Date): Promise<DeliveryMetrics>;
}

