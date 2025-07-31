import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { RouterModule, Routes } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { LogoComponent } from './components/logo/logo.component';
import { isAuthGuard } from 'app/shared/guards/is-auth.guard';
import { categoryRoutes } from './modules/category-module/category.routing';
import { productRoutes } from './modules/product-module/product.routing';
import { userRoutes } from './modules/user-module/user.routing';
import { orderRoutes } from './modules/order-module/order.routing';
import { invoiceRoutes } from './modules/invoice-module/invoice.routing';
import { accountsPayableRoutes } from './modules/accounts-payable-module/accounts-payable.routing';
import { accountsReceivableRoutes } from './modules/accounts-receivable-module/accounts-receivable.routing';
import { stockMovementRoutes } from './modules/stock-movement-module/stock-movement.routing';
import { customizationRoutes } from './modules/customization/customization.routing';
import { clientRoutes } from './modules/client-module/client.routing';
import { supplierRoutes } from './modules/supplier-module/supplier.routing';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canActivate: [isAuthGuard],
    data: {
      breadcrumb: 'Dashboard',
    },
    children: [
      {
        path: 'customization',
        children: customizationRoutes,
        data: { animation: 'customization' },
      },
      {
        path: 'orders',
        children: orderRoutes,
      },
      {
        path: 'products',
        children: productRoutes,
      },
      {
        path: 'stock-movements',
        children: stockMovementRoutes,
        data: { animation: 'stock-movements' },
      },
      {
        path: 'categories',
        children: categoryRoutes,
      },
      {
        path: 'clients',
        children: clientRoutes,
        data: { animation: 'clients' },
      },
      {
        path: 'suppliers',
        children: supplierRoutes,
        data: { animation: 'suppliers' },
      },
      {
        path: 'invoices',
        children: invoiceRoutes,
      },

      {
        path: 'users',
        children: userRoutes,
      },
      {
        path: 'config',
        loadChildren: () =>
          import('app/core/views/config-module/config.module').then(
            m => m.ConfigModule
          ),
      },
      {
        path: 'accounts-payable',
        children: accountsPayableRoutes,
        data: { animation: 'accounts-payable' },
      },
      {
        path: 'accounts-receivable',
        children: accountsReceivableRoutes,
        data: { animation: 'accounts-receivable' },
      },
      {
        path: '**',
        redirectTo: 'orders',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    RouterModule.forChild(routes),

    // components
    SidebarComponent,
    HeaderComponent,
    LogoComponent,
  ],
  declarations: [DashboardComponent],
})
export class DashboardModule {}
