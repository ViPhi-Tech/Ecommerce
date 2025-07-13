export interface stockMovement {
    userId?: number | null;
    stockId: number;
    type: string;
    quantity: number
}
