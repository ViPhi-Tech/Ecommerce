import { z } from 'zod';

export interface CreatePurchaseInvoiceInput {
  xmlData: any; // JSON do XML da NFe
}

export interface PurchaseInvoiceItemInput {
  productId?: number | null;
  description: string;
  ncm: string;
  cfop: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  taxData: any;
  ean?: string; // EAN do produto para validação
}

export interface PurchaseInvoiceResponse {
  id: number;
  accessKey: string;
  number: string;
  series: string;
  model: number;
  issueDate: Date;
  entryDate: Date;
  totalAmount: number;
  totalTax: number;
  supplierId: number;
  items: PurchaseInvoiceItemResponse[];
  createdAt: Date;
}

export interface PurchaseInvoiceItemResponse {
  id: number;
  purchaseInvoiceId: number;
  productId?: number | null;
  description: string;
  ncm: string;
  cfop: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
}

// Schema para validação do JSON recebido
export const createPurchaseInvoiceJsonSchema = {
  type: 'object',
  required: ['xmlData'],
  properties: {
    xmlData: {
      type: 'object',
    },
  },
};

export const purchaseInvoiceIdJsonSchema = {
  type: 'object',
  required: ['id'],
  properties: {
    id: { 
      type: 'string',
      pattern: '^[0-9]+$',
    },
  },
};
