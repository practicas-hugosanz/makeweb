import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Contact } from '../../sections/contact/contact';
import { Footer } from '../../sections/footer/footer';
import { PageHero } from '../../sections/page-hero/page-hero';

/**
 * El formulario, en su propia página. En la portada era la penúltima sección;
 * aquí es lo único que hay, y todos los botones de presupuesto llevan a ella.
 */
@Component({
  selector: 'mw-contact-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageHero, Contact, Footer],
  template: `
    <main id="contenido">
      <mw-page-hero
        crumb="Contacto"
        i18n-crumb
        [cta]="false"
        i18n-lead
        lead="Cuéntanos qué negocio tienes y qué te gustaría conseguir. Te respondemos en 24 horas con una propuesta: alcance, precio cerrado y fecha de entrega."
      >
        <span title i18n>Hablemos <em>de tu</em> negocio.</span>
      </mw-page-hero>

      <mw-contact [showHead]="false" />
    </main>

    <mw-footer />
  `,
})
export class ContactPage {}
