import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  viewChild,
} from '@angular/core';
import { gsap } from '../../core/animation/gsap';
import { MotionService } from '../../core/animation/motion.service';
import { HERO_QUERIES } from '../../data/content';

/**
 * The thesis of the whole site, stated as a demo instead of a claim: this is
 * what a customer sees when they search from their phone, and this is where
 * your business sits in that list once we are done.
 *
 * The ranking is scrubbed to scroll — scroll down and the business climbs to
 * first place, scroll back up and it falls again.
 */
@Component({
  selector: 'mw-finder',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './finder.html',
  styleUrl: './finder.scss',
})
export class Finder {
  private readonly root = viewChild.required<ElementRef<HTMLElement>>('root');
  private readonly motion = inject(MotionService);
  private readonly destroyRef = inject(DestroyRef);

  /** Lo que se ve sin animación: con movimiento reducido el campo no queda vacío. */
  protected readonly firstQuery = HERO_QUERIES[0];

  constructor() {
    afterNextRender(() => this.build());
  }

  private build(): void {
    const el = this.root().nativeElement;

    this.motion.scope(
      el,
      () => {
        const rows = gsap.utils.toArray<HTMLElement>('[data-row]', el);
        const you = el.querySelector<HTMLElement>('[data-row-you]');
        const card = el.querySelector<HTMLElement>('[data-finder]')!;

        // Promotion to first place, tied to scroll position. Empieza cuando la
        // tarjeta ya está entera a la vista y acaba con ella todavía en el
        // centro: así el remate se ve, no ocurre por encima del pliegue.
        if (rows.length === 3 && you) {
          // Función y no constante: el alto de fila cambia entre vertical y
          // horizontal, y así `invalidateOnRefresh` lo vuelve a leer. `offsetTop`
          // mide la posición de maquetación, ajena a los `transform` que la
          // propia animación va aplicando.
          const step = () => rows[1].offsetTop - rows[0].offsetTop;

          gsap
            .timeline({
              scrollTrigger: {
                trigger: card,
                start: 'top 70%',
                end: 'center 45%',
                // Barely any lag: at 0.8 a quick flick of the wheel left the
                // tween still catching up long after the card had gone.
                scrub: 0.25,
                invalidateOnRefresh: true,
              },
              defaults: { ease: 'none' },
            })
            .to(you, { y: () => -step() * 2, duration: 1 }, 0)
            .to([rows[0], rows[1]], { y: () => step(), duration: 1 }, 0)
            .to(you, { scale: 1.035, duration: 0.5 }, 0)
            .to(you, { scale: 1, duration: 0.5 }, 0.5)
            .to([rows[0], rows[1]], { opacity: 0.35, duration: 1 }, 0)
            .to(el.querySelector('[data-finder-flag]'), { opacity: 1, y: 0, duration: 0.4 }, 0.45);
        }

        this.loopQueries(el);
      },
      this.destroyRef,
    );
  }

  /** Types one search after another into the field, forever, while on screen. */
  private loopQueries(el: HTMLElement): void {
    const field = el.querySelector<HTMLElement>('[data-finder-query]');
    if (!field) return;

    const tl = gsap.timeline({ repeat: -1, paused: true });

    for (const query of HERO_QUERIES) {
      tl.to(field, { duration: 0.35, text: { value: '', delimiter: '' }, ease: 'none' })
        .to({}, { duration: 0.25 })
        .to(field, {
          duration: query.length * 0.045,
          text: { value: query, delimiter: '' },
          ease: 'none',
        })
        .to({}, { duration: 2.1 });
    }

    // Fuera de pantalla no teclea: es trabajo por fotograma que nadie ve.
    gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        onToggle: (self) => (self.isActive ? tl.play() : tl.pause()),
      },
    });
  }
}
