import { Routes } from '@angular/router';
// import { isAuthGuard } from './shared/guards/is-auth.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard',
  },

  {
    path: 'auth',
    loadChildren: () =>
      import('app/core/auth/auth.module').then(m => m.AuthModule),
    data: { animation: 'auth' },
  },

  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboard/dashboard.module').then(m => m.DashboardModule),
    data: { animation: 'dashboard' },
  },

  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'dashboard',
  },

  // drawers
  {
    path: 'import',
    loadChildren: () =>
      import(
        'app/core/views/config-module/screens/import-module/import-drawer.module'
      ).then(m => m.ImportDrawerModule),
    outlet: 'drawer',
    data: { animation: 'import' },
  },
  {
    path: 'products',
    loadChildren: () =>
      import(
        'app/core/views/config-module/screens/product-module/product-drawer.module'
      ).then(m => m.ProductDrawerModule),
    outlet: 'drawer',
    data: { animation: 'products' },
  },
  {
    path: 'categories',
    loadChildren: () =>
      import(
        'app/core/views/config-module/screens/category-module/category-drawer.module'
      ).then(m => m.CategoryDrawerModule),
    outlet: 'drawer',
    data: { animation: 'categories' },
  },
  {
    path: 'invoices',
    loadChildren: () =>
      import(
        'app/core/views/config-module/screens/invoice-module/invoice-drawer.module'
      ).then(m => m.InvoiceDrawerModule),
    outlet: 'drawer',
    data: { animation: 'invoices' },
  },
  {
    path: 'users',
    loadChildren: () =>
      import(
        'app/core/views/config-module/screens/user-module/user-drawer.module'
      ).then(m => m.UserDrawerModule),
    outlet: 'drawer',
    data: { animation: 'users' },
  },
];
