import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { BaseCreateComponent } from './screens/base-create/base-create.component';

const routes: Routes = [
  {
    path: 'new',
    component: BaseCreateComponent,
    data: { title: 'Cadastro de base', animation: 'new-base' },
  },
  {
    path: ':id',
    component: BaseCreateComponent,
    data: { title: 'Editar base', animation: 'edit-base' },
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  declarations: [],
})
export class BaseDrawerModule {}
