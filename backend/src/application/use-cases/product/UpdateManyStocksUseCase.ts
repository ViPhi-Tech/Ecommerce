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
        
        // Buscar produtos para copiar ICMS e ST se existirem
        const productIds = input.map(item => item.productId);
        const products = await Promise.all(
            productIds.map(id => this.productRepository.findById(id))
        );
        const productMap = new Map<number, { icms?: number | null; st?: number | null }>();
        products.forEach((product, index) => {
            if (product && product.id) {
                productMap.set(productIds[index], {
                    icms: product.icms ?? null,
                    st: product.st ?? null
                });
            }
        });
        
        const itemsUpdated = updatedStock.map((item) => {
        const inputItem = newItems.find((input) => input.sku === item.productId);
        const originalInputItem = input.find((inp) => inp.productId === item.productId);
        const productData = productMap.get(item.productId!);
        return {
            stockId: item.id as number,
            userId,
            quantity: inputItem?.quantity ?? 0,
            type: type,
            unitCost: originalInputItem?.unitCost ?? null, // Usar unitCost do input se fornecido
            invoiceNumber: originalInputItem?.invoiceNumber ?? null, // Usar invoiceNumber do input se fornecido
            icms: originalInputItem?.icms ?? productData?.icms ?? null, // Usar ICMS do input, senão do produto
            st: originalInputItem?.st ?? productData?.st ?? null // Usar ST do input, senão do produto
        };
        });
        const moviment = await this.productRepository.updateManyStockMovements(itemsUpdated)

        return updatedStock;

    }
}