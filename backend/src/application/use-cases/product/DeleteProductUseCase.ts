import { IProductRepository } from "../../../domain/repositories/IProductRepository";
export class DeleteProductUseCase {
  constructor(
      private productRepository: IProductRepository
  ) {
  }
  async execute(id: number): Promise<void> {
    return await this.productRepository.delete(id);
  }
}