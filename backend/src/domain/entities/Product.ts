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
    icms?: number | null; // Valor unitário do ICMS (editável)
    st?: number | null; // Valor unitário da ST - Substituição Tributária (editável)
    category?: {
        id: number;
        name: string;
    } | null;
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
    userId?: number | null;
    stockId: number;
    type: string;
    quantity: number;
    unitCost?: number | null;
    invoiceNumber?: string | null;
    icms?: number | null; // Valor unitário do ICMS na hora da nota
    st?: number | null; // Valor unitário da ST (Substituição Tributária) na hora da nota
}


export interface findMoviment {
    date: Date;
    type: "IN" | "OUT" | undefined | null;
}


export interface TopProducts {
    name: string;
    total: number;
}