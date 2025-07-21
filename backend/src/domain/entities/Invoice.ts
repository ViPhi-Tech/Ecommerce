export interface Invoice {
  id?: number;                 // opcional, gerado pelo banco
  number?: string | null;              // obrigatório
  series?: string | null;      // opcional, pode ser null
  status: string;              // obrigatório
  issueDate: Date;             // obrigatório
  dueDate?: Date | null;       // opcional, pode ser null
  totalAmount: number;         // obrigatório
  taxAmount?: number | null;   // opcional, pode ser null
  clientId?: number | null;    // opcional, pode ser null
  orderId?: number | null;             // obrigatório (Int no Prisma)
}