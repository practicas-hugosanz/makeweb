import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { gsap } from '../../core/animation/gsap';
import { MotionService } from '../../core/animation/motion.service';
import { RevealDirective } from '../../core/animation/reveal.directive';
import { FAQS } from '../../data/content';

@Component({
  selector: 'mw-faq',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatExpansionModule, RevealDirective],
  templateUrl: './faq.html',
  styleUrl: './faq.scss',
})
export class Faq {
  private readonly root = viewChild.required<ElementRef<HTMLElement>>('root');
  private readonly motion = inject(MotionService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly faqs = FAQS;

  /** Index of the open question, or -1 when they are all closed. */
  protected readonly open = signal(0);

  constructor() {
    afterNextRender(() => {
      const el = this.root().nativeElement;
      const rows = gsap.utils.toArray<HTMLElement>('[data-row]', el);

      if (this.motion.reducedMotion()) {
        gsap.set(rows, { visibility: 'visible' });
        return;
      }

      this.motion.scope(
        el,
        () => {
          gsap.set(rows, { visibility: 'visible' });

          // Las preguntas caen de una en una. Antes la lista entera aparecía de
          // golpe con un solo fundido y no invitaba a recorrerla.
          gsap
            .timeline({
              defaults: { ease: 'power3.out' },
              scrollTrigger: {
                trigger: el.querySelector('[data-list]')!,
                start: 'top 82%',
                toggleActions: 'play none none reverse',
              },
            })
            .from(el.querySelector('[data-rule]'), {
              scaleX: 0,
              duration: 0.8,
              ease: 'power2.inOut',
            })
            .from(rows, { y: 26, opacity: 0, duration: 0.75, stagger: 0.08 }, 0.12);
        },
        this.destroyRef,
      );
    });
  }

  protected pad(n: number): string {
    return String(n).padStart(2, '0');
  }

  /**
   * Closing the panel that is already open has to reset the marker too.
   * The guard matters when *switching* panels: the accordion opens the new one
   * first and only then closes the old one, so an unguarded reset here would
   * wipe out the index that was just set.
   */
  protected onClosed(index: number): void {
    if (this.open() === index) this.open.set(-1);
  }
}
