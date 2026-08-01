import {
  DestroyRef,
  Directive,
  ElementRef,
  afterNextRender,
  inject,
  input,
} from '@angular/core';
import { gsap } from './gsap';
import { MotionService } from './motion.service';

/**
 * A number that is *tied to* scroll position rather than merely triggered by it.
 *
 * Because the tween is scrubbed, scrolling up counts the figure back down —
 * the metric reads as a live gauge of where you are on the page, not a one-shot
 * party trick that can only fire once.
 */
@Directive({
  selector: '[mwCounter]',
  host: { '[attr.data-anim]': '"counter"' },
})
export class CounterDirective {
  readonly to = input.required<number>({ alias: 'mwCounter' });
  readonly from = input(0);
  readonly decimals = input(0);
  readonly prefix = input('');
  readonly suffix = input('');

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly motion = inject(MotionService);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {
      const format = (value: number) =>
        this.prefix() +
        value.toLocaleString('es-ES', {
          minimumFractionDigits: this.decimals(),
          maximumFractionDigits: this.decimals(),
        }) +
        this.suffix();

      if (this.motion.reducedMotion()) {
        this.host.textContent = format(this.to());
        gsap.set(this.host, { visibility: 'visible' });
        return;
      }

      this.motion.scope(
        this.host,
        () => {
          gsap.set(this.host, { visibility: 'visible' });
          const state = { value: this.from() };

          gsap.to(state, {
            value: this.to(),
            ease: 'none',
            onUpdate: () => (this.host.textContent = format(state.value)),
            scrollTrigger: {
              trigger: this.host,
              start: 'top 92%',
              end: 'top 45%',
              scrub: 0.6,
            },
          });
        },
        this.destroyRef,
      );
    });
  }
}
