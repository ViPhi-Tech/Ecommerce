import { Routes } from '@angular/router';
// import { isAuthGuard } from './shared/guards/is-auth.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard',
  },

  {
    path: 'auth',
    loadChildren: () =>
      import('app/core/auth/auth.module').then(m => m.AuthModule),
    data: { animation: 'auth' },
  },

  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboard/dashboard.module').then(m => m.DashboardModule),
    data: { animation: 'dashboard' },
  },

  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'dashboard',
  },
  // dialogs
  {
    path: '',
    loadChildren: () =>
      import('app/shared/modules/dialogs/dialogs.module').then(
        m => m.DialogsModule
      ),
    outlet: 'drawer',
  },
];
