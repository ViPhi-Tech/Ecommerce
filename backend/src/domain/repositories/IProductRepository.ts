import { Product, Stock } from "../entities/Product";

export interface IProductRepository {
    create(data: Product): Promise<Product>;
    findById(id: number): Promise<Product | null>;
    findAll(): Promise<Product[]>;
    update(id: number, data: Partial<Product>): Promise<Product>;
    delete(id: number): Promise<void>;
    updateStock(sku: number, quantity: number, companyId?: number): Promise<Stock>;
    updateMultipleStocks(items: { sku: number; quantity: number }[]): Promise<Stock[]>;
}