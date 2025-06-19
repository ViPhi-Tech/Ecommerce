export interface Product {
    id?: number;
    name: string;
    description?: string | null;
    shortDescription?: string | null;
    initialPrice: number;
    brand?: string | null;
    finalPrice: number;
    image?: string | null;
    sku: string;
    quantity?: number;
    ean: string;
    companyId?: number | null;
    categoryId?: number | null;
    stock?: Stock | null;
}

export interface Stock {
    id?: number;
    productId: number;
    quantity: number;
    createdAt?: Date;
    updatedAt?: Date;
}


export interface stockMovement {
    user?: number | null;
    sotckId: number;
    type: string;
    quantity: number
}
