import { Routes } from '@angular/router';
import { TesteDialogComponent } from './teste-dialog/teste-dialog.component';

export const dialogTesteRoutes: Routes = [
  {
    path: 'teste',
    children: [
      {
        path: 'new',
        component: TesteDialogComponent,
      },
      {
        path: 'edit/:id',
        component: TesteDialogComponent,
      },
    ],
  },
];
