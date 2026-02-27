import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

// ===== INPUT DTOs (Para Use Cases) =====
export interface GetDashboardMetricsInput {
  companyId: number;
  startDate?: string;
  endDate?: string;
}

// ===== VALIDATION SCHEMAS (Para HTTP) =====
const dateStringSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
  message: "Date must be in YYYY-MM-DD format",
});

export const dashboardDateRangeSchema = z.object({
  startDate: dateStringSchema,
  endDate: dateStringSchema,
});

export const getDashboardMetricsSchema = z.object({
  companyId: z.number().min(1, { message: "ID da empresa é obrigatório" }).optional(),
  startDate: dateStringSchema.optional(),
  endDate: dateStringSchema.optional(),
});

// ===== JSON SCHEMAS =====
export const dashboardDateRangeJsonSchema = {
  ...zodToJsonSchema(dashboardDateRangeSchema),
  required: ['startDate', 'endDate'] as const,
};
export const getDashboardMetricsJsonSchema = zodToJsonSchema(getDashboardMetricsSchema);

// ===== TYPES =====
export type DashboardDateRangeDTO = z.infer<typeof dashboardDateRangeSchema>;
export type GetDashboardMetricsDTO = z.infer<typeof getDashboardMetricsSchema>;

// ===== RESPONSE DTOs =====
export interface DashboardMetricsResponse {
  totalSales: number;
  totalOrders: number;
  activeClients: number;
  totalProductsWithStock: number;
}

export interface DashboardCardResponse {
  id: string;
  title: string;
  value: string | number;
  icon: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export interface DashboardChartResponse {
  id: string;
  title: string;
  type: 'line' | 'bar' | 'pie' | 'doughnut';
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor?: string | string[];
      borderColor?: string;
    }[];
  };
}

export interface RecentActivityResponse {
  id: number;
  type: 'order' | 'product' | 'client' | 'payment';
  description: string;
  timestamp: Date;
  metadata?: {
    orderId?: number;
    productId?: number;
    clientId?: number;
    amount?: number;
  };
}

export interface DashboardDataResponse {
  metrics: DashboardMetricsResponse;
  cards: DashboardCardResponse[];
  charts: DashboardChartResponse[];
  recentActivities: RecentActivityResponse[];
}