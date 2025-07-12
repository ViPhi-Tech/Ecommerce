import { UpdateStockInput } from "../../dto/product/UpdateStockInput";
import { Stock } from "../../../domain/entities/Product";
import { IProductRepository } from "../../../domain/repositories/IProductRepository";

export class UpdateStockUseCase {
    constructor(
        private productRepository: IProductRepository
    ) {

    }
    async execute(input: UpdateStockInput): Promise<Stock> {

        const updatedStock = await this.productRepository.updateStock(
            input.productId,
            input.quantity,
            input.companyId
        );

        // Determina o tipo baseado na quantidade ou usa o tipo fornecido
        const movementType = input.quantity > 0 ? 'IN' : 'OUT';

        await this.productRepository.upsertStockMovement({
            stockId: updatedStock?.id ?? 0,
            quantity: Math.abs(input.quantity),
            type: movementType,
            userId: input.user
        });

        return updatedStock;

    }
}