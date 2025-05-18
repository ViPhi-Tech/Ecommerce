export interface Product {
    id?: number;
    name: string;
    description?: string | null;
    sku: string;
    price: number;
    quantity?: number;
    ean: string;
    companyId: number | null;
    stock?: Stock | null;
}

export interface Stock {
    id?: number;
    productId: number;
    quantity: number;
    createdAt?: Date;
    updatedAt?: Date;
}



