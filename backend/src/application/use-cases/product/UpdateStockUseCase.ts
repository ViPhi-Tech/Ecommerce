import { UpdateStockInput } from "../../dto/product/UpdateStockInput";
import { Stock } from "../../../domain/entities/Product";
import { IProductRepository } from "../../../domain/repositories/IProductRepository";

export class UpdateStockUseCase {
    constructor(
        private productRepository: IProductRepository
    ) {

    }
    async execute(input: UpdateStockInput): Promise<Stock> {

        return await this.productRepository.updateStock(
            input.productId,
            input.quantity,
            input.companyId
        );

    }
}