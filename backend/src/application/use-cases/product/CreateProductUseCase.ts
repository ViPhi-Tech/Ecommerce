import { CreateProductInput } from "../../dto/product/CreateProductInput";
import { ProductResponse } from "../../dto/product/ProductResponse";
import { IProductRepository } from "../../../domain/repositories/IProductRepository";

export class CreateProductUseCase {
  constructor(
      private productRepository: IProductRepository  
  ) {

  }
  async execute(input: CreateProductInput): Promise<ProductResponse> {

    return await this.productRepository.create({name:input.name, ean:input.ean, price:input.price, sku:input.sku, companyId: input.companyId ?? null});
  }
}