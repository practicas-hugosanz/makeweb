import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CtaCard } from '../../sections/cta-card/cta-card';
import { Footer } from '../../sections/footer/footer';
import { PageHero } from '../../sections/page-hero/page-hero';
import { Pricing } from '../../sections/pricing/pricing';

/**
 * Los precios, fuera de la portada.
 *
 * En la portada competían con la demostración y obligaban a decidir antes de
 * haber terminado de leer. En su propia página se llega a ellos queriendo, y
 * caben debajo las preguntas que siempre acompañan a un presupuesto.
 */
@Component({
  selector: 'mw-pricing-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageHero, CtaCard, Footer, Pricing],
  template: `
    <main class="prp" id="contenido">
      <mw-page-hero
        crumb="Precios"
        i18n-crumb
        [cta]="false"
        i18n-lead
        lead="Tres formas de hacerlo, con su horquilla real. Ninguna lleva cuotas escondidas ni permanencia, y el presupuesto se cierra por escrito antes de tocar nada."
      >
        <span title i18n>Lo que cuesta, <em>dicho antes</em> de empezar.</span>
      </mw-page-hero>

      <mw-pricing />

      <mw-cta-card
        title="hablemos de tu presupuesto."
        i18n-title
        [links]="links"
      />
    </main>

    <mw-footer />
  `,
  styleUrl: './pricing-page.scss',
})
export class PricingPage {
  protected readonly links = [
    { label: $localize`Ver los servicios`, sub: $localize`Qué entra en cada parte del proyecto`, link: '/servicios/diseno-web' },
    { label: $localize`Conocer el estudio`, sub: $localize`Quién hace tu web y cómo trabajamos`, link: '/estudio' },
  ];
}
