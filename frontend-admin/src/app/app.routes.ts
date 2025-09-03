import { Routes } from '@angular/router';
// import { isAuthGuard } from './shared/guards/is-auth.guard';
import { dialogCategoryRoutes } from './dashboard/modules/category-module/category.routing';
import { dialogClientRoutes } from './dashboard/modules/client-module/client.routing';
import { dialogSupplierRoutes } from './dashboard/modules/supplier-module/supplier.routing';
import { dialogStockMovementRoutes } from './dashboard/modules/stock-movement-module/stock-movement.routing';
import { dialogAccountsPayableRoutes } from './dashboard/modules/accounts-payable-module/accounts-payable.routing';
import { dialogAccountsReceivableRoutes } from './dashboard/modules/accounts-receivable-module/accounts-receivable.routing';
import { dialogOrderRoutes } from './dashboard/modules/order-module/order.routing';
import { dialogUserRoutes } from './dashboard/modules/user-module/user.routing';
import { dialogProductRoutes } from './dashboard/modules/product-module/product.routing';

// Combined dialog routes
export const dialogRoutes: Routes = [
  ...dialogCategoryRoutes,
  ...dialogClientRoutes,
  ...dialogSupplierRoutes,
  ...dialogStockMovementRoutes,
  ...dialogAccountsPayableRoutes,
  ...dialogAccountsReceivableRoutes,
  ...dialogOrderRoutes,
  ...dialogUserRoutes,
  ...dialogProductRoutes,
];

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
  // dialogs - drawer principal
  {
    path: '',
    loadChildren: () =>
      import('app/shared/modules/dialogs/dialogs.module').then(
        m => m.DialogsModule
      ),
    outlet: 'drawer',
  },
  // dialogs - drawer auxiliar (overlay sobre o drawer principal)
  {
    path: '',
    loadChildren: () =>
      import('app/shared/modules/dialogs/dialogs.module').then(
        m => m.DialogsModule
      ),
    outlet: 'drawerAux',
  },
];
