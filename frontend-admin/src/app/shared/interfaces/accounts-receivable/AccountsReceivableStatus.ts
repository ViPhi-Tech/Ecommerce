export type AccountsReceivableStatus =
  | 'pending' // Pendente
  | 'due_soon' // Vence em breve
  | 'overdue' // Vencido
  | 'received'; // Recebido

export const AccountsReceivableStatusLabels: Record<
  AccountsReceivableStatus,
  string
> = {
  pending: 'Pendente',
  due_soon: 'Vence em Breve',
  overdue: 'Vencido',
  received: 'Recebido',
};
