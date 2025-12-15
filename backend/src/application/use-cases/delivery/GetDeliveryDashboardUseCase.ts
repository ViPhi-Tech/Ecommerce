import { IDeliveryRepository } from "../../../domain/repositories/IDeliveryRepository";
import { DeliveryMetricsResponse } from "../../dto/delivery/DeliveryDashboardDTOs";
import { parseDate } from "../../../shared/utils/dateUtils";

export class GetDeliveryDashboardUseCase {
  constructor(private deliveryRepository: IDeliveryRepository) {}

  async execute(startDate?: string, endDate?: string): Promise<DeliveryMetricsResponse> {
    let parsedStartDate: Date | undefined;
    let parsedEndDate: Date | undefined;

    if (startDate) {
      parsedStartDate = parseDate(startDate);
      if (isNaN(parsedStartDate.getTime())) {
        throw new Error(`Data inicial inválida: ${startDate}`);
      }
    }

    if (endDate) {
      parsedEndDate = parseDate(endDate);
      if (isNaN(parsedEndDate.getTime())) {
        throw new Error(`Data final inválida: ${endDate}`);
      }
    }

    const metrics = await this.deliveryRepository.getDeliveryMetrics(
      parsedStartDate,
      parsedEndDate
    );

    return {
      totalDeliveries: metrics.totalDeliveries,
      pendingDeliveries: metrics.pendingDeliveries,
      deliveredDeliveries: metrics.deliveredDeliveries,
      totalOrders: metrics.totalOrders,
      totalValue: metrics.totalValue,
      averageOrdersPerDelivery: metrics.averageOrdersPerDelivery,
      deliveriesByStatus: metrics.deliveriesByStatus,
      topDeliveriesByValue: metrics.topDeliveriesByValue,
    };
  }
}

