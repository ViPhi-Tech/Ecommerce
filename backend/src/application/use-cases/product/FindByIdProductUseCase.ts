import { ProductID } from "../../../infrastructure/http/dto/Product.dto";
import { Product } from "../../../domain/entities/Product";
import { IProductRepository} from "../../../domain/repositories/IProductRepository";

export class FindByIdProductUseCase {
    constructor(
        private productRepository: IProductRepository
    ) {}

    async execute(data: ProductID): Promise<Product | null> {
        return await this.productRepository.findById(data.id);
    }
}