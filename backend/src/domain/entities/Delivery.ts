import { Order } from './Order';

export interface Delivery {
  id?: number;
  uuid?: string;
  name: string;
  description?: string | null;
  deliveryDate: Date;
  driverName?: string | null;
  vehiclePlate?: string | null;
  status?: string;
  orders?: Order[];
  createdAt?: Date;
  updatedAt?: Date;
}

