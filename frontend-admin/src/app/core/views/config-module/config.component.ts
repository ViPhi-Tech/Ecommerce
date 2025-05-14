import { Component, OnInit, signal } from '@angular/core';

@Component({
  selector: 'fuse-config-module',
  templateUrl: './config.component.html',
  standalone: false,
})
export class ConfigComponent implements OnInit {
  items = signal([
    {
      title: 'Produtos',
      description: 'Cadastre e gerencie seus produtos',
      icon: 'lucidePackage',
      color: 'rgb(16 185 129 / var(--tw-text-opacity, 1))',
      href: '/products',
    },
    {
      title: 'Categorias',
      description: 'Organize seus produtos em categorias',
      icon: 'lucideTags',
      color: 'rgb(59 130 246 / var(--tw-text-opacity, 1))',
      href: '/categories',
    },
    {
      title: 'Notas Fiscais',
      description: 'Emita e consulte notas fiscais',
      icon: 'lucideFileText',
      color: 'rgb(249 115 22 / var(--tw-text-opacity, 1))',
      href: '/invoices',
    },
    {
      title: 'Clientes',
      description: 'Gerencie sua base de clientes',
      icon: 'lucideUsers',
      color: 'rgb(244 63 94 / var(--tw-text-opacity, 1))',
      href: '/clients',
    },
    {
      title: 'Fornecedores',
      description: 'Cadastre seus fornecedores',
      icon: 'lucideTruck',
      color: 'rgb(167 139 250 / var(--tw-text-opacity, 1))',
      href: '/suppliers',
    },
    {
      title: 'Vendas',
      description: 'Registre e consulte vendas',
      icon: 'lucideShoppingCart',
      color: 'rgb(34 197 94 / var(--tw-text-opacity, 1))',
      href: '/sales',
    },
    {
      title: 'Relatórios',
      description: 'Visualize relatórios e estatísticas',
      icon: 'lucideBarChart3',
      color: 'rgb(129 140 248 / var(--tw-text-opacity, 1))',
      href: '/reports',
    },
  ]);

  constructor() {}

  ngOnInit() {}
}
