import { BrandUpdateDTO } from "../../dto/brand/Brand.dto";
import { IBrandRepository } from "../../../domain/repositories/IBrandRepository";

export class UpdateBrandUseCase {
  constructor(
    private brandRepository: IBrandRepository
  ) {

  }
  async execute(id: number, input: BrandUpdateDTO): Promise<BrandUpdateDTO> {
    return await this.brandRepository.update(id, input);
  }
}