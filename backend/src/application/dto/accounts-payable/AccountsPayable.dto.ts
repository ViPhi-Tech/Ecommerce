export interface AccountsPayableCreateDTO {
  supplierId: number;
  originalDueDate: Date;
  issueDate: Date;
  dueDate: Date;
  competenceDate: Date;
  amount: number;
  recurringPurchase?: boolean;
  description: string;
  status: 'PENDING' | 'PAID' | 'CANCELLED';
}

export interface AccountsPayableUpdateDTO {
  supplierId?: number;
  originalDueDate?: Date;
  issueDate?: Date;
  dueDate?: Date;
  competenceDate?: Date;
  amount?: number;
  recurringPurchase?: boolean;
  description?: string;
  status?: string;
}