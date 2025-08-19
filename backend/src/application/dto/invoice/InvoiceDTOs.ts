import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

// ===== INPUT DTOs (Para Use Cases) =====
export interface CreateInvoiceInput {
  number: string;
  series: string;
  status: string;
  issueDate: string;
  dueDate: string;
  totalAmount: number;
  taxAmount: number;
  clientId?: number | null;
  orderId?: number | null;
  items: InvoiceItemInput[];
}

export interface InvoiceItemInput {
  productId: number;
  quantity: number;
  price: number;
  totalAmount: number;
}

export interface UpdateInvoiceInput {
  number: string;
  series: string;
  status: string;
  issueDate: string;
  dueDate?: string | null;
  totalAmount: number;
  taxAmount?: number | null;
  clientId?: number | null;
  orderId: number;
}

// ===== VALIDATION SCHEMAS (Para HTTP) =====
export const invoiceItemSchema = z.object({
  productId: z.number().int({ message: "ID do produto deve ser um número inteiro" }),
  quantity: z.number().int({ message: "Quantidade deve ser um número inteiro" }),
  price: z.number().min(0, { message: "Preço deve ser maior ou igual a zero" }),
  totalAmount: z.number().min(0, { message: "Valor total deve ser maior ou igual a zero" }),
});

export const createInvoiceSchema = z.object({
  number: z.string().min(1, { message: 'Número da fatura é obrigatório' }),
  series: z.string().min(1, { message: 'Série é obrigatória' }),
  status: z.string().min(1, { message: 'Status é obrigatório' }),
  issueDate: z.string().datetime({ message: 'Data de emissão inválida' }),
  dueDate: z.string().datetime({ message: 'Data de vencimento inválida' }),
  totalAmount: z.number().min(0, { message: 'Valor total deve ser maior ou igual a zero' }),
  taxAmount: z.number().min(0, { message: 'Valor do imposto deve ser maior ou igual a zero' }),
  clientId: z.number().int().nullable().optional(),
  orderId: z.preprocess(
    (input) => {
      if (input === "" || input === null || input === undefined || input === 0) {
        return null;
      }
      return Number(input);
    },
    z.number().int().nullable()
  ),
  items: z.array(invoiceItemSchema).min(1, { message: 'Pelo menos um item é obrigatório' })
});

export const updateInvoiceSchema = z.object({
  id: z.number().int({ message: 'ID da fatura deve ser um número inteiro' }),
  number: z.string().min(1, { message: 'Número da fatura é obrigatório' }),
  series: z.string().min(1, { message: 'Série é obrigatória' }),
  status: z.string().min(1, { message: 'Status é obrigatório' }),
  issueDate: z.string().datetime({ message: 'Data de emissão inválida' }),
  dueDate: z.string().datetime({ message: 'Data de vencimento inválida' }).nullable().optional(),
  totalAmount: z.number().min(0, { message: 'Valor total deve ser maior ou igual a zero' }),
  taxAmount: z.number().min(0, { message: 'Valor do imposto deve ser maior ou igual a zero' }).nullable().optional(),
  clientId: z.number().int().nullable().optional(),
  orderId: z.number().int({ message: 'ID do pedido deve ser um número inteiro' }),
});

export const invoiceIdSchema = z.object({
  id: z.number().int({ message: 'ID da fatura deve ser um número inteiro' }),
});

// ===== JSON SCHEMAS (Para Swagger) =====
export const createInvoiceJsonSchema = zodToJsonSchema(createInvoiceSchema);
export const updateInvoiceJsonSchema = zodToJsonSchema(updateInvoiceSchema);
export const invoiceIdJsonSchema = zodToJsonSchema(invoiceIdSchema);
export const invoiceItemJsonSchema = zodToJsonSchema(invoiceItemSchema);

// ===== TYPES (Para TypeScript) =====
export type CreateInvoiceDTO = z.infer<typeof createInvoiceSchema>;
export type UpdateInvoiceDTO = z.infer<typeof updateInvoiceSchema>;
export type InvoiceIdDTO = z.infer<typeof invoiceIdSchema>;
export type InvoiceItemDTO = z.infer<typeof invoiceItemSchema>;

// ===== RESPONSE DTOs =====
export interface InvoiceResponse {
  id: number;
  number: string;
  series: string;
  status: string;
  issueDate: Date;
  dueDate: Date;
  totalAmount: number;
  taxAmount: number;
  clientId?: number | null;
  orderId?: number | null;
  createdAt: Date;
  updatedAt: Date;
  items?: InvoiceItemResponse[];
  client?: {
    id: number;
    fullName: string;
    email: string;
  };
}

export interface InvoiceItemResponse {
  id: number;
  invoiceId: number;
  productId: number;
  quantity: number;
  price: number;
  totalAmount: number;
  product?: {
    id: number;
    name: string;
    sku: string;
  };
}