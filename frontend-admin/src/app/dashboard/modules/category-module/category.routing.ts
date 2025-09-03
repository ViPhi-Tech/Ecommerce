import { Routes } from '@angular/router';
import { CategoryCreateComponent } from './screens/create/category-create.component';

export const categoryRoutes: Routes = [
  {
    path: 'list',
    loadComponent: () =>
      import('./screens/list/category-list.component').then(
        m => m.CategoryListComponent
      ),
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

// Category Dialog Routes
export const dialogCategoryRoutes: Routes = [
  {
    path: 'categories',
    children: [
      {
        path: 'new',
        component: CategoryCreateComponent,
      },
      {
        path: ':id',
        component: CategoryCreateComponent,
      },
    ],
  },
];
