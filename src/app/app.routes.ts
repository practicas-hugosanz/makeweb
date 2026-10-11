import { Routes } from '@angular/router';
import { SeoData } from './core/seo';
import { SERVICE_PAGES } from './data/services';
import { Home } from './pages/home/home';

/**
 * Cada ruta declara su propio SEO en `data.seo`, y `SeoStrategy` lo escribe en
 * la cabecera durante el prerenderizado. Añadir una página es añadir aquí su
 * descripción y su ruta canónica, y la línea correspondiente en
 * `public/sitemap.xml`.
 *
 * Las descripciones son distintas a propósito: repetir una sola en todas las
 * páginas hace que Google se invente el fragmento del resultado por su cuenta.
 *
 * Los títulos empiezan por lo que se busca («diseño web en Alicante», «precios
 * de diseño web»…) y acaban en la marca: Google corta hacia los 60 caracteres y
 * lo que se queda fuera es lo que menos importa. Las descripciones rondan los
 * 150-160.
 */
export const routes: Routes = [
  {
    path: '',
    component: Home,
    title: $localize`Diseño web, tiendas online y software en Alicante — MakeWeb`,
    data: {
      seo: {
        path: '',
        description:
          $localize`Estudio de diseño web y software en Alicante para negocios de toda España: webs a medida, tiendas online, software, inteligencia artificial y SEO local.`,
        schema: 'faq',
      } satisfies SeoData,
    },
  },
  {
    path: 'diseno-web-alicante',
    loadComponent: () => import('./pages/local/local-page').then((m) => m.LocalPage),
    title: $localize`Diseño web en Alicante: webs a medida desde 350 € — MakeWeb`,
    data: {
      seo: {
        path: '/diseno-web-alicante',
        description:
          $localize`Estudio de diseño web en Alicante (Mutxamel). Webs a medida para negocios de la provincia, con SEO local, precio cerrado desde 350 € y listas en una semana.`,
        crumb: $localize`Diseño web en Alicante`,
        schema: 'local',
      } satisfies SeoData,
    },
  },
  {
    path: 'precios',
    loadComponent: () => import('./pages/pricing/pricing-page').then((m) => m.PricingPage),
    title: $localize`Precios de diseño web en Alicante, desde 350 € — MakeWeb`,
    data: {
      seo: {
        path: '/precios',
        description:
          $localize`Cuánto cuesta una página web para tu negocio: desde 350 € la esencial, desde 450 € la profesional y desde 1.000 € con citas. Precio cerrado antes de empezar.`,
        crumb: $localize`Precios`,
        schema: 'offers',
      } satisfies SeoData,
    },
  },
  // Una ruta fija por servicio, generada desde los datos: así cada una lleva su
  // propio título y descripción, y el prerenderizado las encuentra sin tener
  // que enumerar parámetros.
  ...SERVICE_PAGES.map((page) => ({
    path: `servicios/${page.slug}`,
    loadComponent: () => import('./pages/service/service-page').then((m) => m.ServicePage),
    title: page.seoTitle,
    data: {
      slug: page.slug,
      seo: {
        path: `/servicios/${page.slug}`,
        description: page.seoDescription,
        crumb: page.name,
        schema: 'service',
        service: page.slug,
      } satisfies SeoData,
    },
  })),
  {
    path: 'estudio',
    loadComponent: () => import('./pages/studio/studio-page').then((m) => m.StudioPage),
    title: $localize`Estudio de diseño web en Mutxamel (Alicante) — MakeWeb`,
    data: {
      seo: {
        path: '/estudio',
        description:
          $localize`MakeWeb somos Hugo y Lucas, un estudio de Mutxamel (Alicante) que hace webs, tiendas online, software e IA desde cero para negocios de toda España.`,
        crumb: $localize`El estudio`,
      } satisfies SeoData,
    },
  },
  {
    path: 'proyectos',
    loadComponent: () => import('./pages/projects/projects-page').then((m) => m.ProjectsPage),
    title: $localize`Proyectos de diseño web para negocios locales — MakeWeb`,
    data: {
      seo: {
        path: '/proyectos',
        description:
          $localize`Webs a medida que hemos hecho para negocios locales. Los casos se publican con el permiso de cada cliente y con sus números.`,
        crumb: $localize`Proyectos`,
      } satisfies SeoData,
    },
  },
  {
    path: 'contacto',
    loadComponent: () => import('./pages/contact/contact-page').then((m) => m.ContactPage),
    title: $localize`Presupuesto de página web en Alicante y España — MakeWeb`,
    data: {
      seo: {
        path: '/contacto',
        description:
          $localize`Pide presupuesto para la web de tu negocio. Te respondemos en 24 horas con una propuesta: alcance, precio cerrado y fecha de entrega. Sin compromiso.`,
        crumb: $localize`Contacto`,
      } satisfies SeoData,
    },
  },
  {
    path: 'aviso-legal',
    // Las páginas legales se visitan poco: no tienen por qué viajar en el
    // bundle inicial junto con la portada.
    loadComponent: () => import('./pages/legal/notice/notice').then((m) => m.LegalNotice),
    title: $localize`Aviso legal — MakeWeb`,
    data: {
      seo: {
        path: '/aviso-legal',
        description:
          $localize`Datos identificativos de MakeWeb, condiciones de uso de la web y régimen de responsabilidad, conforme al artículo 10 de la LSSI-CE.`,
      } satisfies SeoData,
    },
  },
  {
    path: 'privacidad',
    loadComponent: () => import('./pages/legal/privacy/privacy').then((m) => m.Privacy),
    title: $localize`Política de privacidad — MakeWeb`,
    data: {
      seo: {
        path: '/privacidad',
        description:
          $localize`Qué datos recogemos en MakeWeb, para qué los usamos, cuánto los guardamos y cómo ejercer tus derechos de acceso, rectificación y supresión.`,
      } satisfies SeoData,
    },
  },
  {
    path: 'cookies',
    loadComponent: () => import('./pages/legal/cookies/cookies').then((m) => m.Cookies),
    title: $localize`Política de cookies — MakeWeb`,
    data: {
      seo: {
        path: '/cookies',
        description:
          $localize`Qué cookies usa makeweb.es, para qué sirve cada una, cuánto duran y cómo cambiar tu decisión en cualquier momento.`,
      } satisfies SeoData,
    },
  },
  {
    path: '404',
    loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFound),
    title: $localize`Página no encontrada — MakeWeb`,
    data: {
      // `noindex, follow`: la página no vale nada en el índice, pero los
      // enlaces que lleva sí deben seguirse hasta el contenido bueno.
      seo: {
        path: '/404',
        description: $localize`La página que buscabas no existe o ha cambiado de dirección.`,
        noindex: true,
      } satisfies SeoData,
    },
  },
  // Sin `redirectTo`: una dirección rota debe decir que está rota, no fingir
  // que es la portada. El hosting debe servir /404/index.html con estado 404.
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFound),
    title: $localize`Página no encontrada — MakeWeb`,
    data: {
      seo: {
        path: '/404',
        description: $localize`La página que buscabas no existe o ha cambiado de dirección.`,
        noindex: true,
      } satisfies SeoData,
    },
  },
];
