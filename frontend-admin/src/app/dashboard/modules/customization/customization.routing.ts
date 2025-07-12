import { Routes } from '@angular/router';

export const customizationRoutes: Routes = [
  {
    path: 'home',
    loadComponent: () =>
      import('./home/home.component').then(m => m.HomeComponent),
    data: { animation: 'home' },
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
