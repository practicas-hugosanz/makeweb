import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRouteSnapshot, RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { FAQS, PLANS } from '../data/content';
import { LEGAL } from '../data/legal';

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
  /** Qué datos estructurados lleva esta página, y solo esta. */
  schema?: 'faq' | 'offers';
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

  override updateTitle(snapshot: RouterStateSnapshot): void {
    const title = this.buildTitle(snapshot) ?? LEGAL.brand;
    const seo = this.deepestSeo(snapshot.root);

    this.title.setTitle(title);

    // Sin `data` de SEO no se toca nada heredado: es preferible el valor de
    // `index.html` a una etiqueta a medias.
    if (!seo) return;

    const url = this.absolute(seo.path);

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

    this.setCanonical(url);
    this.setJsonLd(seo);
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

  /** Absoluta y sin barra final, salvo la portada, que la lleva. */
  private absolute(path: string): string {
    return path ? `${LEGAL.site}/${path.replace(/^\/+|\/+$/g, '')}` : `${LEGAL.site}/`;
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
   * Un solo bloque JSON-LD por página, el que le corresponde.
   *
   * `Organization` se queda en `index.html` porque es cierto en todas; lo que
   * se monta aquí es lo que solo vale donde está el contenido: las preguntas en
   * la portada y las horquillas de precio en `/precios`. Declarar un `FAQPage`
   * en una página sin preguntas visibles es motivo de acción manual de Google.
   */
  private setJsonLd(seo: SeoData): void {
    const id = 'seo-jsonld';
    const existing = this.doc.getElementById(id);
    const graph = seo.schema === 'faq' ? faqSchema() : seo.schema === 'offers' ? offerSchema() : null;

    if (!graph) {
      existing?.remove();
      return;
    }

    const script = existing ?? this.doc.createElement('script');
    script.id = id;
    script.setAttribute('type', 'application/ld+json');
    script.textContent = JSON.stringify(graph);
    if (!existing) this.doc.head.appendChild(script);
  }
}

/**
 * Las mismas preguntas que se ven en la portada, en el formato que Google
 * entiende. Salen de `FAQS`, así que no hay una segunda copia que actualizar:
 * el marcado y lo que lee el visitante no se pueden separar.
 */
function faqSchema(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((faq) => ({
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
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: PLANS.map((plan, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Service',
        name: `${LEGAL.brand} ${plan.name}`,
        serviceType: plan.kind,
        description: plan.pitch,
        provider: { '@type': 'Organization', name: LEGAL.brand, url: LEGAL.site },
        areaServed: { '@type': 'Country', name: 'España' },
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
