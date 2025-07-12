import { Routes } from '@angular/router';

export const categoryRoutes: Routes = [
  {
    path: 'list',
    loadComponent: () => import('./screens/list/category-list.component').then(m => m.CategoryListComponent),
    data: {
      title: ['Dashboard', 'Lista de categorias'],
    },
  },
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  },
];

