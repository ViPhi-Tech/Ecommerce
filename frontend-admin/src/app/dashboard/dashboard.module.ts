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
        path: 'customization',
        loadChildren: () =>
          import('./modules/customization/customization.module').then(
            m => m.CustomizationModule
          ),
      },
      {
        path: 'orders',
        loadChildren: () =>
          import('./modules/order-module/order.module').then(
            m => m.OrderModule
          ),
      },
      {
        path: 'products',
        loadChildren: () =>
          import('./modules/product-module/product.module').then(
            m => m.ProductModule
          ),
      },
      {
        path: 'categories',
        loadChildren: () =>
          import('./modules/category-module/category.module').then(
            m => m.CategoryModule
          ),
      },
      {
        path: 'invoices',
        loadChildren: () =>
          import('./modules/invoice-module/invoice.module').then(
            m => m.InvoiceModule
          ),
      },

      {
        path: 'users',
        loadChildren: () =>
          import('./modules/user-module/user.module').then(m => m.UserModule),
      },

      {
        path: 'discount-tickets',
        loadChildren: () =>
          import(
            './modules/discount-ticket-module/discount-ticket.module'
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
