import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from './user.component';
import { UserListComponent } from './screens/user-list/user-list.component';

const routes: Routes = [
  {
    path: '',
    component: UserComponent,
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
  declarations: [UserComponent],
})
export class UserModule {}
