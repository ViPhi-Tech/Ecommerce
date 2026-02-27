import { IOrderRepository } from '../../../domain/repositories/IOrderRepository';
import { IProductRepository } from '../../../domain/repositories/IProductRepository';
import { ChartDataResponse } from '../../dto/dashboard/ChatDataResponse';

export class GetDashboardChartsUseCase {
  constructor(
    private productRepository: IProductRepository,
    private orderRepository: IOrderRepository,
  ) {}
  
  async execute(startDate: string, endDate: string): Promise<ChartDataResponse> {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const currentMonth = new Date().getMonth() + 1;
    const startMonth = currentMonth - 12;

    const [salesByMonth, topProducts, orderStatus, salesByCategory] = await Promise.all([
      this.orderRepository.aggregateSalesByMonth(startMonth, currentMonth),
      this.productRepository.getTopProductsByDateRange(start, end),
      this.orderRepository.aggregateSalesByStatusByDateRange(start, end),
      this.orderRepository.aggregateSalesByCategoryByDateRange(start, end),
    ]);

    return { salesByMonth, topProducts, orderStatus, salesByCategory };
  }
}