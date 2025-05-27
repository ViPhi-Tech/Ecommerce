import { CreateCategoryInput } from "../../dto/product/CreateCategoryInput";
import { ICategoryRepository } from "../../../domain/repositories/ICategoryRepository";

export class UpdateCategoryUseCase {
    constructor(
        private categoryRepository: ICategoryRepository  
    ) {
  
    }
    async execute(input: CreateCategoryInput): Promise<CreateCategoryInput> {

      if(input.id == undefined) {
        throw new Error("Category id is required");
      }
      return await this.categoryRepository.update(input.id, input);
    }
}
