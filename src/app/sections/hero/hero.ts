import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  effect,
  inject,
  viewChild,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { SplitText, gsap } from '../../core/animation/gsap';
import { MagneticDirective } from '../../core/animation/magnetic.directive';
import { MotionService } from '../../core/animation/motion.service';
import { HERO_QUERIES } from '../../data/content';
import { selectBooted } from '../../state/ui/ui.feature';

/**
 * The thesis of the whole site, stated as a demo instead of a claim: this is
 * what a customer sees when they search from their phone, and this is where
 * your business sits in that list once we are done.
 *
 * The ranking is scrubbed to scroll — scroll down and the business climbs to
 * first place, scroll back up and it falls again.
 */
@Component({
  selector: 'mw-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MagneticDirective],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class Hero {
  private readonly root = viewChild.required<ElementRef<HTMLElement>>('root');
  private readonly store = inject(Store);
  private readonly motion = inject(MotionService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly booted = this.store.selectSignal(selectBooted);
  private played = false;

  constructor() {
    afterNextRender(() => this.buildScrollScenes());

    effect(() => {
      if (!this.booted() || this.played) return;
      this.played = true;
      this.playIntro();
    });
  }

  protected jumpTo(event: Event, id: string): void {
    event.preventDefault();
    this.motion.scrollTo(`#${id}`);
  }

  // -- entrance --------------------------------------------------------------

  private playIntro(): void {
    const el = this.root().nativeElement;

    if (this.motion.reducedMotion()) {
      gsap.set(el.querySelectorAll('[data-anim]'), { visibility: 'visible', clearProps: 'all' });
      return;
    }

    this.motion.scope(
      el,
      () => {
        gsap.set(el.querySelectorAll('[data-anim]'), { visibility: 'visible' });

        const headline = SplitText.create(el.querySelector('[data-hero-title]')!, {
          type: 'lines',
          mask: 'lines',
          linesClass: 'hero__line',
        });

        gsap
          .timeline({ defaults: { ease: 'mw-out' } })
          .from(el.querySelectorAll('[data-hero-eyebrow] > *'), {
            yPercent: 110,
            duration: 0.9,
          })
          .from(headline.lines, { yPercent: 115, duration: 1.35, stagger: 0.11 }, '-=0.62')
          .from(el.querySelector('[data-hero-lead]'), { y: 26, opacity: 0, duration: 1 }, '-=0.95')
          .from(
            el.querySelectorAll('[data-hero-action]'),
            { y: 22, opacity: 0, duration: 0.85, stagger: 0.09 },
            '-=0.8',
          )
          .from(
            el.querySelector('[data-finder]'),
            { y: 60, opacity: 0, duration: 1.4 },
            '-=1.25',
          );

        this.loopQueries(el);
      },
      this.destroyRef,
    );
  }

  /** Types one search after another into the field, forever. */
  private loopQueries(el: HTMLElement): void {
    const field = el.querySelector<HTMLElement>('[data-finder-query]');
    if (!field) return;

    const tl = gsap.timeline({ repeat: -1, delay: 1.6 });

    for (const query of HERO_QUERIES) {
      tl.to(field, {
        duration: query.length * 0.045,
        text: { value: query, delimiter: '' },
        ease: 'none',
      })
        .to({}, { duration: 2.1 })
        .to(field, { duration: 0.35, text: { value: '', delimiter: '' }, ease: 'none' })
        .to({}, { duration: 0.25 });
    }
  }

  // -- scroll ----------------------------------------------------------------

  private buildScrollScenes(): void {
    const el = this.root().nativeElement;

    this.motion.scope(
      el,
      () => {
        const rows = gsap.utils.toArray<HTMLElement>('[data-row]', el);
        const you = el.querySelector<HTMLElement>('[data-row-you]');

        // Promotion to first place, tied to scroll position.
        if (rows.length === 3 && you) {
          // Función y no constante: el alto de fila cambia entre vertical y
          // horizontal, y así `invalidateOnRefresh` lo vuelve a leer. `offsetTop`
          // mide la posición de maquetación, ajena a los `transform` que la
          // propia animación va aplicando.
          const step = () => rows[1].offsetTop - rows[0].offsetTop;
          const card = el.querySelector<HTMLElement>('[data-finder]')!;

          // La animación tiene que estar *terminada* con la tarjeta todavía a la
          // vista, y su posición depende del alto de pantalla y de cómo caiga el
          // texto: se mide, no se estima. Ambos rects se leen en el mismo
          // instante, así que su diferencia es el desplazamiento de la tarjeta
          // dentro del hero sea cual sea el scroll actual.
          //
          // Se resta la cabecera fija: sin eso, el recorrido acababa con el
          // borde superior de la tarjeta en 0, es decir, con la fila que llega
          // al primer puesto escondida detrás de la barra.
          const travel = () => {
            const offset = card.getBoundingClientRect().top - el.getBoundingClientRect().top;
            const bar = document.querySelector('mw-header .bar');
            const barHeight = bar ? bar.getBoundingClientRect().height : 72;
            return Math.max(150, Math.round(offset - barHeight - 16));
          };

          gsap
            .timeline({
              scrollTrigger: {
                trigger: el,
                start: 'top top',
                end: () => `+=${travel()}`,
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

        // El texto se aleja más rápido que la demostración: una pista de
        // profundidad que se deshace sola al volver a subir.
        //
        // En vertical no se puede animar `.hero__copy`: lleva `display:
        // contents` para poder colar la demostración entre sus dos bloques, y
        // un elemento sin caja no acepta `transform` ni `opacity`. Ahí se anima
        // el titular, que es el bloque que queda por encima de la tarjeta.
        const mm = gsap.matchMedia();

        mm.add('(min-width: 1025px)', () => {
          gsap.to(el.querySelector('[data-hero-copy]'), {
            y: -90,
            opacity: 0.25,
            ease: 'none',
            scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true },
          });
        });

        mm.add('(max-width: 1024px)', () => {
          gsap.to(el.querySelector('.hero__headline'), {
            y: -40,
            opacity: 0.3,
            ease: 'none',
            scrollTrigger: {
              trigger: el,
              start: 'top top',
              // Se desvanece mientras la tarjeta sube, no durante todo el hero.
              end: () => `+=${Math.round(window.innerHeight * 0.45)}`,
              scrub: true,
            },
          });
        });

        this.destroyRef.onDestroy(() => mm.revert());
      },
      this.destroyRef,
    );
  }
}
