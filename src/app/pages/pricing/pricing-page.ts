import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RevealDirective } from '../../core/animation/reveal.directive';
import { Footer } from '../../sections/footer/footer';
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
  imports: [RouterLink, RevealDirective, Footer, Pricing],
  template: `
    <main class="prp" id="contenido">
      <div class="shell prp__head" mwReveal="rise" [revealStagger]="0.08">
        <h1 class="prp__title" data-reveal-item>Lo que cuesta, dicho antes de empezar.</h1>
        <p class="prp__lead" data-reveal-item>
          Tres formas de hacerlo, con su horquilla real. Ninguna lleva cuotas escondidas ni
          permanencia, y el presupuesto se cierra por escrito antes de tocar nada.
        </p>
      </div>

      <mw-pricing />

      <div class="shell prp__back">
        <a class="btn btn--ghost" routerLink="/">
          <span class="btn__label">Volver al inicio</span>
        </a>
      </div>
    </main>

    <mw-footer />
  `,
  styleUrl: './pricing-page.scss',
})
export class PricingPage {}
