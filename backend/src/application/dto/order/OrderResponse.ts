import { ClientResponse } from "../client/ClienteResponse";

export interface OrderCreateItem {
    productId: number;
    quantity: number;
    price: number;
}

export interface OrderResponse {
    id?: number
    clientId?: number | null;
    client?: ClientResponse;
    total: number;
    createdAt?: Date;
    status?: string;
    items?: OrderCreateItem[];
}
