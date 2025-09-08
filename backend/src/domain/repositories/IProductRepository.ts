import { Product, Stock, stockMovement, findMoviment, TopProducts } from "../entities/Product";

export interface IProductRepository {
    create(data: Product): Promise<Product>;
    findById(id: number): Promise<Product | null>;
    findByName(param: string): Promise<Product[]>
    findAll(): Promise<Product[]>;
    update(id: number, data: Partial<Product>): Promise<Product>;
    delete(id: number): Promise<void>;
    updateStock(sku: number, quantity: number, companyId?: number): Promise<Stock>;
    decrementMultipleStocks(items: { sku: number; quantity: number }[]): Promise<Stock[]>;
    incrementMultipleStocks(item: {sku: number; quantity: number}[]): Promise<Stock[]>;
    upsertStockMovement(data: stockMovement): Promise<void>;
    updateManyStockMovements(data: stockMovement[]): Promise<void>;
    findStockByProductId(productsId: number[]): Promise<Stock[]>;
    findMovimentByProductId(stockId: number[]): Promise<stockMovement[]>;
    findByAnyParam(param: string): Promise<Product[]>;
    findMovimentByDate(data: findMoviment): Promise<stockMovement[]>;
    countStock(startDate: Date, endDate: Date): Promise<number>;
    countMoviment(startDate: Date, endDate: Date, type: 'IN' | 'OUT'): Promise<number>;
    countByMonth(initialMonth: number, finalMonth: number): Promise<number>;
    getTopProductsByMonth(initialMonth: number, finalMonth: number): Promise<TopProducts[]>;
    validateProducts(products: Product[]): Promise<{ skuExisting: string[], eanExisting: string[] }>;
}