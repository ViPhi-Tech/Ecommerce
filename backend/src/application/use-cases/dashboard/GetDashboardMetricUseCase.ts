import { IClientRepository } from '../../../domain/repositories/IClientRepository';
import { IOrderRepository } from '../../../domain/repositories/IOrderRepository';
import { IProductRepository } from '../../../domain/repositories/IProductRepository';
import { DashboardMetricsResponse } from '../../dto/dashboard/DashboardDTOs';

export class GetDashboardMetricUseCase {
  constructor(
    private productRepository: IProductRepository,
    private orderRepository: IOrderRepository,
    private clientRepository: IClientRepository
  ) {}

  async execute(startDate: string, endDate: string): Promise<DashboardMetricsResponse> {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const [totalOrders, totalSales, totalProductsWithStock, activeClients] = await Promise.all([
      this.orderRepository.countByDateRange(start, end),
      this.orderRepository.countSalesByDateRange(start, end),
      this.productRepository.countProductsWithStock(),
      this.clientRepository.countActive(),
    ]);

    return {
      totalOrders,
      totalSales,
      totalProductsWithStock,
      activeClients,
    };
  }
} 