import { number } from "zod";

export interface OrderCreateItem {
    productId: number;
    quantity: number;
    price: number;
}
export interface CreateOrderInput {
    id?: number
    clientId: number;
    total: number;
    items: OrderCreateItem[];
    payments: {
        typeId: string;
        value: number
    }[]
}
