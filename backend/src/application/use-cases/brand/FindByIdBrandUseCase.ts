import { Brand } from "../../../domain/entities/Brand";
import { IBrandRepository } from "../../../domain/repositories/IBrandRepository";

export class FindByIdBrandUseCase {
  constructor(
    private brandRepository: IBrandRepository
  ) {

  }
  async execute(id: number): Promise<Brand | null> {
    return await this.brandRepository.findById(id);
  }
}