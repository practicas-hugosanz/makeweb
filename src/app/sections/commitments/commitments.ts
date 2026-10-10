import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { COMMITMENTS, CommitmentIcon } from '../../data/content';

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
  imports: [RouterLink],
  templateUrl: './commitments.html',
  styleUrl: './commitments.scss',
})
export class Commitments {
  protected readonly commitments = COMMITMENTS;

  /** Iconos de trazo, dibujados a mano en una rejilla de 24. */
  protected readonly icons: Record<CommitmentIcon, string> = {
    price: 'M3.5 12.5 11 5h8v8l-7.5 7.5a1.4 1.4 0 0 1-2 0l-6-6a1.4 1.4 0 0 1 0-2zM15.5 8.5h.01',
    key: 'M14.5 9.5a4 4 0 1 0-3.6 4l1.6 1.6H15v2.4h2.4V20H20v-2.6l-5.9-5.9a4 4 0 0 0 .4-2zM8.5 8.5h.01',
    calendar: 'M4 6.5h16V20H4zM4 10.5h16M8 4v4M16 4v4M9 15l2 2 4-4',
    play: 'M4 5h16v12H4zM10 8.5v5l4.5-2.5zM8 20.5h8',
    chart: 'M4 20h16M7 16v-4M12 16V8M17 16v-7',
    chat: 'M4.5 5h15v10.5H10L5.5 19.5v-4H4.5zM8.5 9.5h7M8.5 12.5h4',
  };

  protected pad(n: number): string {
    return String(n).padStart(2, '0');
  }
}
