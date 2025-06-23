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
          route: '/dashboard/orders',
          visible: true,
        },
      ],
    },
    {
      groupTitle: 'Cadastros',
      items: [
        {
          label: 'Estoque',
          icon: 'lucideArchive',
          visible: false,
          items: [
            {
              label: 'Produtos',
              icon: 'lucideBox',
              parent: 'Estoque',
              route: '/dashboard/config/products/list',
              visible: true,
            },
            {
              label: 'Novo Produto',
              icon: 'lucidePlus',
              parent: 'Estoque',
              route: '/dashboard/config/products/new',
              visible: true,
            },
            {
              label: 'Categorias',
              icon: 'lucideTags',
              route: '/dashboard/config/categories/list',
              visible: true,
            },
          ],
        },
        // categorias
      ],
    },
  ];

  constructor() {}

  ngOnInit() {
    this.updateMenuVisibility();
  }

  updateMenuVisibility() {
    const currentRoute = window.location.pathname;
    this.menu.forEach(group => {
      group.items.forEach(item => {
        if (item.route && currentRoute.startsWith(item.route)) {
          item.visible = true;
        } else if (item.items) {
          item.visible = item.items.some(
            subItem => subItem.route && currentRoute.startsWith(subItem.route)
          );
        }
      });
    });
    this.menu = [...this.menu];
  }
}
