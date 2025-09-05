export interface IServiceOrder {
  id: string | number;
  client: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  createdDate: string;
  dueDate: string;
  assignedTo: string;
  notes: string;

  loading?: boolean;
}
