import { Routes } from '@angular/router';

export const schedulingRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./screens/calendar/scheduling-calendar.component').then(
        m => m.SchedulingCalendarComponent
      ),
    data: {
      title: ['Dashboard', 'Agendamento'],
    },
  },
];

