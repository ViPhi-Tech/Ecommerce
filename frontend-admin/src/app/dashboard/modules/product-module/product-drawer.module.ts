import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ProductCreateComponent } from './screens/create/product-create.component';

const routes: Routes = [
  {
    path: 'new',
    component: ProductCreateComponent,
    data: { title: 'Cadastro de produto', animation: 'new-product' },
  },
  {
    path: ':id',
    component: ProductCreateComponent,
    data: { title: 'Editar produto', animation: 'edit-product' },
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  declarations: [],
})
export class ProductDrawerModule {}
