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
        { label: 'Dashboard', icon: 'lucideHouse', route: 'aaaaaaaaaaaaaaaaa' },
        {
          label: 'Pedidos',
          icon: 'lucideFileText',
          route: 'orders',
          visible: true,
        },
        {
          label: 'Organization',
          icon: 'lucideBuilding2',
          route: '/organization',
          visible: true,
        },
        {
          label: 'Projects',
          icon: 'lucideFolder',
          route: 'projects',
          visible: true,
          items: [
            { label: 'Usuários', icon: 'lucideUsersRound', route: 'users' },
            { label: 'Permissões', icon: 'lucideShield', route: 'permissions' },
          ],
        },
      ],
    },
    {
      groupTitle: 'Cadastros',
      items: [
        {
          label: 'Produtos',
          icon: 'lucideUsersRound',
          route: 'products',
          visible: true,
        },
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
        { label: 'Usuários', icon: 'lucideUsersRound', route: 'users' },
        { label: 'Permissões', icon: 'lucideShield', route: 'permissions' },
      ],
    },
  ];

  constructor() {}

  ngOnInit() {}
}
