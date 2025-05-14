import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfigComponent } from './config.component';

const routes: Routes = [
  {
    path: '',
    component: ConfigComponent,
    children: [
        {
        path: 'products',
        loadChildren: () =>
          import('./screens/product-module/product.module').then(
            m => m.ProductModule
          ),
      },
      {
        path: 'categories',
        loadChildren: () =>
          import('./screens/category-module/category.module').then(
            m => m.CategoryModule
          ),
      },
      {
        path: 'invoices',
        loadChildren: () =>
          import('./screens/invoice-module/invoice.module').then(
            m => m.InvoiceModule
          ),
      },

      {
        path: 'users',
        loadChildren: () =>
          import('./screens/user-module/user.module').then(m => m.UserModule),
      },

      {
        path: 'discount-tickets',
        loadChildren: () =>
          import(
            './screens/discount-ticket-module/discount-ticket.module'
          ).then(m => m.DiscountTicketModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule, RouterModule.forChild(routes)],
  declarations: [ConfigComponent],
})
export class ConfigModule {}
