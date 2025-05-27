import { CreateCategoryInput } from "../../dto/product/CreateCategoryInput";
import { ICategoryRepository } from "../../../domain/repositories/ICategoryRepository";

export class CreateCategoryUseCase {
  constructor(
    private categoryRepository: ICategoryRepository
  ) {

  }
  async execute(input: CreateCategoryInput): Promise<CreateCategoryInput> {
    return await this.categoryRepository.create({
      name: input.name,
      isActive: input.isActive ?? true
    });
  }
}
