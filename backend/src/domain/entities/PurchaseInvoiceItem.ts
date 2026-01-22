export interface PurchaseInvoiceItem {
  id?: number;
  purchaseInvoiceId: number;
  productId?: number | null;
  code?: string | null; // CÓD. PROD
  description: string;
  ncm: string;
  cst?: string | null; // CST
  cfop: string;
  unit?: string | null; // UN.
  quantity: number;
  unitPrice: number;
  discount?: number | null; // V. DESC.
  totalAmount: number;
  icmsBase?: number | null; // BC ICMS
  icmsValue?: number | null; // V. ICMS
  icmsRate?: number | null; // ALÍQ. ICMS
  icmsStBase?: number | null; // BC ICMS ST
  icmsStValue?: number | null; // V. ICMS ST
  ipiValue?: number | null; // V. IPI
  ipiRate?: number | null; // ALÍQ. IPI
  // Valores calculados (unitários)
  unitCost?: number | null; // Valor custo unitário
  unitTotalWithTax?: number | null; // Valor unitário com tributo (unitPrice + ICMS + ST)
  // Valores calculados (totais)
  totalCost?: number | null; // Valor total do custo (unitCost * quantity)
  totalWithTax?: number | null; // Valor total com tributo (unitTotalWithTax * quantity)
  taxData: any; // JSON com dados de impostos
}
