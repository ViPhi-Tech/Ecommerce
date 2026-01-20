export interface ProductInvoice {
  itemNumber: string;
  sku?: string;
  ean?: string;
  eanTrib?: string;
  description: string;
  quantity: string;
  unit: string;
  unitValue: string;
  totalValue: string;
  cfop: string;
}
