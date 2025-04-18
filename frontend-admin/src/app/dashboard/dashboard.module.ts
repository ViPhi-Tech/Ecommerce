import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { RouterModule, Routes } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { LogoComponent } from './components/logo/logo.component';
import { isAuthGuard } from '../shared/guards/is-auth.guard';

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
        path: 'orders',
        loadChildren: () =>
          import('./modules/order-module/order-module.module').then(
            m => m.OrderModuleModule
          ),
      },
      {
        path: 'products',
        loadChildren: () =>
          import('./modules/product-module/product-module.module').then(
            m => m.ProductModuleModule
          ),
      },
      {
        path: 'categories',
        loadChildren: () =>
          import('./modules/category-module/category-module.module').then(
            m => m.CategoryModuleModule
          ),
      },
      {
        path: 'invoices',
        loadChildren: () =>
          import('./modules/invoice-module/invoice-module.module').then(
            m => m.InvoiceModuleModule
          ),
      },

      {
        path: 'users',
        loadChildren: () =>
          import('./modules/user-module/user-module.module').then(
            m => m.UserModuleModule
          ),
      },

      {
        path: 'discount-tickets',
        loadChildren: () =>
          import(
            './modules/discount-ticket-module/discount-ticket-module.module'
          ).then(m => m.DiscountTicketModule),
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
