export interface OrderCreateItem {
    productId: number;
    quantity: number;
    price: number;
}

export interface OrderResponse {
    id?: number
    clientId?: number | null;
    total: number;
    createdAt?: Date;
    status?: string;
    items?: OrderCreateItem[];
}
