export interface Product {
    id: number;
    name: string;
    ean: string;
    price: number;
    sku: string;
    stock?: number;
}