import { Routes } from '@angular/router';
import { Home } from './pages/home/home';

export const routes: Routes = [
  {
    path: '',
    component: Home,
    title: 'MakeWeb — Webs para negocios locales que aparecen primero',
  },
  {
    path: 'precios',
    loadComponent: () => import('./pages/pricing/pricing-page').then((m) => m.PricingPage),
    title: 'Precios — MakeWeb',
  },
  {
    path: 'aviso-legal',
    // Las páginas legales se visitan poco: no tienen por qué viajar en el
    // bundle inicial junto con la portada.
    loadComponent: () => import('./pages/legal/notice/notice').then((m) => m.LegalNotice),
    title: 'Aviso legal — MakeWeb',
  },
  {
    path: 'privacidad',
    loadComponent: () => import('./pages/legal/privacy/privacy').then((m) => m.Privacy),
    title: 'Política de privacidad — MakeWeb',
  },
  {
    path: 'cookies',
    loadComponent: () => import('./pages/legal/cookies/cookies').then((m) => m.Cookies),
    title: 'Política de cookies — MakeWeb',
  },
  {
    path: '404',
    loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFound),
    title: 'Página no encontrada — MakeWeb',
  },
  // Sin `redirectTo`: una dirección rota debe decir que está rota, no fingir
  // que es la portada. El hosting debe servir /404/index.html con estado 404.
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFound),
    title: 'Página no encontrada — MakeWeb',
  },
];
