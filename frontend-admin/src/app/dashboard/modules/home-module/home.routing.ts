import { Routes } from '@angular/router';
import { HomeListComponent } from './list/home-list.component';

export const homeRoutes: Routes = [
  {
    path: '',
    component: HomeListComponent,
    data: { animation: 'home' },
  },
];
