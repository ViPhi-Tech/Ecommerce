import { ProductResponse } from "../../dto/product/ProductResponse";
import { IProductRepository } from "../../../domain/repositories/IProductRepository";
import { Product } from "../../../domain/entities/Product";

export class ValidateProductsUseCase {
    constructor(
        private productRepository: IProductRepository
    ) {}

    async execute(products: Product[]): Promise<{ skuExisting: string[], eanExisting: string[] } | null> {
      const existingProducts = await this.productRepository.validateProducts(products);

      return existingProducts
    }
}