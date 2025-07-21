export interface InvoiceItem{
    id?: number,
    invoiceId: number,
    productId: number,
    quantity: number,
    price: number,
    totalAmount: number
}