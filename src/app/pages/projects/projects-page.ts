import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CtaCard } from '../../sections/cta-card/cta-card';
import { Footer } from '../../sections/footer/footer';
import { PageHero } from '../../sections/page-hero/page-hero';
import { Projects } from '../../sections/projects/projects';

/** Los trabajos para clientes. Mientras no haya casos publicados, sus huecos. */
@Component({
  selector: 'mw-projects-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageHero, Projects, CtaCard, Footer],
  template: `
    <main id="contenido">
      <mw-page-hero
        crumb="Proyectos"
        i18n-crumb
        i18n-lead
        lead="Webs a medida para negocios concretos, cada una con su forma de trabajar. Los casos se publican con el permiso de cada cliente y con sus números."
      >
        <span title i18n>Nuestros <em>proyectos.</em></span>
      </mw-page-hero>

      <mw-projects [showLink]="false" />

      <mw-cta-card title="el próximo es el tuyo." i18n-title />
    </main>

    <mw-footer />
  `,
})
export class ProjectsPage {}
