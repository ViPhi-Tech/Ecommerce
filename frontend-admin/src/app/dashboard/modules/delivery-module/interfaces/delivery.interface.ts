import { BaseModuleState } from 'app/shared/store/base.state';

export interface DeliveryModuleState extends BaseModuleState {
  deliveryList: Delivery[];
  deliveryDetails: Delivery;
}

export interface Delivery {
  id: string | number;
  uuid?: string;
  name: string;
  description?: string;
  status: DeliveryStatus;
  deliveryDate: Date | string;
  driverName?: string;
  vehiclePlate?: string;
  orderIds: any[];
  orders?: DeliveryOrder[];
  route?: DeliveryRoute;
  createdAt: Date | string;
  updatedAt: Date | string;
  isActive?: boolean;
}

export interface DeliveryOrder {
  id: number;
  clientId?: number | null;
  total: number;
  status?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  client?: DeliveryClient | null;
  items?: DeliveryOrderItem[];
}

export interface DeliveryClient {
  id: number;
  fullName: string | null;
  document: string | null;
  address?: DeliveryAddress | null;
}

export interface DeliveryAddress {
  id: number;
  street: string;
  number: string;
  city: string;
  state: string;
  zipCode: string;
  complement: string | null;
}

export interface DeliveryOrderItem {
  id: number;
  productId: number;
  quantity: number;
  price: number;
  product?: DeliveryProduct;
}

export interface DeliveryProduct {
  id: number;
  name: string;
  sku: string;
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
  PENDING = 'PENDING',
  SCHEDULED = 'SCHEDULED',
  IN_ROUTE = 'IN_ROUTE',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}
