export type AccountsPayableStatus =
  | 'pending' // Pendente
  | 'paid' // Pago
  | 'overdue' // Vencido
  | 'cancelled' // Cancelado 
  | 'unknown'; // Desconhecido