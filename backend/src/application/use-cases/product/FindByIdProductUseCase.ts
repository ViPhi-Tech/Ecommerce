import { ProductID } from "../../../infrastructure/http/dto/Product.dto";
import { ProductResponse } from "../../dto/product/ProductResponse";
import { IProductRepository} from "../../../domain/repositories/IProductRepository";

export class FindByIdProductUseCase {
    constructor(
        private productRepository: IProductRepository
    ) {}

    async execute(data: ProductID): Promise<ProductResponse | null> {
        return await this.productRepository.findById(data.id);
    }
}