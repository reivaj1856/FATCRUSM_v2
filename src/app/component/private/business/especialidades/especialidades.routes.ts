import { Routes } from "@angular/router";

export default [
    
    {
        path: '',
        loadComponent: () => import('./especialidades.component').then(m => m.default),
        children: [
            {
                path: 'sublimacion',
                loadComponent: () => import('../especialidades/sublimacion/sublimacion.component').then(m => m.default),
                data: { title: 'Servicios / Sublimacion' } 
            },
            {
                path: 'Vinilado',
                loadComponent: () => import('../especialidades/vinilado/vinilado.component').then(m => m.default),
                data: { title: 'Servicios / Vinilado' } 
            },
            {
                path: 'Bordado',
                loadComponent: () => import('../especialidades/bordados/bordados.component').then(m => m.default),
                data: { title: 'Servicios / Bordado' } 
            },
            {
                path: 'Otros',
                loadComponent: () => import('../especialidades/otro/otro.component').then(m => m.default),
                data: { title: 'Servicios ' } 
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
                path:'',
                redirectTo:'Otros',
                pathMatch:'full'
            },
        ]
    },
    
] as Routes