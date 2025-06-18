import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfigComponent } from './config.component';
import { CardItemComponent } from 'app/shared/components/card-item/card-item.component';

const routes: Routes = [
  {
    path: '',
    component: ConfigComponent,
  },
  {
    path: 'products',
    loadChildren: () =>
      import('./screens/product-module/product.module').then(
        m => m.ProductModule
      ),
    data: { animation: 'products' },
  },
  {
    path: 'categories',
    loadChildren: () =>
      import('./screens/category-module/category.module').then(
        m => m.CategoryModule
      ),
    data: { animation: 'categories' },
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
];

@NgModule({
  imports: [RouterModule, RouterModule.forChild(routes), CardItemComponent],
  declarations: [ConfigComponent],
})
export class ConfigModule {}
