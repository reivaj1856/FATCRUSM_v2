import { Routes } from "@angular/router";

export default [ 
    {
        path: 'home',
        loadComponent: () => import('./edit/edit.component'),
    },
    {
        path: 'producEdit/:id',
        loadComponent: () => import('./product-edit/product-edit.component').then(m => m.ProductEditComponent),
    },
    {
        path: 'test',
        loadComponent: () => import('./test/test.component').then(m => m.TestComponent),
    },
    {
        path: '**',
        redirectTo: 'home',
    },
]