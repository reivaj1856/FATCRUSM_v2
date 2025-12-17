import { Routes } from "@angular/router";

export default [
    
    {
        path: '',
        loadComponent: () => import('./layout/layout').then(m => m.default),
        children: [
            {
                path: 'dashboard', 
                loadComponent: () => import('../private/business/dashboard/dashboard').then(m => m.default),
                data: { title: 'Mi empresa' } },
            {
                path: 'profile',
                loadComponent: () => import('../private/business/profile/profile').then(m => m.default),
                data: { title: 'Perfil' } },
            {
                path: 'costura',
                loadChildren: () => import('./business/costura/costura.routes'),             
            },
            {
                path: 'especialidades',
                loadChildren: () => import('./business/especialidades/especialidades.routes'),             
                data: { title: 'Servicios' } 
            },
            {
                path: 'inventario',
                loadComponent: () => import('./business/inventario/inventario.component').then(m => m.default),             
                data: { title: 'Inventario' }
            },
            {
                path: 'publicidad',
                loadComponent: () => import('./business/publicidad/publicidad.component').then(m => m.default),             
                data: { title: 'Publicidad' } },
            {
                path: 'cotizaciones',
                loadComponent: () => import('./business/cotizacion/cotizacion.component').then(m => m.default),             
                data: { title: 'Cotizaciones' } },
            {
                path: 'tallas',
                loadComponent: () => import('./business/tallaslist/tallaslist.component').then(m => m.default),             
                data: { title: 'Tallas' } },
            {
                path: 'homepage',
                loadComponent: () => import('./business/homepage/homepage.component').then(m => m.default),             
            },
            {
                path:'',
                redirectTo:'homepage',
                pathMatch:'full'
            },
        ]
    },
    
] as Routes