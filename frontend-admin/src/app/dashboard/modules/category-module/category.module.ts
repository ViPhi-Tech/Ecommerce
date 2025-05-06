import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryComponent } from './category.component';
import { CategoryListComponent } from './screens/category-list/category-list.component';

const routes: Routes = [
  {
    path: '',
    component: CategoryComponent,
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
  declarations: [CategoryComponent],
})
export class CategoryModule {}
