export interface IDebt {
  id?: string;
  title: string;
  description?: string;
  amount: number;
  dueDate: Date | string;
  paidDate?: Date | string;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  creditorName: string;
  creditorDocument?: string;
  categoryId?: string;
  companyId?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}
