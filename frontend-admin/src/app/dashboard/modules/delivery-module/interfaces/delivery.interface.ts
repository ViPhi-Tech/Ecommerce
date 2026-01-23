import { BaseModuleState } from 'app/shared/store/base.state';

export interface DeliveryModuleState extends BaseModuleState {
  deliveryList: Delivery[];
  deliveryDetails: Delivery;
}

export interface Delivery {
  id: string | number;
  name: string;
  description?: string;
  status: DeliveryStatus;
  deliveryDate: Date | string;
  driverName?: string;
  vehiclePlate?: string;
  orderIds: any[];
  route?: DeliveryRoute;
  createdAt: Date | string;
  updatedAt: Date | string;
  isActive?: boolean;
}

export interface DeliveryRoute {
  id?: string | number;
  deliveryId: string | number;
  waypoints: RouteWaypoint[];
  totalDistance?: number; // em km
  estimatedTime?: number; // em minutos
  optimizedOrder?: number[]; // ordem otimizada dos waypoints
}

export interface RouteWaypoint {
  orderId: string | number;
  address: string;
  latitude?: number;
  longitude?: number;
  sequence: number;
  estimatedArrival?: Date | string;
  completed?: boolean;
  completedAt?: Date | string;
}

export enum DeliveryStatus {
  PENDING = 'pending',
  SCHEDULED = 'scheduled',
  IN_ROUTE = 'in_route',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}
