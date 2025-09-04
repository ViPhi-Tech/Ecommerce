import { IUserModule } from '../interfaces/user/UserModule';
import { ROLES_SITEMAP } from './roles.sitemap';

export const SYSTEM_MODULES: IUserModule[] = [
  {
    id: ROLES_SITEMAP.Dashboard,
    name: 'Dashboard',
    description: 'Painel principal com visão geral do sistema',
    route: '/dashboard/home',
  },
  {
    id: ROLES_SITEMAP.Produtos,
    name: 'Produtos',
    description: 'Gerenciamento de produtos e catálogo',
    route: '/dashboard/products',
  },
  {
    id: ROLES_SITEMAP.Categorias,
    name: 'Categorias',
    description: 'Gerenciamento de categorias de produtos',
    route: '/dashboard/categories',
  },
  {
    id: ROLES_SITEMAP.Clientes,
    name: 'Clientes',
    description: 'Gerenciamento de clientes',
    route: '/dashboard/clients',
  },
  {
    id: ROLES_SITEMAP.Fornecedores,
    name: 'Fornecedores',
    description: 'Gerenciamento de fornecedores',
    route: '/dashboard/suppliers',
  },
  {
    id: ROLES_SITEMAP.Pedidos,
    name: 'Pedidos',
    description: 'Gerenciamento de pedidos e vendas',
    route: '/dashboard/orders',
  },
  {
    id: ROLES_SITEMAP.MovimentacaoEstoque,
    name: 'Movimentação de Estoque',
    description: 'Controle de entrada e saída de estoque',
    route: '/dashboard/stock',
  },
  {
    id: ROLES_SITEMAP.ContasPagar,
    name: 'Contas a Pagar',
    description: 'Gerenciamento de contas a pagar',
    route: '/dashboard/accounts-payable',
  },
  {
    id: ROLES_SITEMAP.ContasReceber,
    name: 'Contas a Receber',
    description: 'Gerenciamento de contas a receber',
    route: '/dashboard/accounts-receivable',
  },
  {
    id: ROLES_SITEMAP.Relatorios,
    name: 'Relatórios',
    description: 'Relatórios e análises do sistema',
    route: '/dashboard/reports',
  },
  {
    id: ROLES_SITEMAP.Usuarios,
    name: 'Usuários',
    description: 'Gerenciamento de usuários do sistema',
    route: '/dashboard/users',
  },
];
