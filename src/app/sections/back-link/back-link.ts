import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * El enlace de vuelta al final de una página interior.
 *
 * Estaba escrito dos veces: en `/precios` como un filete a todo lo ancho con
 * flecha larga, y en las páginas legales como un botón de píldora corriente. Dos
 * gestos distintos para el mismo movimiento. Ahora es uno solo, y como vive en
 * un componente no se pueden volver a separar.
 *
 * Las flechas de los botones de acción de la web salen hacia arriba y a la
 * derecha; esta va justo al contrario, porque lleva justo al contrario.
 */
@Component({
  selector: 'mw-back-link',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <a class="bk" [routerLink]="to()">
      <svg class="bk__arrow" viewBox="0 0 44 8" aria-hidden="true">
        <path
          d="M43 4H1M5 1 1 4l4 3"
          fill="none"
          stroke="currentColor"
          stroke-width="1"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      <span class="bk__label">{{ label() }}</span>
    </a>
  `,
  styleUrl: './back-link.scss',
})
export class BackLink {
  readonly to = input('/');
  readonly label = input('Volver al inicio');
}
