import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserModuleComponent } from './user-module.component';
import { UserListComponent } from './screens/user-list/user-list.component';

const routes: Routes = [
  {
    path: '',
    component: UserModuleComponent,
    children: [
      {
        path: 'list',
        component: UserListComponent,
        data: {
          breadcrumb: ['Dashboard', 'Lista de usuários'],
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
  declarations: [UserModuleComponent],
})
export class UserModuleModule {}
