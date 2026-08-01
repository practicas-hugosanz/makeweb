import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RevealDirective } from '../../core/animation/reveal.directive';
import { COMMITMENTS } from '../../data/content';

/**
 * Lo que ocupa el sitio de los testimonios.
 *
 * Un estudio que empieza no tiene reseñas, e inventarlas es publicidad
 * engañosa. Los testimonios sirven para quitarle miedo a comprar; unos
 * compromisos concretos y verificables hacen ese mismo trabajo sin mentir.
 */
@Component({
  selector: 'mw-commitments',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RevealDirective],
  templateUrl: './commitments.html',
  styleUrl: './commitments.scss',
})
export class Commitments {
  protected readonly commitments = COMMITMENTS;
}
