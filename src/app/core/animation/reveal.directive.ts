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

export type RevealKind = 'rise' | 'fade' | 'clip' | 'scale' | 'blur';

/**
 * Entrance animation driven by scroll position.
 *
 * Every reveal uses `toggleActions: 'play none none reverse'`, so scrolling
 * back up returns the element to its original state instead of leaving the page
 * in a half-played state.
 *
 *   <div mwReveal="clip" [revealStagger]="0.08"> … </div>
 *
 * Children marked `data-reveal-item` are staggered instead of the host.
 */
@Directive({
  selector: '[mwReveal]',
  host: { '[attr.data-anim]': '"reveal"' },
})
export class RevealDirective {
  readonly kind = input<RevealKind>('rise', { alias: 'mwReveal' });
  readonly revealDelay = input(0);
  readonly revealStagger = input(0.07);
  readonly revealStart = input('top 88%');

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly motion = inject(MotionService);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {
      if (this.motion.reducedMotion()) {
        gsap.set(this.host, { visibility: 'visible' });
        return;
      }

      this.motion.scope(
        this.host,
        () => {
          const items = this.host.querySelectorAll<HTMLElement>('[data-reveal-item]');
          const targets = items.length ? Array.from(items) : [this.host];

          gsap.set(this.host, { visibility: 'visible' });
          gsap.from(targets, {
            ...FROM[this.kind()],
            duration: this.kind() === 'clip' ? 1.4 : 1.1,
            delay: this.revealDelay(),
            stagger: items.length ? this.revealStagger() : 0,
            scrollTrigger: {
              trigger: this.host,
              start: this.revealStart(),
              toggleActions: 'play none none reverse',
            },
          });
        },
        this.destroyRef,
      );
    });
  }
}

const FROM: Record<RevealKind, gsap.TweenVars> = {
  rise: { y: 44, opacity: 0 },
  fade: { opacity: 0 },
  clip: { clipPath: 'inset(0% 0% 100% 0%)', y: 24, opacity: 1 },
  scale: { scale: 0.92, opacity: 0, transformOrigin: '50% 100%' },
  blur: { filter: 'blur(14px)', opacity: 0, y: 18 },
};
