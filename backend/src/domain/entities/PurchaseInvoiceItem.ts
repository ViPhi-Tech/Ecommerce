export interface PurchaseInvoiceItem {
  id?: number;
  purchaseInvoiceId: number;
  productId?: number | null;
  description: string;
  ncm: string;
  cfop: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  taxData: any; // JSON com dados de impostos
}
