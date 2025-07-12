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
      import('app/dashboard/modules/import-module/import-drawer.module').then(
        m => m.ImportDrawerModule
      ),
    outlet: 'drawer',
    data: { animation: 'import' },
  },
  {
    path: 'products',
    loadChildren: () =>
      import('app/dashboard/modules/product-module/product-drawer.module').then(
        m => m.ProductDrawerModule
      ),
    outlet: 'drawer',
    data: { animation: 'products' },
  },

  {
    path: 'invoices',
    loadChildren: () =>
      import('app/dashboard/modules/invoice-module/invoice-drawer.module').then(
        m => m.InvoiceDrawerModule
      ),
    outlet: 'drawer',
    data: { animation: 'invoices' },
  },

  {
    path: 'accounts-payable',
    loadChildren: () =>
      import(
        'app/dashboard/modules/accounts-payable-module/accounts-payable-drawer.module' // Adjust the path as necessary
      ).then(m => m.AccountsPayableDrawerModule),
    outlet: 'drawer',
    data: { animation: 'accounts-payable' },
  },

  // dialogs
  {
    path: '',
    loadChildren: () =>
      import('app/shared/modules/dialogs/dialogs.module').then(
        m => m.DialogsModule
      ),
    outlet: 'drawer',
  },
];
