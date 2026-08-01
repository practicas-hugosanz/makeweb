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
import { RevealDirective } from '../../core/animation/reveal.directive';

interface Delta {
  label: string;
  before: number;
  after: number;
  decimals: number;
  suffix: string;
}

/**
 * The rebuild, performed under the reader's thumb.
 *
 * Scroll wipes the new site across the old one and drags the three numbers
 * along with it. Scroll back and the old site returns, numbers and all — the
 * comparison is a control you operate, not a claim you have to take on trust.
 */
@Component({
  selector: 'mw-compare',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RevealDirective],
  templateUrl: './compare.html',
  styleUrl: './compare.scss',
})
export class Compare {
  private readonly root = viewChild.required<ElementRef<HTMLElement>>('root');
  private readonly motion = inject(MotionService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly deltas: Delta[] = [
    { label: 'Carga en móvil', before: 6.4, after: 0.8, decimals: 1, suffix: ' s' },
    { label: 'PageSpeed', before: 34, after: 96, decimals: 0, suffix: '/100' },
    { label: 'Visitas que se van', before: 71, after: 28, decimals: 0, suffix: ' %' },
  ];

  constructor() {
    afterNextRender(() => {
      const el = this.root().nativeElement;

      this.motion.scope(
        el,
        () => {
          const after = el.querySelector<HTMLElement>('[data-after]')!;
          const handle = el.querySelector<HTMLElement>('[data-handle]')!;
          const readouts = gsap.utils.toArray<HTMLElement>('[data-delta]', el);

          const pin = el.querySelector<HTMLElement>('[data-pin]')!;

          const tl = gsap.timeline({
            scrollTrigger: {
              // El disparador es el propio bloque que se ancla, no la sección.
              // Con la sección, `top top` saltaba cuando llegaba arriba el
              // titular, y la comparativa se quedaba anclada fuera de pantalla
              // justo mientras el barrido la estaba recorriendo.
              trigger: pin,
              start: 'top top',
              end: '+=140%',
              pin,
              scrub: 0.6,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
            defaults: { ease: 'none' },
          });

          // The handle travels left → right, so the new site has to be revealed
          // left → right too: inset from the *right* edge shrinking to zero.
          // (Insetting from the left instead made the reveal run the other way
          // and the handle appeared to push the wrong layer.)
          tl.fromTo(
            after,
            { clipPath: 'inset(0% 100% 0% 0%)' },
            { clipPath: 'inset(0% 0% 0% 0%)', duration: 1 },
            0,
          )
            .fromTo(handle, { left: '0%' }, { left: '100%', duration: 1 }, 0)
            .fromTo(
              el.querySelector('[data-tag-before]'),
              { opacity: 1 },
              { opacity: 0.25, duration: 1 },
              0,
            )
            .fromTo(el.querySelector('[data-tag-after]'), { opacity: 0 }, { opacity: 1, duration: 0.4 }, 0.15);

          readouts.forEach((node, i) => {
            const delta = this.deltas[i];
            const state = { value: delta.before };
            tl.to(
              state,
              {
                value: delta.after,
                duration: 1,
                onUpdate: () => (node.textContent = this.format(state.value, delta)),
              },
              0,
            );
          });
        },
        this.destroyRef,
      );
    });
  }

  protected format(value: number, delta: Delta): string {
    return (
      value.toLocaleString('es-ES', {
        minimumFractionDigits: delta.decimals,
        maximumFractionDigits: delta.decimals,
      }) + delta.suffix
    );
  }
}
