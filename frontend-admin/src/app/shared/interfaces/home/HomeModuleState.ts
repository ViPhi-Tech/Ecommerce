import { BaseModuleState } from 'app/shared/store/base.state';

export interface Indicator {
  title: string;
  value: string;
  percentage: string;
  trend: 'up' | 'down';
  icon: string;
}

export interface DashboardMetrics {
  totalOrders: number,
  totalProductsWithStock: number,
  totalSales: number,
  activeClients: number
}

export interface ChartsMetrics {
  salesByMonth: any | unknown;
  topProducts: any | unknown;
  salesByCategory: any | unknown;
  orderStatus: any | unknown;
}

export interface HomeModuleState extends BaseModuleState {
  indicators: DashboardMetrics;
  chartsMetrics: ChartsMetrics;
  selectedPeriod: 'today' | 'week' | 'month' | 'year';
}
