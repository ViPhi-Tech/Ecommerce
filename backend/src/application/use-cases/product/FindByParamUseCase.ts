import { ProductID } from "../../../infrastructure/http/dto/Product.dto";
import { ProductResponse } from "../../dto/product/ProductResponse";
import { IProductRepository} from "../../../domain/repositories/IProductRepository";

export class FindByParamProductUseCase {
    constructor(
        private productRepository: IProductRepository
    ) {}

    async execute(param: string): Promise<ProductResponse[]> {
        return await this.productRepository.findByAnyParam(param);
    }
}