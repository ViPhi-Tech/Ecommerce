import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuItem, MenuItemComponent } from './menu-item/menu-item.component';

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
  menu: MenuGroup[] = [
    {
      groupTitle: 'Overview',
      items: [
        {
          label: 'Pedidos',
          icon: 'lucideFileText',
          route: 'orders',
          visible: true,
        },
      ],
    },
    {
      groupTitle: 'Estoque',
      items: [
        {
          label: 'Estoque global',
          icon: 'lucideArchive',
          route: 'storage',
          visible: true,
        },
        {
          label: 'Produtos',
          icon: 'lucideUsersRound',
          route: 'products',
          visible: true,
        },
      ]
    },
    {
      groupTitle: 'Personalização',
      items: [
        {
          label: 'Página Inicial',
          icon: 'lucidePaintbrush',
          route: 'customization/home',
        },
      ],
    },
    {
      groupTitle: 'Cadastros',
      items: [
        {
          label: 'Categorias',
          icon: 'lucideTags',
          route: 'categories',
          visible: true,
        },
        {
          label: 'Cupons',
          icon: 'lucideTicketPercent',
          route: 'discount-tickets',
          visible: true,
        },
      ],
    },
    {
      groupTitle: 'Financeiro',
      items: [
        {
          label: 'Transações',
          icon: 'lucideWallet',
          route: 'transactions',
          visible: true,
        },
        {
          label: 'Notas Fiscais',
          icon: 'lucideReceipt',
          route: '/dashboard/invoices',
          visible: true,
        },
        {
          label: 'Pagamentos',
          icon: 'lucideCreditCard',
          route: 'payments',
          visible: true,
        },
      ],
    },
    {
      groupTitle: 'Segurança',
      items: [
        { label: 'Permissões', icon: 'lucideShield', route: 'permissions' },
        { label: 'Usuários', icon: 'lucideUsersRound', route: 'users' },
      ],
    },
  ];

  constructor() {}

  ngOnInit() {}
}
