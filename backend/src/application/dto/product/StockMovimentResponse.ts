export interface stockMovement {
    userId?: number | null;
    createdAt?: string,
    stockId: number;
    type: string;
    quantity: number,
    product? : {
        name: string;
        sku: string;
    },
    user? : {
        name: string;
    }
}
