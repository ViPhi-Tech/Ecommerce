import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BaseComponent } from './base.component';
import { BaseState } from './base.state';
import { BaseService } from './base.service';
import { BaseListComponent } from './screens/base-list/base-list.component';

const routes: Routes = [
  {
    path: '',
    component: BaseComponent,
    children: [
      {
        path: 'list',
        component: BaseListComponent,
        data: {
          title: ['Dashboard', 'Lista de bases'],
        },
      },
      {
        path: 'new',
        loadComponent: () =>
          import('./screens/base-create/base-create.component').then(
            m => m.BaseCreateComponent
          ),
      },
      {
        path: 'edit/:id',
        loadComponent: () =>
          import('./screens/base-create/base-create.component').then(
            m => m.BaseCreateComponent
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
  declarations: [BaseComponent],
  providers: [BaseState, BaseService],
})
export class BaseModule {}
