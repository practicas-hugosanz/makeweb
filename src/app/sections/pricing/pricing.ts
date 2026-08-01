import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterNextRender,
  effect,
  inject,
  viewChild,
} from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { Store } from '@ngrx/store';
import { gsap } from '../../core/animation/gsap';
import { MagneticDirective } from '../../core/animation/magnetic.directive';
import { MotionService } from '../../core/animation/motion.service';
import { RevealDirective } from '../../core/animation/reveal.directive';
import { PLANS } from '../../data/content';
import { UiActions } from '../../state/ui/ui.actions';
import { selectPricingTerm } from '../../state/ui/ui.feature';

@Component({
  selector: 'mw-pricing',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonToggleModule, RevealDirective, MagneticDirective],
  templateUrl: './pricing.html',
  styleUrl: './pricing.scss',
})
export class Pricing {
  private readonly root = viewChild.required<ElementRef<HTMLElement>>('root');
  private readonly store = inject(Store);
  private readonly motion = inject(MotionService);

  protected readonly plans = PLANS;
  protected readonly term = this.store.selectSignal(selectPricingTerm);

  private ready = false;

  constructor() {
    afterNextRender(() => (this.ready = true));

    // Prices roll to the new figure instead of snapping, so the change is
    // legible as a change rather than a re-render.
    effect(() => {
      const term = this.term();
      if (!this.ready) return;
      this.rollPrices(term);
    });
  }

  protected setTerm(term: 'once' | 'monthly'): void {
    this.store.dispatch(UiActions.pricingTermChanged({ term }));
  }

  protected formatPrice(value: number): string {
    return value.toLocaleString('es-ES');
  }

  protected priceFor(planId: string, term: 'once' | 'monthly'): number {
    const plan = this.plans.find((p) => p.id === planId)!;
    return term === 'once' ? plan.price : plan.care;
  }

  private rollPrices(term: 'once' | 'monthly'): void {
    const el = this.root().nativeElement;

    el.querySelectorAll<HTMLElement>('[data-price]').forEach((node) => {
      const target = this.priceFor(node.dataset['price']!, term);
      const current = Number(node.dataset['current'] ?? target);
      const state = { value: current };

      gsap.to(state, {
        value: target,
        duration: this.motion.reducedMotion() ? 0 : 0.7,
        ease: 'power3.out',
        onUpdate: () => {
          node.textContent = Math.round(state.value).toLocaleString('es-ES');
        },
        onComplete: () => (node.dataset['current'] = String(target)),
      });
    });
  }
}

// The recommended plan used to get a second, hand-rolled `gsap.from()` on top
// of the one mwReveal already applies. Two `from` tweens on the same element
// both render immediately, so the second recorded the first one's start values
// as its end values and the card settled at y:44 / opacity:0 — invisible.
// It now scales in through the directive instead, which is one tween.
