import { Directive, ElementRef, afterNextRender, inject } from '@angular/core';

/** Dónde se aparca el relleno cuando no está dentro del botón. */
type Offset = readonly [x: string, y: string];

const LEFT: Offset = ['-101%', '0%'];
const RIGHT: Offset = ['101%', '0%'];
const TOP: Offset = ['0%', '-101%'];
const BOTTOM: Offset = ['0%', '101%'];
const INSIDE: Offset = ['0%', '0%'];

/**
 * El relleno del botón entra por el borde por el que ha cruzado el puntero, y
 * al salir se retira por el borde por el que se va.
 *
 * Sustituye al botón imantado que perseguía el cursor. Aquel tenía dos
 * problemas: es de las firmas más repetidas de la web de plantilla, y competía
 * con el barrido que el botón ya hacía por CSS —dos gestos distintos discutiendo
 * en el mismo sitio—. Este lee el puntero una sola vez al entrar y otra al
 * salir, en vez de seguirlo fotograma a fotograma, y el movimiento sigue siendo
 * el mismo barrido de siempre: solo cambia por dónde empieza.
 *
 * Toda la animación es una transición de CSS sobre `--wipe-x` y `--wipe-y` (ver
 * `_buttons.scss`). Aquí no se anima nada: solo se dice desde dónde. Así la
 * regla global de `prefers-reduced-motion` la neutraliza sin que haya que
 * comprobar nada, y no hace falta GSAP para un hover.
 */
@Directive({
  selector: '[mwSweep]',
  host: {
    '(pointerenter)': 'onEnter($event)',
    '(pointerleave)': 'onLeave($event)',
  },
})
export class SweepDirective {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  constructor() {
    // La marca se pone desde el navegador y no como enlace en el anfitrión: así
    // el HTML que llega del servidor no la trae, y hasta que hidrata manda el
    // respaldo de CSS. Quien navegue sin JS se queda con ese respaldo para
    // siempre, que es exactamente lo que tiene que pasar.
    afterNextRender(() => {
      this.host.dataset['sweep'] = '';
    });
  }

  protected onEnter(event: PointerEvent): void {
    // Colocar el relleno en el borde de entrada y llevarlo al centro son dos
    // cambios seguidos sobre la misma propiedad. Sin cortar la transición en el
    // primero, el navegador funde los dos en uno solo y el barrido volvería a
    // salir siempre desde donde se quedó, que es justo lo que queremos evitar.
    this.place(this.edgeFrom(event), true);

    // Fuerza el recálculo para que el salto anterior cuente como estado propio.
    void this.host.offsetWidth;

    this.place(INSIDE, false);
  }

  protected onLeave(event: PointerEvent): void {
    this.place(this.edgeFrom(event), false);
  }

  private place([x, y]: Offset, instant: boolean): void {
    this.host.style.setProperty('--wipe-dur', instant ? '0s' : '');
    this.host.style.setProperty('--wipe-x', x);
    this.host.style.setProperty('--wipe-y', y);
  }

  /** El borde más cercano al puntero: por ahí ha cruzado. */
  private edgeFrom(event: PointerEvent): Offset {
    const rect = this.host.getBoundingClientRect();
    const left = event.clientX - rect.left;
    const right = rect.right - event.clientX;
    const top = event.clientY - rect.top;
    const bottom = rect.bottom - event.clientY;
    const nearest = Math.min(left, right, top, bottom);

    if (nearest === left) return LEFT;
    if (nearest === right) return RIGHT;
    if (nearest === top) return TOP;
    return BOTTOM;
  }
}
