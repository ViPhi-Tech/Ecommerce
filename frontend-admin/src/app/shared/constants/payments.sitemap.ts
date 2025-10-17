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
  CREDIT: {
    id: 'credit',
    name: 'Cartão de Crédito',
    description: 'Visa, Mastercard, Elo',
    icon: 'lucideCreditCard',
    iconColor: '#2563eb', // Azul direto
    severity: 'warn',
  },
  DEBIT: {
    id: 'debit',
    name: 'Cartão de Débito',
    description: 'Visa, Mastercard, Elo',
    icon: 'lucideCreditCard',
    iconColor: '#2563eb', // Azul direto
    severity: 'warn',
  },
  BOLETO: {
    id: 'boleto',
    name: 'Boleto',
    description: 'Boleto Bancário',
    icon: 'lucideBanknote',
    iconColor: '#15803d', // Verde escuro direto
    severity: 'success',
  },
  MONEY: {
    id: 'money',
    name: 'Dinheiro',
    description: 'Pagamento na entrega/retirada',
    icon: 'lucideBanknote',
    iconColor: '#15803d', // Verde escuro direto
    severity: 'success',
  },
};
