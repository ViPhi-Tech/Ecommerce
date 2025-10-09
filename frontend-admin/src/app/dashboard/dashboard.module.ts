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
import { accountsPayableRoutes } from './modules/accounts-payable-module/accounts-payable.routing';
import { accountsReceivableRoutes } from './modules/accounts-receivable-module/accounts-receivable.routing';
import { stockMovementRoutes } from './modules/stock-movement-module/stock-movement.routing';
import { clientRoutes } from './modules/client-module/client.routing';
import { supplierRoutes } from './modules/supplier-module/supplier.routing';
import { homeRoutes } from './modules/home-module/home.routing';
import { reportRoutes } from './modules/report-module/report.routing';
import { serviceOrderRoutes } from './modules/service-order-module/service-order.routing';
import { debtRoutes } from './modules/debt-module/debt.routing';

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
        path: '',
        children: homeRoutes,
        data: { animation: 'home' },
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
        path: 'service-orders',
        children: serviceOrderRoutes,
        data: { animation: 'service-orders' },
      },
      {
        path: 'reports',
        children: reportRoutes,
        data: { animation: 'reports' },
      },
      {
        path: 'debts',
        children: debtRoutes,
        data: { animation: 'debts' },
      },
      {
        path: '**',
        redirectTo: '',
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
