export interface Product {
    id?: number;
    name: string;
    description?: string | null;
    shortDescription?: string | null;
    initialPrice: number;
    finalPrice: number;
    image?: string | null;
    sku: string;
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



