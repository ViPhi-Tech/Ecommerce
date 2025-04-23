export interface Product {
    id?: number;
    name: string;
    ean: string;
    price: number;
    sku: string;
    stock?: number;
    companyId: number | null
}

export interface Stock {
    id: number;
    companyId?: number;
    productId: number;
    quantity: number;
}