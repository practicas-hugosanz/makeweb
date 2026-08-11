import { Routes } from '@angular/router';
import { SeoData } from './core/seo';
import { Home } from './pages/home/home';

/**
 * Cada ruta declara su propio SEO en `data.seo`, y `SeoStrategy` lo escribe en
 * la cabecera durante el prerenderizado. Añadir una página es añadir aquí su
 * descripción y su ruta canónica, y la línea correspondiente en
 * `public/sitemap.xml`.
 *
 * Las descripciones son distintas a propósito: repetir una sola en todas las
 * páginas hace que Google se invente el fragmento del resultado por su cuenta.
 */
export const routes: Routes = [
  {
    path: '',
    component: Home,
    title: 'MakeWeb — Webs para negocios locales que aparecen primero',
    data: {
      seo: {
        path: '',
        description:
          'Estudio web en remoto para negocios locales de toda España. Webs rápidas, medibles y preparadas para SEO local: más llamadas, más reservas, más clientes.',
        schema: 'faq',
      } satisfies SeoData,
    },
  },
  {
    path: 'precios',
    loadComponent: () => import('./pages/pricing/pricing-page').then((m) => m.PricingPage),
    title: 'Precios de una web para tu negocio, desde 350 € — MakeWeb',
    data: {
      seo: {
        path: '/precios',
        // 154 caracteres: por encima de ~160 Google la corta a mitad de frase, y
        // esta acababa justo en el argumento de venta.
        description:
          'Cuánto cuesta la web de un negocio local: desde 350 € la esencial, desde 450 € con animaciones y desde 1.000 € con citas. Precio cerrado antes de empezar.',
        schema: 'offers',
      } satisfies SeoData,
    },
  },
  {
    path: 'aviso-legal',
    // Las páginas legales se visitan poco: no tienen por qué viajar en el
    // bundle inicial junto con la portada.
    loadComponent: () => import('./pages/legal/notice/notice').then((m) => m.LegalNotice),
    title: 'Aviso legal — MakeWeb',
    data: {
      seo: {
        path: '/aviso-legal',
        description:
          'Datos identificativos de MakeWeb, condiciones de uso de la web y régimen de responsabilidad, conforme al artículo 10 de la LSSI-CE.',
      } satisfies SeoData,
    },
  },
  {
    path: 'privacidad',
    loadComponent: () => import('./pages/legal/privacy/privacy').then((m) => m.Privacy),
    title: 'Política de privacidad — MakeWeb',
    data: {
      seo: {
        path: '/privacidad',
        description:
          'Qué datos recogemos en MakeWeb, para qué los usamos, cuánto los guardamos y cómo ejercer tus derechos de acceso, rectificación y supresión.',
      } satisfies SeoData,
    },
  },
  {
    path: 'cookies',
    loadComponent: () => import('./pages/legal/cookies/cookies').then((m) => m.Cookies),
    title: 'Política de cookies — MakeWeb',
    data: {
      seo: {
        path: '/cookies',
        description:
          'Qué cookies usa makeweb.es, para qué sirve cada una, cuánto duran y cómo cambiar tu decisión en cualquier momento.',
      } satisfies SeoData,
    },
  },
  {
    path: '404',
    loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFound),
    title: 'Página no encontrada — MakeWeb',
    data: {
      // `noindex, follow`: la página no vale nada en el índice, pero los
      // enlaces que lleva sí deben seguirse hasta el contenido bueno.
      seo: {
        path: '/404',
        description: 'La página que buscabas no existe o ha cambiado de dirección.',
        noindex: true,
      } satisfies SeoData,
    },
  },
  // Sin `redirectTo`: una dirección rota debe decir que está rota, no fingir
  // que es la portada. El hosting debe servir /404/index.html con estado 404.
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFound),
    title: 'Página no encontrada — MakeWeb',
    data: {
      seo: {
        path: '/404',
        description: 'La página que buscabas no existe o ha cambiado de dirección.',
        noindex: true,
      } satisfies SeoData,
    },
  },
];
