import { ProductIdDTO } from "../../dto/product/ProductDTOs";
import { IProductRepository} from "../../../domain/repositories/IProductRepository";
import { stockMovement } from "../../dto/product/StockMovimentResponse";
export class GetMovimentByProductUseCase {
    constructor(
        private productRepository: IProductRepository
    ) {}

    async execute(productId: number[]): Promise<stockMovement[]> {
        const stocks = await this.productRepository.findStockByProductId(productId)
        const stockIds = stocks.map(stock => stock.id);
        const validStockIds = stockIds.filter((id): id is number => id !== undefined);
        return await this.productRepository.findMovimentByProductId(validStockIds);
    }
}