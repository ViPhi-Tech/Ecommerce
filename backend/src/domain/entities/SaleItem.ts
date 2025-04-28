import { Product } from "./Product";

export interface SaleItem {
    id: number;
    saleId: number;
    productId: number;
    quantity: number;
    price: number;

    createdAt: Date;
    updatedAt: Date;

    product?: Product;
}
