import { IUserModule } from '../interfaces/user/UserModule';

export const SYSTEM_MODULES: IUserModule[] = [
  {
    id: 'home-module',
    name: 'Dashboard',
    description: 'Painel principal com visão geral do sistema',
    route: '/dashboard/home'
  },
  {
    id: 'product-module',
    name: 'Produtos',
    description: 'Gerenciamento de produtos e catálogo',
    route: '/dashboard/products'
  },
  {
    id: 'category-module',
    name: 'Categorias',
    description: 'Gerenciamento de categorias de produtos',
    route: '/dashboard/categories'
  },
  {
    id: 'client-module',
    name: 'Clientes',
    description: 'Gerenciamento de clientes',
    route: '/dashboard/clients'
  },
  {
    id: 'supplier-module',
    name: 'Fornecedores',
    description: 'Gerenciamento de fornecedores',
    route: '/dashboard/suppliers'
  },
  {
    id: 'order-module',
    name: 'Pedidos',
    description: 'Gerenciamento de pedidos e vendas',
    route: '/dashboard/orders'
  },
  {
    id: 'invoice-module',
    name: 'Notas Fiscais',
    description: 'Gerenciamento de notas fiscais',
    route: '/dashboard/invoices'
  },
  {
    id: 'stock-movement-module',
    name: 'Movimentação de Estoque',
    description: 'Controle de entrada e saída de estoque',
    route: '/dashboard/stock'
  },
  {
    id: 'accounts-payable-module',
    name: 'Contas a Pagar',
    description: 'Gerenciamento de contas a pagar',
    route: '/dashboard/accounts-payable'
  },
  {
    id: 'accounts-receivable-module',
    name: 'Contas a Receber',
    description: 'Gerenciamento de contas a receber',
    route: '/dashboard/accounts-receivable'
  },
  {
    id: 'report-module',
    name: 'Relatórios',
    description: 'Relatórios e análises do sistema',
    route: '/dashboard/reports'
  },
  {
    id: 'user-module',
    name: 'Usuários',
    description: 'Gerenciamento de usuários do sistema',
    route: '/dashboard/users'
  },
  {
    id: 'customization',
    name: 'Personalização',
    description: 'Configurações e personalização do sistema',
    route: '/dashboard/customization'
  }
];
