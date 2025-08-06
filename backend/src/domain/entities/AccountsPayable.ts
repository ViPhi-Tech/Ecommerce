export interface AccountsPayable {
  id: number;
  uuid: string;
  supplierId: number;
  originalDueDate?: Date | null;
  issueDate: Date;
  dueDate: Date;
  competenceDate: Date | null; 
  recurringPurchase: boolean;
  description: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}