import { Routes } from "@angular/router";

export default [
  {
    path: '',
    loadComponent: () => import('./costura.component').then(m => m.default),
    children: [
      {
        path: 'pedidos',
        loadComponent: () =>
          import('../costura/pedidos/pedidos.component').then(m => m.default),
          data: { title: 'Historial de costura' } 
      },
      {
        path: 'tallas',
        loadComponent: () =>
          import('../tallaslist/tallaslist.component').then(m => m.default),
          data: { title: 'Medidas de costura' } 
      },
      {
        path: 'material',
        loadComponent: () =>
          import('../costura/material/material.component').then(m => m.default),
          data: { title: 'Inventario de material de costura' }
      },
      {
        path: 'estimado',
        loadComponent: () =>
          import('../costura/estimado/estimado.component').then(m => m.default),
          data: { title: 'Estimado de pedido de costura' }
      },
      {
        path: 'register',
        loadComponent: () =>
          import('../register-service/register-service.component').then(
            m => m.default // 👈 aquí
          ),
      },
      {
        path: 'edit',
        loadComponent: () =>
          import('../edit-service/edit-service.component').then(
            m => m.default // 👈 aquí
          ),
      },
      {
        path: '',
        redirectTo: 'pedidos',
        pathMatch: 'full',
      },
    ],
  },
] as Routes;
