import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard',
  },

  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
  },

  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboard/dashboard.module').then(m => m.DashboardModule),
  },

  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'dashboard',
  },

  // drawers
  {
    path: 'products',
    loadChildren: () =>
      import('./dashboard/modules/product-module/product-drawer.module').then(
        m => m.ProductDrawerModule
      ),
    outlet: 'drawer',
  },
  {
    path: 'categories',
    loadChildren: () =>
      import('./dashboard/modules/category-module/category-drawer.module').then(
        m => m.CategoryDrawerModule
      ),
    outlet: 'drawer',
  },
  {
    path: 'invoices',
    loadChildren: () =>
      import('./dashboard/modules/invoice-module/invoice-drawer.module').then(
        m => m.InvoiceDrawerModule
      ),
    outlet: 'drawer',
  },
  {
    path: 'users',
    loadChildren: () =>
      import('./dashboard/modules/user-module/user-drawer.module').then(
        m => m.UserDrawerModule
      ),
    outlet: 'drawer',
  },
  {
    path: 'discount-tickets',
    loadChildren: () =>
      import(
        './dashboard/modules/discount-ticket-module/discount-ticket-drawer.module'
      ).then(m => m.DiscountTicketDrawerModule),
    outlet: 'drawer',
  },
];
