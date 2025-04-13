import { ProductCreateDTO } from "../../../shared/dtos/Product.dto";
import { Product } from "../../entities/Product";
import { IProductRepository } from "../../repositories/IProductRepository";

export class CreateProductUseCase {
  constructor(
      private productRepository: IProductRepository
  ) {

  }
  async execute(data: ProductCreateDTO): Promise<Product> {
    return await this.productRepository.create(data);
  }
}