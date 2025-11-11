import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

// ===== INPUT DTOs =====
export interface GetDeliveryDashboardInput {
  startDate?: string;
  endDate?: string;
}

// ===== VALIDATION SCHEMAS =====
export const getDeliveryDashboardSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

// ===== JSON SCHEMAS =====
export const getDeliveryDashboardJsonSchema = zodToJsonSchema(getDeliveryDashboardSchema);

// ===== TYPES =====
export type GetDeliveryDashboardDTO = z.infer<typeof getDeliveryDashboardSchema>;

// ===== RESPONSE DTOs =====
export interface DeliveryMetricsResponse {
  totalDeliveries: number;
  pendingDeliveries: number;
  deliveredDeliveries: number;
  totalOrders: number;
  totalValue: number;
  averageOrdersPerDelivery: number;
  deliveriesByStatus: Array<{
    status: string;
    count: number;
  }>;
  topDeliveriesByValue: Array<{
    uuid: string;
    name: string;
    totalValue: number;
    ordersCount: number;
  }>;
}

