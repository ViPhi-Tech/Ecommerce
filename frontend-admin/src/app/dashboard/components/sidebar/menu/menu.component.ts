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
          label: 'Comercial',
          icon: 'lucideStore',
          visible: true,
          items: [
            {
              label: 'Pedidos',
              icon: 'lucideFileText',
              route: '/dashboard/orders/list',
              tree: 7,
              visible: true,
            },
            {
              label: 'Novo Pedido',
              icon: 'lucidePlus',
              route: '/dashboard/orders/new',
              tree: 7,
            },
          ],
        },
      ],
    },
    {
      groupTitle: 'Operacional',
      items: [
        {
          label: 'Estoque',
          icon: 'lucideArchive',
          visible: true,
          items: [
            {
              label: 'Movimentações',
              icon: 'lucideActivity',
              tree: 7,
              visible: true,
              route: '/dashboard/stock-movements/list',
            },
            {
              label: 'Produtos',
              icon: 'lucideBox',
              tree: 7,
              route: '/dashboard/products/list',
              visible: true,
            },
          ],
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
