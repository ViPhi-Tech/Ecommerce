import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductComponent } from './product.component';
import { ProductListComponent } from './screens/product-list/product-list.component';

const routes: Routes = [
  {
    path: '',
    component: ProductComponent,
    children: [
      {
        path: 'list',
        component: ProductListComponent,
        data: {
          breadcrumb: ['Dashboard', 'Lista de produtos'],
        },
      },
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule, RouterModule.forChild(routes)],
  declarations: [ProductComponent],
})
export class ProductModule {}
