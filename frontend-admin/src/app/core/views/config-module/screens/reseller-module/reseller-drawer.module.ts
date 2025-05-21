import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ProductCreateComponent } from './screens/reseller-create/product-create.component';

const routes: Routes = [
  {
    path: 'new',
    component: ProductCreateComponent,
    data: { title: 'Cadastro de produto' },
  },
  {
    path: ':id',
    component: ProductCreateComponent,
    data: { title: 'Editar produto' },
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  declarations: [],
})
export class ResellerDrawerModule {}
