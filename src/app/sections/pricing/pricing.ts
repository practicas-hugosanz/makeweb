import { ChangeDetectionStrategy, Component, LOCALE_ID, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PLANS } from '../../data/content';

/**
 * Los tres presupuestos, en su propia página.
 *
 * Los precios son horquillas, no cifras cerradas: el trabajo real depende del
 * alcance y prometer un número exacto aquí sería mentir. La cifra final se
 * cierra por escrito antes de empezar, que es lo que dice la sección de
 * compromisos.
 */
@Component({
  selector: 'mw-pricing',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  templateUrl: './pricing.html',
  styleUrl: './pricing.scss',
})
export class Pricing {
  protected readonly plans = PLANS;
  // Las cifras, como se escriben en el idioma de la página: «423,50» en
  // castellano y francés, «423.50» en inglés.
  private readonly locale = inject(LOCALE_ID);

  protected formatPrice(value: number): string {
    return value.toLocaleString(this.locale);
  }

  /** Con el 21 % de IVA: el comercio pequeño paga esa cifra, no la otra. */
  protected withVat(value: number): string {
    const total = Math.round(value * 121) / 100;
    return total.toLocaleString(this.locale, {
      minimumFractionDigits: Number.isInteger(total) ? 0 : 2,
    });
  }
}
