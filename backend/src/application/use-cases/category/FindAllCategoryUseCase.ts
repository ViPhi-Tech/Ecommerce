import { CreateCategoryInput } from "../../dto/product/CreateCategoryInput";
import { ICategoryRepository } from "../../../domain/repositories/ICategoryRepository";

export class FindAllCategoryUseCase {
    constructor(
        private categoryRepository: ICategoryRepository
    ) {}

    async execute(): Promise<CreateCategoryInput[] | null> {
        const categories = await this.categoryRepository.findAll();
        if (!categories) return null;

        return categories.map((category) => ({
            id: category.id,
            name: category.name
        }));
    }
}
