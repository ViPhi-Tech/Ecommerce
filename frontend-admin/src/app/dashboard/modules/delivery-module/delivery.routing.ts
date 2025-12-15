import { Routes } from '@angular/router';

export const deliveryRoutes: Routes = [
  {
    path: 'list',
    loadComponent: () =>
      import('./screens/delivery-list/delivery-list.component').then(
        m => m.DeliveryListComponent
      ),
    data: {
      title: ['Dashboard', 'Lista de Entregas'],
    },
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./screens/delivery-create/delivery-create.component').then(
        m => m.DeliveryCreateComponent
      ),
    data: {
      title: ['Dashboard', 'Nova Entrega'],
    },
  },
  {
    path: ':id/view',
    loadComponent: () =>
      import('./screens/delivery-view/delivery-view.component').then(
        m => m.DeliveryViewComponent
      ),
    data: {
      title: ['Dashboard', 'Visualizar Entrega'],
    },
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./screens/delivery-create/delivery-create.component').then(
        m => m.DeliveryCreateComponent
      ),
    data: {
      title: ['Dashboard', 'Editar Entrega'],
    },
  },
  {
    path: ':id/route',
    loadComponent: () =>
      import('./screens/delivery-route/delivery-route.component').then(
        m => m.DeliveryRouteComponent
      ),
    data: {
      title: ['Dashboard', 'Rota de Entrega'],
    },
  },
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  },
];

