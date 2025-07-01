import { BrandCreateDTO } from "../../dto/brand/Brand.dto";
import { IBrandRepository } from "../../../domain/repositories/IBrandRepository";

export class CreateBrandUseCase {
  constructor(
    private brandRepository: IBrandRepository
  ) {

  }
  async execute(input: BrandCreateDTO): Promise<BrandCreateDTO> {
    return await this.brandRepository.create({
      name: input.name,
      isActive: input.isActive ?? true
    });
  }
}