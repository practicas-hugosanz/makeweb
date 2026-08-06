import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MagneticDirective } from '../../core/animation/magnetic.directive';
import { RevealDirective } from '../../core/animation/reveal.directive';
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
  imports: [RouterLink, RevealDirective, MagneticDirective],
  templateUrl: './pricing.html',
  styleUrl: './pricing.scss',
})
export class Pricing {
  protected readonly plans = PLANS;

  protected formatPrice(value: number): string {
    return value.toLocaleString('es-ES');
  }
}

// La tarjeta recomendada llegó a llevar un `gsap.from()` a mano encima del que
// ya aplica mwReveal. Dos `from` sobre el mismo elemento se renderizan los dos
// al momento, así que el segundo tomaba los valores iniciales del primero como
// valores finales y la tarjeta se quedaba en y:44 / opacity:0 — invisible.
// Ahora entra con `scale` a través de la directiva, que es un solo tween.
