import { Routes } from "@angular/router";

export default [
    {
        path: 'home',
        loadComponent: () => import('./home/home.component').then(m => m.default),
        data: { title: 'Servicios' } 
    },
    /* {
        path: 'homelist',
        loadComponent: () => import('./homelist/homelist.component').then(m => m.default  ),
    },
    {
        path: 'detalles/:id',
        loadComponent: () => import('./detalles/detalles.component').then(m => m.DetallesComponent),
    }, */
    {
        path: '',
        loadComponent: () => import('./home/home.component').then(m => m.default),
    },
] as Routes;
