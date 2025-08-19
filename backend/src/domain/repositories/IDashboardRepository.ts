import { DashboardMetrics, DashboardChart, RecentActivity } from '../entities/Dashboard';

export interface IDashboardRepository {
  getMetrics(): Promise<DashboardMetrics>;
  getCharts(): Promise<DashboardChart[]>;
  getRecentActivities(): Promise<RecentActivity[]>;
}