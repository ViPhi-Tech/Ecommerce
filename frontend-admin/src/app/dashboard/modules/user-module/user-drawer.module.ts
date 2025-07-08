import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { UserCreateComponent } from './screens/user-create/user-create.component';

const routes: Routes = [
  {
    path: 'new',
    component: UserCreateComponent,
    data: { title: 'Cadastro de usuário', animation: 'new-user' },
  },
  {
    path: 'edit/:id',
    component: UserCreateComponent,
    data: { title: 'Editar usuário', animation: 'edit-user' },
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  declarations: [],
})
export class UserDrawerModule {}
