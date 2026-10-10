import { ChangeDetectionStrategy, Component } from '@angular/core';
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

  protected formatPrice(value: number): string {
    return value.toLocaleString('es-ES');
  }
}
