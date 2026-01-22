import { ButtonSeverityType } from 'app/shared/types/button.types';
import { IStock } from './Stock';
import { IUser } from './User';

export interface IPurchaseInvoice {
  id: number;
  number: string;
  series: string;
  issueDate: string | Date;
  entryDate: string | Date;
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
}

export interface IMovimentItem {
  id: number;
  stockId: number;
  type: string;
  quantity: number;
  userId?: number | null;
  unitCost?: number | null;
  invoiceNumber?: string | null;
  icms?: number | null; // Valor unitário do ICMS na hora da nota
  st?: number | null; // Valor unitário da ST (Substituição Tributária) na hora da nota
  createdAt: string | Date;
  updatedAt?: string | Date;
  stock?: IStock;
  user?: IUser;
  product?: {
    name: string;
    sku: string;
  };
  purchaseInvoice?: IPurchaseInvoice | null;

  typeBadge?: ButtonSeverityType;
  typeLabel?: string;

  productName?: string;
  productSku?: string;

  hour?: string; // Hora do movimento, opcional
  date?: string; // Data do movimento, opcional
  previousStock?: number; // Estoque antes da movimentação
  currentStockAfterMovement?: number; // Estoque após esta movimentação
}
