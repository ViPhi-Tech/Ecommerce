import { OrderItem } from "./OrderItem";

export interface Order {
    id?: number;
    total: number;
    createdAt?: Date;
    updatedAt?: Date;
    
    clientId?: number | null;
}


