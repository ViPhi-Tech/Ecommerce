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
      groupTitle: 'Comercial',
      items: [
        {
          label: 'Vendas',
          icon: 'lucideShoppingCart',
          route: '/dashboard/orders/list',
          visible: true,
        },
        {
          label: 'Nova Venda',
          icon: 'lucidePlus',
          route: '/dashboard/orders/new',
        },
      ],
    },
    {
      groupTitle: 'Estoque',
      items: [
        {
          label: 'Produtos',
          icon: 'lucideBox',
          route: '/dashboard/products/list',
          visible: true,
        },
        {
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
          label: 'Contas a Pagar',
          icon: 'lucideCreditCard',
          route: '/dashboard/bills/list',
          visible: true,
        },
        {
          label: 'Contas a Receber',
          icon: 'lucideDollarSign',
          route: '/dashboard/receivables/list',
          visible: true,
        },
      ],
    },
    {
      groupTitle: 'Acessos',
      items: [
        {
          label: 'Usuários',
          icon: 'lucideUsers',
          route: '/dashboard/users/list',
          visible: true,
        },
      ],
    },
  ];

  constructor() {}

  ngOnInit() {
    // this.updateMenuVisibility();
  }

  updateMenuVisibility() {
    // const currentRoute = window.location.pathname;
    // this.menu.forEach(group => {
    //   group.items.forEach(item => {
    //     if (item.route && currentRoute.startsWith(item.route)) {
    //       item.visible = true;
    //     } else if (item.items) {
    //       item.visible = item.items.some(
    //         subItem => subItem.route && currentRoute.startsWith(subItem.route)
    //       );
    //     }
    //   });
    // });
    // this.menu = [...this.menu];
  }
}
