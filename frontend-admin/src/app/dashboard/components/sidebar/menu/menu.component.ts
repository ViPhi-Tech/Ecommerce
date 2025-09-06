import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuItem, MenuItemComponent } from './menu-item/menu-item.component';
import { ROLES_SITEMAP } from 'app/shared/constants/roles.sitemap';
import { AuthService } from 'app/core/auth/auth.service';

interface MenuGroup {
  groupTitle: string;
  items: MenuItem[];
}

@Component({
  selector: 'fuse-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  imports: [RouterModule, MenuItemComponent],
})
export class MenuComponent implements OnInit {
  private authService = inject(AuthService);

  menu: MenuGroup[] = [
    {
      groupTitle: 'Dashboard',
      items: [
        {
          id: ROLES_SITEMAP.Dashboard,
          label: 'Visão Geral',
          icon: 'lucideLayoutDashboard',
          route: '/dashboard',
          visible: true,
        },
      ],
    },
    {
      groupTitle: 'Comercial',
      items: [
        {
          id: ROLES_SITEMAP.Pedidos,
          label: 'Vendas',
          icon: 'lucideShoppingCart',
          route: '/dashboard/orders/list',
          visible: true,
        },
        {
          id: ROLES_SITEMAP.Pedidos,
          label: 'Nova Venda',
          icon: 'lucidePlus',
          route: '/dashboard/orders/new',
        },
        {
          id: ROLES_SITEMAP.Pedidos,
          label: 'Ordens de Serviço',
          icon: 'lucideWrench',
          route: '/dashboard/service-orders/list',
          visible: true,
        },
      ],
    },
    {
      groupTitle: 'Estoque',
      items: [
        {
          id: ROLES_SITEMAP.Produtos,
          label: 'Produtos',
          icon: 'lucideBox',
          route: '/dashboard/products/list',
          visible: true,
        },
        {
          id: ROLES_SITEMAP.MovimentacaoEstoque,
          label: 'Movimentações',
          icon: 'lucideActivity',
          visible: true,
          route: '/dashboard/stock-movements/list',
        },
      ],
    },
    {
      groupTitle: 'Financeiro',
      items: [
        {
          id: ROLES_SITEMAP.ContasPagar,
          label: 'Contas a Pagar',
          icon: 'lucideCreditCard',
          route: '/dashboard/accounts-payable/kanban',
          visible: true,
        },
        {
          id: ROLES_SITEMAP.ContasReceber,
          label: 'Contas a Receber',
          icon: 'lucideDollarSign',
          route: '/dashboard/accounts-receivable/kanban',
          visible: true,
        },
        {
          id: ROLES_SITEMAP.Relatorios,
          label: 'Relatórios',
          icon: 'lucideChartPie',
          route: '/dashboard/reports/list',
          visible: true,
        },
      ],
    },
    {
      groupTitle: 'Acessos',
      items: [
        {
          id: ROLES_SITEMAP.Usuarios,
          label: 'Usuários',
          icon: 'lucideUsers',
          route: '/dashboard/users/list',
          visible: true,
        },
      ],
    },
    {
      groupTitle: 'Cadastros',
      items: [
        {
          id: ROLES_SITEMAP.Clientes,
          label: 'Clientes',
          icon: 'lucideUser',
          route: '/dashboard/clients/list',
          visible: true,
        },
        {
          id: ROLES_SITEMAP.Fornecedores,
          label: 'Fornecedores',
          icon: 'lucideTruck',
          route: '/dashboard/suppliers/list',
          visible: true,
        },
        {
          id: ROLES_SITEMAP.Categorias,
          label: 'Categorias',
          icon: 'lucideTag',
          route: '/dashboard/categories/list',
          visible: true,
        },
      ],
    },
  ];

  constructor() {}

  ngOnInit() {
    this.updateMenuVisibility();
  }

  updateMenuVisibility() {
    this.menu = this.menu
      .map(group => {
        group.items = group.items.filter(item => {
          let enable = true;
          if (item.id) {
            enable = this.authService.checkAnyRole([item.id]);
          }
          return enable;
        });
        return group;
      })
      .filter(group => group.items.length > 0);
  }
}
