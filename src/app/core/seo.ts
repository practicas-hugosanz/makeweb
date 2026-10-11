import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRouteSnapshot, RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { FAQS, Faq, PLANS } from '../data/content';
import { LEGAL, PHONES } from '../data/legal';
import { LOCAL_FAQS } from '../data/local';
import { SERVICE_PAGES } from '../data/services';
import { LANGUAGES, currentLanguage, localizedPath } from './i18n';
import { withSlash } from './trailing-slash';

/**
 * Lo que cada ruta declara sobre sí misma de cara a los buscadores. Va en el
 * `data` de la ruta para que título, descripción y canónica se escriban en el
 * mismo sitio y no puedan desincronizarse.
 */
export interface SeoData {
  /** Ruta canónica con barra inicial; la portada es ''. */
  path: string;
  /** 150-160 caracteres. Google la reescribe a menudo, pero es el punto de partida. */
  description: string;
  /** Fuera del índice. Solo la 404: una página de error no debe posicionar. */
  noindex?: boolean;
  /**
   * El nombre de la página en las migas de pan, el mismo que se ve en su
   * cabecera. Sin él (la portada) no se declaran migas.
   */
  crumb?: string;
  /** Qué datos estructurados propios lleva esta página, además de los comunes. */
  schema?: 'faq' | 'offers' | 'service' | 'local';
  /** En las páginas de servicio, cuál es. */
  service?: string;
}

/**
 * Título, descripción, canónica, Open Graph y datos estructurados, por página.
 *
 * Va como `TitleStrategy` y no como una suscripción a `NavigationEnd` porque el
 * enrutador la llama en cada navegación **y también durante el renderizado en
 * servidor**. Eso es justo lo que hace falta: el HTML prerenderizado es el que
 * lee el buscador, así que las etiquetas tienen que estar escritas antes de que
 * se serialice la página, no después de hidratar.
 *
 * Antes de esto todas las páginas heredaban las etiquetas de `index.html`, con
 * la consecuencia grave de que la canónica de todas apuntaba a la portada:
 * `/precios` se declaraba a sí misma un duplicado de `/` y se quedaba fuera del
 * índice, justo la página que más se busca.
 */
@Injectable()
export class SeoStrategy extends TitleStrategy {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly doc = inject(DOCUMENT);
  private readonly lang = currentLanguage();

  override updateTitle(snapshot: RouterStateSnapshot): void {
    const title = this.buildTitle(snapshot) ?? LEGAL.brand;
    const seo = this.deepestSeo(snapshot.root);

    this.title.setTitle(title);

    // Sin `data` de SEO no se toca nada heredado: es preferible el valor de
    // `index.html` a una etiqueta a medias.
    if (!seo) return;

    const url = this.absolute(localizedPath(this.lang, seo.path || '/'));

    this.meta.updateTag({ name: 'description', content: seo.description });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: seo.description });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ name: 'twitter:title', content: title });
    this.meta.updateTag({ name: 'twitter:description', content: seo.description });

    // `noindex` se pone y se quita: al navegar de la 404 a otra página, dejarla
    // pegada sacaría del índice a la página buena.
    if (seo.noindex) {
      this.meta.updateTag({ name: 'robots', content: 'noindex, follow' });
    } else {
      this.meta.removeTag('name="robots"');
    }

    this.meta.updateTag({ property: 'og:locale', content: this.lang.og });
    this.meta.updateTag({
      property: 'og:image:alt',
      content: $localize`:@@seo.ogImageAlt:MakeWeb — webs para negocios locales`,
    });

    this.setCanonical(url);
    this.setAlternates(seo.path || '/', !!seo.noindex);
    this.setJsonLd(seo, url, title);
  }

  /** La ruta activa más profunda es la que manda; las padres solo son marco. */
  private deepestSeo(route: ActivatedRouteSnapshot): SeoData | undefined {
    let current: ActivatedRouteSnapshot | null = route;
    let found: SeoData | undefined;

    while (current) {
      found = (current.data['seo'] as SeoData | undefined) ?? found;
      current = current.firstChild;
    }

    return found;
  }

  /**
   * Absoluta y con barra final, como la sirve GitHub Pages: sin ella responde
   * con un 301, y una canónica que redirige es una señal contradictoria (ver
   * `trailing-slash.ts`).
   */
  private absolute(path: string): string {
    return `${LEGAL.site}${withSlash(path.startsWith('/') ? path : `/${path}`)}`;
  }

  /**
   * Una etiqueta `hreflang` por idioma, y `x-default` al castellano: así Google
   * sabe que `/precios`, `/en/precios` y `/fr/precios` son la misma página y
   * enseña a cada cual la suya. La 404 no lleva, porque no se indexa.
   */
  private setAlternates(path: string, noindex: boolean): void {
    this.doc.head.querySelectorAll('link[rel="alternate"][hreflang]').forEach((l) => l.remove());
    if (noindex) return;

    const add = (hreflang: string, href: string) => {
      const link = this.doc.createElement('link');
      link.setAttribute('rel', 'alternate');
      link.setAttribute('hreflang', hreflang);
      link.setAttribute('href', href);
      this.doc.head.appendChild(link);
    };

    for (const lang of LANGUAGES) add(lang.code, this.absolute(localizedPath(lang, path)));
    add('x-default', this.absolute(localizedPath(LANGUAGES[0], path)));
  }

  private setCanonical(url: string): void {
    let link = this.doc.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');

    if (!link) {
      link = this.doc.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.doc.head.appendChild(link);
    }

    link.setAttribute('href', url);
  }

  /**
   * Un solo bloque JSON-LD por página, con un `@graph`: la empresa y el sitio,
   * que son ciertos en todas; las migas de pan de las interiores; y lo que solo
   * vale donde está su contenido (las preguntas, los precios, el servicio).
   * Declarar un `FAQPage` en una página sin preguntas visibles es motivo de
   * acción manual de Google, así que cada bloque va solo donde se ve lo suyo.
   *
   * Antes la empresa iba fija en `index.html`, en castellano y sin dirección;
   * aquí sale en el idioma de cada página y con su zona de servicio.
   */
  private setJsonLd(seo: SeoData, url: string, title: string): void {
    const id = 'seo-jsonld';
    const existing = this.doc.getElementById(id);
    const home = this.absolute(localizedPath(this.lang, '/'));

    const graph: object[] = [organization(), website(this.lang.code, home)];
    if (seo.crumb && !seo.noindex) graph.push(breadcrumbs(home, seo.crumb, url));

    if (seo.schema === 'faq') graph.push(faqSchema(FAQS));
    if (seo.schema === 'offers') graph.push(offerSchema());
    if (seo.schema === 'service') {
      const page = SERVICE_PAGES.find((p) => p.slug === seo.service);
      if (page) {
        graph.push(serviceSchema(page.name, seo.description, url, SPAIN));
        graph.push(faqSchema(page.faqs));
      }
    }
    if (seo.schema === 'local') {
      graph.push(serviceSchema(seo.crumb ?? title, seo.description, url, ALICANTE));
      graph.push(faqSchema(LOCAL_FAQS));
    }

    const script = existing ?? this.doc.createElement('script');
    script.id = id;
    script.setAttribute('type', 'application/ld+json');
    script.textContent = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph });
    if (!existing) this.doc.head.appendChild(script);
  }
}

const ORG_ID = `${LEGAL.site}/#organization`;

/** Dónde se trabaja: la ciudad y la provincia, y el resto de España en remoto. */
const ALICANTE = [
  { '@type': 'City', name: 'Alicante' },
  { '@type': 'AdministrativeArea', name: $localize`Provincia de Alicante` },
];
const SPAIN = [...ALICANTE, { '@type': 'Country', name: $localize`España` }];

/**
 * El estudio. `ProfessionalService` es el tipo de negocio local que corresponde
 * a un estudio que presta servicios.
 *
 * La dirección va sin calle a propósito: es el domicilio fiscal y ahí no se
 * atiende público (lo dice `LEGAL.address`). Para un negocio que trabaja en una
 * zona y no recibe en un local, Google pide justo eso: localidad y zona de
 * servicio, no un portal al que nadie debe ir.
 */
function organization(): object {
  return {
    '@type': 'ProfessionalService',
    '@id': ORG_ID,
    name: LEGAL.brand,
    url: `${LEGAL.site}/`,
    logo: `${LEGAL.site}/brand/logotipo-entero.png`,
    image: `${LEGAL.site}/brand/og-cover.png`,
    description: $localize`Estudio de diseño, desarrollo web y software en Mutxamel (Alicante). Webs a medida, tiendas online, software e inteligencia artificial para negocios de Alicante y de toda España.`,
    email: LEGAL.email,
    telephone: PHONES[0].e164,
    priceRange: '€€',
    address: {
      '@type': 'PostalAddress',
      postalCode: '03110',
      addressLocality: 'Mutxamel',
      addressRegion: 'Alicante',
      addressCountry: 'ES',
    },
    areaServed: SPAIN,
    founder: LEGAL.owners.map((o) => ({ '@type': 'Person', name: o.name })),
    knowsLanguage: 'es',
    makesOffer: SERVICE_PAGES.map((p) => ({
      '@type': 'Offer',
      itemOffered: { '@type': 'Service', name: p.name, url: `${LEGAL.site}/servicios/${p.slug}/` },
    })),
    contactPoint: PHONES.map((p) => ({
      '@type': 'ContactPoint',
      contactType: 'customer service',
      telephone: p.e164,
      email: LEGAL.email,
      areaServed: 'ES',
      availableLanguage: 'es',
    })),
  };
}

/** El sitio, en el idioma de la página: así Google lo nombra «MakeWeb». */
function website(lang: string, home: string): object {
  return {
    '@type': 'WebSite',
    '@id': `${home}#website`,
    name: LEGAL.brand,
    url: home,
    inLanguage: lang,
    publisher: { '@id': ORG_ID },
  };
}

/** Las mismas migas que se ven en la cabecera de la página: Inicio › página. */
function breadcrumbs(home: string, crumb: string, url: string): object {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: $localize`Inicio`, item: home },
      { '@type': 'ListItem', position: 2, name: crumb, item: url },
    ],
  };
}

/** Un servicio concreto, prestado por el estudio, en su zona. */
function serviceSchema(name: string, description: string, url: string, area: object[]): object {
  return {
    '@type': 'Service',
    name,
    description,
    url,
    serviceType: name,
    provider: { '@id': ORG_ID },
    areaServed: area,
  };
}

/**
 * Las mismas preguntas que se ven en la página, en el formato que Google
 * entiende. Salen de los mismos datos que la plantilla, así que no hay una
 * segunda copia que actualizar: el marcado y lo que lee el visitante no se
 * pueden separar.
 */
function faqSchema(faqs: readonly Faq[]): object {
  return {
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  };
}

/**
 * Las tres horquillas de precio de `/precios`.
 *
 * `AggregateOffer` con `lowPrice` y `highPrice` es lo que corresponde a un
 * precio "desde": declarar `price` fijo sería decirle a Google una cifra
 * cerrada que luego no aparece en la página, y eso es lo que se penaliza.
 */
function offerSchema(): object {
  return {
    '@type': 'ItemList',
    itemListElement: PLANS.map((plan, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Service',
        name: `${LEGAL.brand} ${plan.name}`,
        serviceType: plan.kind,
        description: plan.pitch,
        provider: { '@id': ORG_ID },
        areaServed: SPAIN,
        offers: {
          '@type': 'AggregateOffer',
          priceCurrency: 'EUR',
          lowPrice: plan.from,
          highPrice: plan.to,
          availability: 'https://schema.org/InStock',
        },
      },
    })),
  };
}
