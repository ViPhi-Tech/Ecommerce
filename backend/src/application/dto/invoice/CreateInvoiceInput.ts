export interface CreateInvoiceInput {
  id?: number,
  number: string;                // obrigatório
  series?: string | null;        // opcional, aceita null
  status: string;                // obrigatório
  issueDate: string;             // obrigatório, string ISO para converter para Date
  dueDate?: string | null;       // opcional, aceita null
  totalAmount: number;           // obrigatório
  taxAmount?: number | null;     // opcional, aceita null
  clientId?: number | null;      // opcional, aceita null
  orderId?: number | null;               // obrigatório (Int no Prisma)
  items?: {
    productId: number;
    quantity: number;
    price: number;
    totalAmount: number;
  }[]
}