import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from './user.component';
import { UserListComponent } from './screens/user-list/user-list.component';
import { UserState } from './user.state';
import { UserService } from './user.service';

const routes: Routes = [
  {
    path: '',
    component: UserComponent,
    children: [
      {
        path: 'list',
        component: UserListComponent,
        data: {
          title: ['Dashboard', 'Lista de usuários'],
        },
      },
      {
        path: 'new',
        loadComponent: () =>
          import('./screens/user-create/user-create.component').then(
            m => m.UserCreateComponent
          ),
      },
      {
        path: 'edit/:id',
        loadComponent: () =>
          import('./screens/user-create/user-create.component').then(
            m => m.UserCreateComponent
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
  declarations: [UserComponent],
  providers: [UserState, UserService],
})
export class UserModule {}
