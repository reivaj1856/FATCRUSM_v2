import { Routes } from "@angular/router";

export default [
    
    {
        path: '',
        loadComponent: () => import('./layout/layout').then(m => m.default),
        children: [
            {
                path: 'dashboard',
                loadComponent: () => import('../private/business/dashboard/dashboard').then(m => m.default),
            },
            {
                path: 'profile',
                loadComponent: () => import('../private/business/profile/profile').then(m => m.default),
            },
            {
                path: 'costura',
                loadChildren: () => import('./business/costura/costura.routes'),             
            },
            {
                path: 'especialidades',
                loadChildren: () => import('./business/especialidades/especialidades.routes'),             
            },
            {
                path: 'inventario',
                loadComponent: () => import('./business/inventario/inventario.component').then(m => m.default),             
            },
            {
                path: 'cotizaciones',
                loadComponent: () => import('./business/cotizacion/cotizacion.component').then(m => m.default),             
            },
            {
                path: 'tallas',
                loadComponent: () => import('./business/tallaslist/tallaslist.component').then(m => m.default),             
            },
            {
                path:'',
                redirectTo:'dashboard',
                pathMatch:'full'
            },
        ]
    },
    
] as Routes