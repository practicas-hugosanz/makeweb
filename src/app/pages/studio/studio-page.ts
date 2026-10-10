import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CtaCard } from '../../sections/cta-card/cta-card';
import { Commitments } from '../../sections/commitments/commitments';
import { Footer } from '../../sections/footer/footer';
import { PageHero } from '../../sections/page-hero/page-hero';
import { Process } from '../../sections/process/process';

/**
 * Quiénes somos. Sin cita atribuida a nadie ni cifras de antigüedad: lo que se
 * cuenta aquí es lo que se puede comprobar, y lo que firmamos en cada proyecto.
 */
@Component({
  selector: 'mw-studio-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageHero, CtaCard, Footer, Commitments, Process],
  template: `
    <main id="contenido">
      <mw-page-hero
        crumb="El estudio"
        i18n-crumb
        i18n-lead
        lead="Somos Hugo y Lucas. Diseñamos y programamos cada web nosotros mismos, sin plantillas ni subcontratas, para negocios locales de toda España."
      >
        <span title i18n>Un estudio <em>pequeño</em> a propósito.</span>
      </mw-page-hero>

      <section class="st-facts shell">
        <div class="st-fact">
          <p class="st-fact__value">7</p>
          <p class="st-fact__body" i18n>días de la primera llamada a la web publicada</p>
        </div>
        <div class="st-fact">
          <p class="st-fact__value">2</p>
          <p class="st-fact__body" i18n>personas, las mismas de principio a fin</p>
        </div>
        <div class="st-fact">
          <p class="st-fact__value">0</p>
          <p class="st-fact__body" i18n>plantillas: cada web se escribe desde cero</p>
        </div>
        <div class="st-fact">
          <p class="st-fact__value">ES</p>
          <p class="st-fact__body" i18n>en remoto, para negocios de toda España</p>
        </div>
      </section>

      <!-- La forma de trabajar, dicha en una frase grande. -->
      <section class="st-quote">
        <div class="st-quote__card">
          <p class="st-quote__text" i18n>
            Antes de hablar de colores o de código, queremos entender
            <em>qué frena tu negocio.</em> Ahí empieza la web.
          </p>
        </div>
      </section>

      <mw-commitments />
      <mw-process />

      <mw-cta-card
        title="trabajemos juntos."
        i18n-title
        [links]="links"
      />
    </main>

    <mw-footer />
  `,
  styleUrl: './studio-page.scss',
})
export class StudioPage {
  protected readonly links = [
    { label: $localize`Ver los servicios`, sub: $localize`Diseño, desarrollo, SEO local, reservas y mantenimiento`, link: '/servicios/diseno-web' },
    { label: $localize`Ver los precios`, sub: $localize`Tres formas de hacerlo, con su horquilla real`, link: '/precios' },
  ];
}
