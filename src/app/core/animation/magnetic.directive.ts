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
 * Pointer-attracted button. The element leans toward the cursor while it is
 * inside the hit area and springs back to 0,0 the moment the pointer leaves —
 * `quickTo` keeps this at one interpolated tween instead of a tween per move.
 */
@Directive({
  selector: '[mwMagnetic]',
  host: {
    '(pointerenter)': 'onEnter()',
    '(pointermove)': 'onMove($event)',
    '(pointerleave)': 'onLeave()',
    '(blur)': 'onLeave()',
  },
})
export class MagneticDirective {
  /** How far the element may travel, in px. */
  readonly strength = input(26, { alias: 'mwMagnetic' });

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly motion = inject(MotionService);
  private readonly destroyRef = inject(DestroyRef);

  private xTo?: gsap.QuickToFunc;
  private yTo?: gsap.QuickToFunc;
  private inner: HTMLElement | null = null;
  private innerX?: gsap.QuickToFunc;
  private innerY?: gsap.QuickToFunc;

  constructor() {
    afterNextRender(() => {
      if (this.motion.reducedMotion() || window.matchMedia('(pointer: coarse)').matches) return;

      const opts = { duration: 0.7, ease: 'power3.out' };
      this.xTo = gsap.quickTo(this.host, 'x', opts);
      this.yTo = gsap.quickTo(this.host, 'y', opts);

      // The label lags behind the shell for a bit of parallax inside the button.
      this.inner = this.host.querySelector('[data-magnetic-inner]');
      if (this.inner) {
        this.innerX = gsap.quickTo(this.inner, 'x', { duration: 0.9, ease: 'power3.out' });
        this.innerY = gsap.quickTo(this.inner, 'y', { duration: 0.9, ease: 'power3.out' });
      }

      this.destroyRef.onDestroy(() => gsap.set([this.host, this.inner].filter(Boolean), { clearProps: 'x,y' }));
    });
  }

  protected onEnter(): void {
    this.host.dataset['magnetized'] = 'true';
  }

  protected onMove(event: PointerEvent): void {
    if (!this.xTo) return;
    const r = this.host.getBoundingClientRect();
    const dx = (event.clientX - (r.left + r.width / 2)) / (r.width / 2);
    const dy = (event.clientY - (r.top + r.height / 2)) / (r.height / 2);
    const s = this.strength();

    this.xTo(dx * s);
    this.yTo?.(dy * s);
    this.innerX?.(dx * s * 0.35);
    this.innerY?.(dy * s * 0.35);
  }

  protected onLeave(): void {
    delete this.host.dataset['magnetized'];
    this.xTo?.(0);
    this.yTo?.(0);
    this.innerX?.(0);
    this.innerY?.(0);
  }
}
