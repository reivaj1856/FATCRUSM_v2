import { Routes } from '@angular/router';

export default [
  {
    path: 'home',
    loadComponent: () =>
      import('./home/home.component').then(m => m.HomeComponent),
  },

  {
        path: 'producEdit/:id',
        loadComponent: () => import('./homeproduct/homeproduct.component').then(m => m.HomeproductComponent),
    },
  {
    path: 'pedido',
    loadComponent: () =>
      import('./pedido/pedido.component').then(m => m.PedidoComponent),
  },
  {
    path: 'ofertas',
    loadComponent: () =>
      import('./ofertas/ofertas.component').then(m => m.OfertasComponent),
  },
  {
    path: 'novedades',
    loadComponent: () =>
      import('./novedades/novedades.component').then(m => m.NovedadesComponent),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'home',
  },
] as Routes;
