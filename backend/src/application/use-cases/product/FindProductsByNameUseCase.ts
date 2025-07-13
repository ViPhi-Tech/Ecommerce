import { ProductID } from "../../../infrastructure/http/dto/Product.dto";
import { ProductResponse } from "../../dto/product/ProductResponse";
import { IProductRepository} from "../../../domain/repositories/IProductRepository";

export class FindByNameProductUseCase {
    constructor(
        private productRepository: IProductRepository
    ) {}

    async execute(data: string): Promise<ProductResponse[]> {
        return await this.productRepository.findByName(data);
    }
}