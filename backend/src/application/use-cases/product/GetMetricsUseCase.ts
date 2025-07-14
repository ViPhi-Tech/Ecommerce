import { IProductRepository } from "../../../domain/repositories/IProductRepository";
import { MetricDTO, MetricResponse } from "../../dto/product/MetricDTO";
import { parseISO, isValid } from "date-fns";

export class GetMetricsUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(data: MetricDTO): Promise<MetricResponse> {
    const parsedDate = parseISO(data.date);

    if (!isValid(parsedDate)) {
      throw new Error("Data inválida. Use o formato YYYY-MM-DD.");
    }

    const metricInput = {
      date: parsedDate,
      type: data.type,
    };

    const total = await this.productRepository.getMetrics(metricInput);
    return total;
  }
}