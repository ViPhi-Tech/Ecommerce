import { Product, Stock, stockMovement } from "../entities/Product";

export interface IProductRepository {
    create(data: Product): Promise<Product>;
    findById(id: number): Promise<Product | null>;
    findAll(): Promise<Product[]>;
    update(id: number, data: Partial<Product>): Promise<Product>;
    delete(id: number): Promise<void>;
    updateStock(sku: number, quantity: number, companyId?: number): Promise<Stock>;
    decrementMultipleStocks(items: { sku: number; quantity: number }[]): Promise<Stock[]>;
    incrementMultipleStocks(item: {sku: number; quantity: number}[]): Promise<Stock[]>;
    upsertStockMovement(data: stockMovement): Promise<void>;
    updateManyStockMovements(data: stockMovement[]): Promise<void>;
    findByProductId(productsId: number[]): Promise<Stock[]>
    //findMovimentByProductId(productId: string): Promise<stockMovement[]>
}