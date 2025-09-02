import { IClientRepository } from '../../../domain/repositories/IClientRepository';
import { IOrderRepository } from '../../../domain/repositories/IOrderRepository';
import { IProductRepository } from '../../../domain/repositories/IProductRepository';
import { ChartDataResponse } from '../../dto/dashboard/ChatDataResponse';

export class GetDashboardChartsUseCase {
  constructor(
    private productRepository: IProductRepository,
    private orderRepository: IOrderRepository,
    private clientRepository: IClientRepository
  ) {}
  
  async execute(): Promise<ChartDataResponse> {
    const currentMonth = new Date().getMonth() + 1
    const startMonth = currentMonth - 12
    const salesByMonth = await this.orderRepository.aggregateSalesByMonth(startMonth, currentMonth)
    const topProducts = await this.productRepository.getTopProductsByMonth(startMonth, currentMonth)
    const orderStatus = await this.orderRepository.aggregateSalesByStatus(startMonth, currentMonth)
    const salesByCategory = await this.orderRepository.aggregateSalesByCategory(startMonth, currentMonth)
    return {salesByMonth, topProducts, orderStatus, salesByCategory}
  }
}