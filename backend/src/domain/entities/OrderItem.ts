import { Product } from "./Product";

export interface OrderItem {
    id?: number;
    saleId?: number;
    productId: number;
    quantity: number;
    price: number;

    createdAt?: Date;
    updatedAt?: Date;

    product?: Product;
}
