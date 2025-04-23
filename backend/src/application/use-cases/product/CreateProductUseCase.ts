// import { CreateProductInput } from "../../dto/product/CreateProductInput";
import { Product } from "../../../domain/entities/Product";
import { IProductRepository } from "../../../domain/repositories/IProductRepository";

export class CreateProductUseCase {
  constructor(
      private productRepository: IProductRepository  
  ) {

  }
  async execute(input: any): Promise<Product> {

    return await this.productRepository.create({name:input.name, ean:input.ean, price:input.price, sku:input.sku, companyId: input.companyId ?? null});
  }
}