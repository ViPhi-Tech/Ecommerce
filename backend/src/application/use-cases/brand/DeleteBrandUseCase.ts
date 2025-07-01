import { IBrandRepository } from "../../../domain/repositories/IBrandRepository";

export class DeleteBrandUseCase {
  constructor(
    private brandRepository: IBrandRepository
  ) {

  }
  async execute(id: number): Promise<void> {
    return await this.brandRepository.delete(id);
  }
}