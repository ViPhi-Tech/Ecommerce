import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

// ===== INPUT DTOs (Para Use Cases) =====
export interface CreateDeliveryInput {
  name: string;
  description?: string | null;
  deliveryDate: string; // ISO string
  driverName?: string | null;
  vehiclePlate?: string | null;
  orderIds?: number[];
}

export interface UpdateDeliveryInput {
  name?: string;
  description?: string | null;
  deliveryDate?: string; // ISO string
  driverName?: string | null;
  vehiclePlate?: string | null;
  orderIds?: number[];
}

// ===== VALIDATION SCHEMAS (Para HTTP) =====
export const createDeliverySchema = z.object({
  name: z.string().min(1, { message: "Nome da entrega é obrigatório" }),
  description: z.string().optional().nullable(),
  deliveryDate: z.string().min(1, { message: "Data de entrega é obrigatória" }).refine((val) => {
    const date = new Date(val);
    return !isNaN(date.getTime());
  }, { message: "Data de entrega inválida. Use o formato ISO 8601 (ex: 2024-01-15T10:30:00Z) ou dd/mm/yyyy" }),
  driverName: z.string().optional().nullable(),
  vehiclePlate: z.string().optional().nullable(),
  orderIds: z.array(z.number().min(1)).optional(),
});

export const updateDeliverySchema = z.object({
  name: z.string().min(1, { message: "Nome da entrega é obrigatório" }).optional(),
  description: z.string().optional().nullable(),
  deliveryDate: z.string().refine((val) => {
    if (!val) return true; // Opcional
    const date = new Date(val);
    return !isNaN(date.getTime());
  }, { message: "Data de entrega inválida. Use o formato ISO 8601 (ex: 2024-01-15T10:30:00Z) ou dd/mm/yyyy" }).optional(),
  driverName: z.string().optional().nullable(),
  vehiclePlate: z.string().optional().nullable(),
  orderIds: z.array(z.number().min(1)).optional(),
});

export const deliveryUuidSchema = z.object({
  uuid: z.string().uuid({ message: "UUID inválido" }),
});

// ===== JSON SCHEMAS (Para Swagger) =====
export const createDeliveryJsonSchema = zodToJsonSchema(createDeliverySchema);
export const updateDeliveryJsonSchema = zodToJsonSchema(updateDeliverySchema);
export const deliveryUuidJsonSchema = zodToJsonSchema(deliveryUuidSchema);

// ===== TYPES (Para TypeScript) =====
export type CreateDeliveryDTO = z.infer<typeof createDeliverySchema>;
export type UpdateDeliveryDTO = z.infer<typeof updateDeliverySchema>;
export type DeliveryUuidDTO = z.infer<typeof deliveryUuidSchema>;

// ===== RESPONSE DTOs =====
export interface DeliveryResponse {
  id: number;
  uuid: string;
  name: string;
  description?: string | null;
  deliveryDate: Date;
  driverName?: string | null;
  vehiclePlate?: string | null;
  status?: string;
  createdAt: Date;
  updatedAt: Date;
  orders?: {
    id: number;
    total: number;
    status?: string | null;
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

