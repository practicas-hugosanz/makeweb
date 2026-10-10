import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LOCAL_AREAS, LOCAL_FAQS, LOCAL_STATS } from '../../data/local';
import { SERVICE_PAGES } from '../../data/services';
import { CtaCard } from '../../sections/cta-card/cta-card';
import { Footer } from '../../sections/footer/footer';
import { PageHero } from '../../sections/page-hero/page-hero';
import { Process } from '../../sections/process/process';

/**
 * Diseño web en Alicante: la página local del estudio.
 *
 * Usa la misma estructura y los mismos estilos que las páginas de servicio
 * (datos, lista, preguntas), para que se lea como parte de la web y no como
 * una página de aterrizaje pegada. El contenido sale de `data/local.ts`.
 */
@Component({
  selector: 'mw-local-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, PageHero, CtaCard, Footer, Process],
  template: `
    <main id="contenido">
      <mw-page-hero
        crumb="Diseño web en Alicante"
        i18n-crumb
        i18n-lead
        lead="Somos un estudio de diseño y desarrollo web en Mutxamel, al lado de Alicante. Hacemos webs a medida para comercios, restaurantes, clínicas y negocios de servicios de la provincia, con precio cerrado y en una semana."
      >
        <span title i18n>Diseño web en Alicante, <em>sin plantillas.</em></span>
      </mw-page-hero>

      <section class="sp-stats shell">
        @for (stat of stats; track stat.title) {
          <div class="sp-stat">
            <p class="sp-stat__value">{{ stat.value }}</p>
            <h2 class="sp-stat__title">{{ stat.title }}</h2>
            <p class="sp-stat__body">{{ stat.body }}</p>
          </div>
        }
      </section>

      <!-- Cómo se busca un negocio local: el porqué de hacer web y ficha de
           Google a la vez. -->
      <section class="sec shell lp-search">
        <div class="sec-head sec-head--split">
          <h2 class="sec-title" i18n>Así te buscan <em>en Alicante.</em></h2>
          <div class="lp-search__copy">
            <p class="sec-lead" i18n>
              Quien necesita un dentista, una peluquería o un sitio para cenar lo busca en el móvil y
              con prisa: «peluquería en San Vicente», «restaurante cerca de mí», «fisioterapeuta
              Alicante centro».
            </p>
            <p class="sec-lead" i18n>
              Google enseña primero el mapa con las fichas de empresa y, debajo, las webs que cargan
              rápido y responden a lo que se busca. Por eso trabajamos las dos cosas juntas: una web
              rápida y clara, y tu ficha de Google completa y enlazada con ella.
            </p>
          </div>
        </div>
      </section>

      <section class="sec shell sp-offers">
        <h2 class="sec-title" i18n>Lo que hacemos <em>para negocios</em> de Alicante.</h2>

        <ol class="sp-offers__list">
          @for (page of services; track page.slug; let i = $index) {
            <li class="sp-offer">
              <span class="sp-offer__num">{{ pad(i + 1) }}</span>
              <h3 class="sp-offer__title">
                <a class="lp-link" [routerLink]="'/servicios/' + page.slug">{{ page.name }}</a>
              </h3>
              <p class="sp-offer__body">{{ page.service.title }}</p>
            </li>
          }
        </ol>
      </section>

      <section class="sec shell lp-areas">
        <div class="sec-head sec-head--split">
          <h2 class="sec-title" i18n>Dónde <em>trabajamos.</em></h2>
          <p class="sec-lead" i18n>
            En Alicante y alrededores, y en remoto en el resto de España. Si tu negocio está en la
            provincia, nos podemos ver para arrancar.
          </p>
        </div>

        <ul class="lp-areas__list">
          @for (area of areas; track area) {
            <li>{{ area }}</li>
          }
          <li class="lp-areas__more" i18n>y toda España</li>
        </ul>
      </section>

      <mw-process />

      <section class="sec shell sp-faq">
        <h2 class="sec-title" i18n>Tus <em>preguntas.</em></h2>

        <div class="sp-faq__list">
          @for (item of faqs; track item.q) {
            <details class="sp-q">
              <summary>
                {{ item.q }}
                <span class="sp-q__sign" aria-hidden="true"></span>
              </summary>
              <p>{{ item.a }}</p>
            </details>
          }
        </div>
      </section>

      <mw-cta-card title="hablemos de tu web." i18n-title [links]="links" />
    </main>

    <mw-footer />
  `,
  styleUrls: ['../service/service-page.scss', './local-page.scss'],
})
export class LocalPage {
  protected readonly stats = LOCAL_STATS;
  protected readonly areas = LOCAL_AREAS;
  protected readonly faqs = LOCAL_FAQS;
  protected readonly services = SERVICE_PAGES;
  protected readonly links = [
    { label: $localize`Ver los precios`, sub: $localize`Tres formas de hacerlo, con su horquilla real`, link: '/precios' },
    { label: $localize`SEO local`, sub: $localize`Que te encuentren cuando buscan cerca`, link: '/servicios/seo-local' },
  ];

  protected pad(n: number): string {
    return String(n).padStart(2, '0');
  }
}
