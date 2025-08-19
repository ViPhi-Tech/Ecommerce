
export interface DashboardMetrics {
  totalSales: number;
  totalOrders: number;
  activeClients: number;
  totalProductsWithStock: number;
}

export interface DashboardChart {
  id: string;
  title: string;
  type: 'line' | 'bar' | 'pie' | 'area' | 'doughnut';
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor?: string | string[];
      borderColor?: string;
      borderWidth?: number;
    }[];
  };
  options?: {
    responsive?: boolean;
    maintainAspectRatio?: boolean;
    [key: string]: any;
  };
}

export interface RecentActivity {
  id: string;
  type: 'order' | 'product' | 'client' | 'payment' | 'stock';
  title: string;
  description: string;
  timestamp: Date;
  userId?: number;
  relatedId?: number;
  status?: 'success' | 'warning' | 'error' | 'info';
}
