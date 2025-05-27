import { Category } from "../../../domain/entities/Category";
import { ICategoryRepository } from "../../../domain/repositories/ICategoryRepository";

export class FindByIdCategoryUseCase {
  constructor(
    private categoryRepository: ICategoryRepository
  ) {}

  async execute(id: number): Promise<Category | null> {
    return await this.categoryRepository.findById(id);
  }
}
