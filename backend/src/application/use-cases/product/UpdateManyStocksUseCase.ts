import { UpdateStockInput } from "../../dto/product/UpdateStockInput";
import { Stock } from "../../../domain/entities/Product";
import { IProductRepository } from "../../../domain/repositories/IProductRepository";
import { JwtAuthService } from "../../../infrastructure/services/AuthService";

export class UpdateManyStocksUseCase {
    constructor(
        private productRepository: IProductRepository,
        private jwtService: JwtAuthService
    ) {

    }
    async execute(input: UpdateStockInput[], type: string, token: string): Promise<Stock[]> {
        const userId = this.jwtService.getLoggedInUserId(token)
        const newItems = input.map((item) => ({
            sku: item.productId,
            quantity: item.quantity
        }));

        let updatedStock: Stock[] = [];
        if (type === 'IN'){
            updatedStock = await this.productRepository.incrementMultipleStocks(newItems);
        } else if (type === 'OUT') {
            updatedStock = await this.productRepository.decrementMultipleStocks(newItems);
        }
        
        const itemsUpdated = updatedStock.map((item) => {
        const inputItem = newItems.find((input) => input.sku === item.productId);
        return {
            stockId: item.id as number,
            userId,
            quantity: inputItem?.quantity ?? 0,
            type: type
        };
        });
        const moviment = await this.productRepository.updateManyStockMovements(itemsUpdated)

        return updatedStock;

    }
}