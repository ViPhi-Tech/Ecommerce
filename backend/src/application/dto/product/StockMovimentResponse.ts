export interface stockMovement {
    userId?: number | null;
    createdAt?: string,
    stockId: number;
    type: string;
    quantity: number,
    unitCost?: number | null;
    invoiceNumber?: string | null;
    product? : {
        name: string;
        sku: string;
    },
    user? : {
        name: string;
    },
    purchaseInvoice?: {
        id: number;
        number: string;
        series: string;
        issueDate: Date;
        entryDate: Date;
        supplier: {
            tradeName: string;
            legalName: string;
            cnpj: string;
        };
        item?: {
            quantity: number;
            unitPrice: number;
            totalAmount: number;
            description: string;
        };
    } | null;
}
