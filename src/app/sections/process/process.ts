import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { ScrollTrigger, gsap } from '../../core/animation/gsap';
import { MotionService } from '../../core/animation/motion.service';
import { PROCESS } from '../../data/content';

/** Lo que tapa la barra fija de arriba, en píxeles. */
const BAR = 80;

/**
 * La semana de trabajo: una tira de siete días con cada fase en los suyos, que
 * se llena al bajar por la sección, y debajo las cuatro fases en tarjetas. Se
 * enciende la fase del día por el que va la semana, en la tira y en su tarjeta.
 */
@Component({
  selector: 'mw-process',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  templateUrl: './process.html',
  styleUrl: './process.scss',
})
export class Process {
  private readonly root = viewChild.required<ElementRef<HTMLElement>>('root');
  private readonly motion = inject(MotionService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly phases = PROCESS;
  protected readonly days = [1, 2, 3, 4, 5, 6, 7];

  constructor() {
    afterNextRender(() => {
      const el = this.root().nativeElement;

      this.motion.scope(
        el,
        () => {
          const cards = gsap.utils.toArray<HTMLElement>('[data-phase]', el);
          const spans = gsap.utils.toArray<HTMLElement>('[data-span]', el);
          const light = (day: number) =>
            this.phases.forEach((phase, i) => {
              const on = day >= phase.from && day <= phase.to;
              cards[i]?.classList.toggle('is-live', on);
              spans[i]?.classList.toggle('is-live', on);
            });

          const mm = gsap.matchMedia();

          // En horizontal, las cuatro tarjetas están en una fila: la sección se
          // queda fija en pantalla y el scroll hace avanzar la semana del día 1
          // al 7, encendiendo la fase de cada día. Hasta que no se llena la
          // semana no se pasa a la sección siguiente.
          mm.add('(min-width: 1001px)', () => {
            const content = el.querySelector<HTMLElement>('.shell')!;
            // El último tramo del recorrido es una pausa con la semana llena,
            // para que la última fase se vea encendida antes de soltar.
            const FILL = 0.9;

            gsap
              .timeline({
                scrollTrigger: {
                  trigger: content,
                  // Centrada si cabe con la barra de arriba; si no, pegada
                  // abajo, que es donde están las tarjetas que se encienden.
                  start: () =>
                    content.offsetHeight + BAR * 2 <= window.innerHeight
                      ? `center ${Math.round((window.innerHeight + BAR) / 2)}px`
                      : 'bottom bottom-=24px',
                  end: () => `+=${Math.round(window.innerHeight * 1.4)}`,
                  pin: el,
                  scrub: 0.5,
                  anticipatePin: 1,
                  invalidateOnRefresh: true,
                  onUpdate: (self) =>
                    light(gsap.utils.clamp(1, 7, Math.ceil((self.progress / FILL) * 7))),
                },
              })
              .fromTo(el.querySelector('[data-fill]'), { scaleX: 0 }, { scaleX: 1, ease: 'none', duration: FILL })
              .to({}, { duration: 1 - FILL });
          });

          // En vertical las tarjetas van una debajo de otra: se enciende la que
          // está a media pantalla, y la semana se llena hasta su último día.
          mm.add('(max-width: 1000px)', () => {
            const fill = el.querySelector('[data-fill]');
            gsap.set(fill, { scaleX: 0 });
            cards.forEach((card, i) => {
              ScrollTrigger.create({
                trigger: card,
                start: 'top 60%',
                end: 'bottom 40%',
                onToggle: (self) => {
                  if (!self.isActive) return;
                  light(this.phases[i].from);
                  gsap.to(fill, { scaleX: this.phases[i].to / 7, duration: 0.5, ease: 'power2.out' });
                },
              });
            });
          });

          this.destroyRef.onDestroy(() => mm.revert());
        },
        this.destroyRef,
      );
    });
  }

  protected pad(n: number): string {
    return String(n).padStart(2, '0');
  }
}
