import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CategoryCreateComponent } from './screens/category-create/category-create.component';

const routes: Routes = [
  {
    path: 'new',
    component: CategoryCreateComponent,
    data: { title: 'Cadastro de produto' },
  },
  {
    path: ':id',
    component: CategoryCreateComponent,
    data: { title: 'Editar produto' },
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  declarations: [],
})
export class CategoryDrawerModule {}
