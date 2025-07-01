import { Brand } from "../../../domain/entities/Brand";
import { IBrandRepository } from "../../../domain/repositories/IBrandRepository";

export class FindAllBrandUseCase {
  constructor(
    private brandRepository: IBrandRepository
  ) {

  }
  async execute(): Promise<Brand[]> {
    return await this.brandRepository.findAll();
  }
}