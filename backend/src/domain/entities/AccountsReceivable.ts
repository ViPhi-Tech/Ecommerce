export interface AccountsReceivable {
  id: number;
  uuid: string;
  clientId: number;
  originalDueDate?: Date | null;
  issueDate: Date;
  dueDate: Date;
  competenceDate: Date | null;
  recurringIncome: boolean;
  description: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
