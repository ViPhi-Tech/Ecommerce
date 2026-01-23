export interface ProductInvoice {
  itemNumber: string;
  sku?: string;
  ean?: string;
  eanTrib?: string;
  description: string;
  quantity: string;
  unit: string;
  unitValue: string;
  discount?: string; // V. DESC.
  totalValue: string;
  cfop: string;
  ncm?: string;
  cst?: string;
  // ICMS
  icmsBase?: string; // BC ICMS
  icmsValue?: string; // V. ICMS
  icmsRate?: string; // ALÍQ. ICMS
  // ICMS ST
  icmsStBase?: string; // BC ICMS ST
  icmsStValue?: string; // V. ICMS ST
  // IPI
  ipiValue?: string; // V. IPI
  ipiRate?: string; // ALÍQ. IPI
  // Valores calculados (unitários)
  unitCost?: string; // Valor custo unitário
  unitTotalWithTax?: string; // Valor unitário com tributo
  // Valores calculados (totais)
  totalCost?: string; // Valor total do custo
  totalWithTax?: string; // Valor total com tributo
}
