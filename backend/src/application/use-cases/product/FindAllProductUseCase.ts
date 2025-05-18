import { ProductResponse } from "../../dto/product/ProductResponse";
import { IProductRepository } from "../../../domain/repositories/IProductRepository";

export class FindAllProductUseCase {
    constructor(
        private productRepository: IProductRepository
    ) {}

    async execute(): Promise<ProductResponse[] | null> {
        const products = await this.productRepository.findAll();
        if (!products) return null;

        return products.map((p) => ({
            id: p.id,
            name: p.name,
            description: p.description,
            sku: p.sku,
            price: p.price,
            quantity: p.quantity,
            ean: p.ean,
            companyId: p.companyId,
            stock: p.stock
                ? {
                    id: p.stock.id,
                    productId: p.stock.productId,
                    quantity: p.stock.quantity,
                    createdAt: p.stock.createdAt,
                    updatedAt: p.stock.updatedAt
                }
                : null
        }));
    }
}