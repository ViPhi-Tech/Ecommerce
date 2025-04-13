export type ProductDTO = {
    id: number,
    name: string,
    ean: string,
    description?: string,
    cost?: number,
    price: number,
    sku?: string,
    stock?: number,
}

export type ProductCreateDTO = {
    name: string,
    ean: string,
    description?: string
    price: number,
    sku: string,
    cost?: number
    stock?: number,
    companyId: number
}