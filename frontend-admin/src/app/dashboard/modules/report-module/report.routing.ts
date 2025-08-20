import { Routes } from '@angular/router';

export const reportRoutes: Routes = [
  {
    path: 'list',
    loadComponent: () =>
      import('./screens/list/report-list.component').then(
        m => m.ReportListComponent
      ),
  },
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  },
];
