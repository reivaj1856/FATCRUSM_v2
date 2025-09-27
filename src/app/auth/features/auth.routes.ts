import { Routes } from "@angular/router";

export default [
    {
        path: 'login',
        loadComponent: () => import('./sign-in/sign-in.component'),
    },
    {
        path: 'register',
        loadComponent: () => import('./sign-up/sign-up.component'),
    },
    {
        path: 'forgot-password',
        loadComponent: () => import('./forgot-password/forgot-password.component'),
    },
    {
        path: '**',
        loadComponent: () => import('./sign-in/sign-in.component'),
    },

] as Routes;
