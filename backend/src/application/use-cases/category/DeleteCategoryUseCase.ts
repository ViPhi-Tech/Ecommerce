import { ICategoryRepository } from "../../../domain/repositories/ICategoryRepository";

export class DeleteCategoryUseCase {
  constructor(
    private categoryRepository: ICategoryRepository
  ) {
  }

  async execute(id: number): Promise<void> {
    return await this.categoryRepository.delete(id);
  }
}
