import { ProductIdDTO } from "../../dto/product/ProductDTOs";
import { ProductResponse } from "../../dto/product/ProductResponse";
import { IProductRepository} from "../../../domain/repositories/IProductRepository";

export class FindByIdProductUseCase {
    constructor(
        private productRepository: IProductRepository
    ) {}

    async execute(data: ProductIdDTO): Promise<ProductResponse | null> {
        return await this.productRepository.findById(data.id);
    }
}