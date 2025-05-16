import { SaleItem } from "./SaleItem";

export interface Sale {
    id: number;
    total: number;
    createdAt: Date;
    updatedAt: Date;
    
    clientId?: number | null;
    
    items: SaleItem[];
}


