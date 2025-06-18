import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductComponent } from './product.component';
import { ProductListComponent } from './screens/product-list/product-list.component';
import { ProductState } from './product.state';
import { ProductService } from './product.service';

const routes: Routes = [
  {
    path: '',
    component: ProductComponent,
    children: [
      {
        path: 'list',
        component: ProductListComponent,
        data: {
          title: ['Dashboard', 'Lista de produtos'],
        },
      },
      {
        path: 'new',
        loadComponent: () =>
          import('./screens/product-create/product-create.component').then(
            m => m.ProductCreateComponent
          ),
      },
      {
        path: 'edit/:id',
        loadComponent: () =>
          import('./screens/product-create/product-create.component').then(
            m => m.ProductCreateComponent
          ),
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
  providers: [ProductState, ProductService],
})
export class ProductModule {}
