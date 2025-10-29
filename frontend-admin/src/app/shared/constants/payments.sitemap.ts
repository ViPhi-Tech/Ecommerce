export const PAYMENTS_SITEMAP = {
  PIX: {
    id: 'pix',
    name: 'PIX',
    description: 'Pagamento instantâneo',
    icon: 'lucideSmartphone',
    iconColor: '#16a34a', // Verde direto
    discountColor: '#16a34a', // Verde direto
    severity: 'info',
  },
  CARD: {
    id: 'card',
    name: 'Cartão de Crédito/Débito',
    description: 'Visa, Mastercard, Elo',
    icon: 'lucideCreditCard',
    iconColor: '#2563eb', // Azul direto
    severity: 'warn',
  },
  MONEY: {
    id: 'money',
    name: 'Dinheiro',
    description: 'Pagamento na entrega/retirada',
    icon: 'lucideBanknote',
    iconColor: '#15803d', // Verde escuro direto
    severity: 'success',
  },
  ACCOUNT_RECEIVABLE: {
    id: 'account_receivable',
    name: 'Pedido anotado',
    description: 'Pedido anotado',
    icon: 'lucideNotebook',
    iconColor: '#f59e0b', // amarelo
    severity: 'warn',
    needClient: true,
  },
};
