import { DashboardMetrics } from '../../../domain/entities/Dashboard';
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
  
  async execute(): Promise<DashboardMetricsResponse> {
    const month = new Date().getMonth() + 1
    const totalOrders = await this.orderRepository.countByMonth(month, month)
    const totalProductsWithStock = await this.productRepository.countByMonth(month, month)
    const totalSales = await this.orderRepository.countSalesByMonth(month, month)
    const totalClients = await this.clientRepository.countByMonth(month, month)
    return {totalOrders: totalOrders, totalProductsWithStock: totalProductsWithStock, totalSales: totalSales, activeClients: totalClients}
  }
} 