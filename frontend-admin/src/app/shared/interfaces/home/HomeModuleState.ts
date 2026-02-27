import { BaseModuleState } from 'app/shared/store/base.state';

export interface Indicator {
  title: string;
  value: string;
  percentage: string;
  trend: 'up' | 'down';
  icon: string;
}

export interface DashboardMetrics {
  totalOrders: number;
  totalProductsWithStock: number;
  totalSales: number;
  activeClients: number;
}

export interface HomeModuleState extends BaseModuleState {
  indicators: DashboardMetrics;
  charts: DashboardCharts;
  date: {
    startDate: string;
    endDate: string;
  };
}
export interface DashboardCharts {
  salesByMonth: SalesByMonth[];
  topProducts: TopProduct[];
  orderStatus: OrderStatu[];
  salesByCategory: SalesByCategory[];
}

export interface SalesByMonth {
  year: number;
  month: string;
  total: number;
}

export interface TopProduct {
  name: string;
  total: number;
}

export interface OrderStatu {
  name: string;
  total: number;
}

export interface SalesByCategory {
  category_name: string;
  total_quantity: number;
}
