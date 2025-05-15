import { Component, OnInit, signal } from '@angular/core';

@Component({
  selector: 'fuse-config-module',
  templateUrl: './config.component.html',
  standalone: false,
})
export class ConfigComponent implements OnInit {

  itemsCrud = signal([
    {
      title: 'Produtos',
      description: 'Cadastre e gerencie seus produtos',
      icon: 'lucidePackage',
      color: 'rgb(16 185 129 / var(--tw-text-opacity, 1))',
      href: 'products',
    },
    {
      title: 'Categorias',
      description: 'Organize seus produtos em categorias',
      icon: 'lucideTags',
      color: 'rgb(59 130 246 / var(--tw-text-opacity, 1))',
      href: 'categories',
    },
  
    {
      title: 'Clientes',
      description: 'Gerencie sua base de clientes',
      icon: 'lucideUsers',
      color: 'rgb(244 63 94 / var(--tw-text-opacity, 1))',
      href: 'clients',
    },
    {
      title: 'Fornecedores',
      description: 'Cadastre seus fornecedores',
      icon: 'lucideTruck',
      color: 'rgb(167 139 250 / var(--tw-text-opacity, 1))',
      href: 'suppliers',
    },
    {
      title: 'Revendedores',
      description: 'Cadastre seus revendedores',
      icon: 'lucideStore',
      color: 'rgb(255 165 0 / var(--tw-text-opacity, 1))',
      href: 'resellers',
    },
  ]);

  constructor() {}

  ngOnInit() {}
}
