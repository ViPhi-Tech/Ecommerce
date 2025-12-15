export interface DeliveryResponse {
  id: number;
  uuid: string;
  name: string;
  description?: string | null;
  deliveryDate: Date;
  driverName?: string | null;
  vehiclePlate?: string | null;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
  orders?: {
    id: number;
    clientId?: number | null;
    total: number;
    status?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
    client?: {
      id: number;
      fullName: string | null;
      document: string | null;
    } | null;
    items?: Array<{
      id: number;
      productId: number;
      quantity: number;
      price: number;
      product?: {
        id: number;
        name: string;
        sku: string;
      };
    }>;
  }[];
}

