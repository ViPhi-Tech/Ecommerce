import { IProductRepository } from "../../../domain/repositories/IProductRepository";
import { MetricResponse } from "../../dto/product/MetricDTO";

export class GetMetricsUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(): Promise<MetricResponse> {

    const now = new Date();

    const startDate = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);


    const stockTotal = await this.productRepository.countStock(startDate, endDate);
    const movimentIn = await this.productRepository.countMoviment(startDate, endDate, 'IN');
    const movimentOut = await this.productRepository.countMoviment(startDate,  endDate, 'OUT');
    return {
      stockTotal,
      movimentIn,
      movimentOut
    };
  }
}