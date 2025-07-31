export interface AccountsPayable {
  id: number;
  uuid: string;
  supplierId: number;
  originalDueDate: Date;
  issueDate: Date;
  dueDate: Date;
  competenceDate: Date;
  amount: number;
  recurringPurchase: boolean;
  description: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}