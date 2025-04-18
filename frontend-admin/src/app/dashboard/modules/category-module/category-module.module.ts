import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryModuleComponent } from './category-module.component';
import { CategoryListComponent } from './screens/category-list/category-list.component';

const routes: Routes = [
  {
    path: '',
    component: CategoryModuleComponent,
    children: [
      {
        path: 'list',
        component: CategoryListComponent,
        data: {
          breadcrumb: ['Dashboard', 'Lista de categorias'],
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
  declarations: [CategoryModuleComponent],
})
export class CategoryModuleModule {}
