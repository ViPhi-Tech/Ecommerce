export type AccountsPayableStatus =
  | 'pending' // Pendente
  | 'paid' // Pago
  | 'overdue' // Vencido
  | 'due_soon' // Vence em Breve
  | 'cancelled' // Cancelado
  | 'unknown'; // Desconhecido
