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


export interface AggregateOrderResponse {
    month: string
    total: number
}

export interface AggregateOrderStatusResponse {
    name: string
    total: number
}

export interface AggregateOrderCategoryResponse {
    name: string
    total: number
}
