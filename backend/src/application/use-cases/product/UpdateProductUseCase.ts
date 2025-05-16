import { ProductResponse } from "../../dto/product/ProductResponse";
import { CreateProductInput } from "../../dto/product/CreateProductInput";
import { IProductRepository } from "../../../domain/repositories/IProductRepository";

export class UpdateProductUseCase {
    constructor(
        private productRepository: IProductRepository  
    ) {
  
    }
    async execute(input: CreateProductInput): Promise<ProductResponse> {

      if(input.id == undefined) {
        throw new Error("Product id is required");
      }
      return await this.productRepository.update(input.id, input);
    }
  }