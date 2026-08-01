import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  viewChild,
} from '@angular/core';
import { ScrollTrigger, gsap } from '../../core/animation/gsap';
import { MotionService } from '../../core/animation/motion.service';
import { RevealDirective } from '../../core/animation/reveal.directive';
import { PROCESS } from '../../data/content';

/**
 * Three weeks, phase by phase.
 *
 * The rail on the left fills in step with how far you have read, and each phase
 * lights up while it is the one on screen — so the page itself behaves like the
 * schedule it is describing.
 */
@Component({
  selector: 'mw-process',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RevealDirective],
  templateUrl: './process.html',
  styleUrl: './process.scss',
})
export class Process {
  private readonly root = viewChild.required<ElementRef<HTMLElement>>('root');
  private readonly motion = inject(MotionService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly phases = PROCESS;

  constructor() {
    afterNextRender(() => {
      const el = this.root().nativeElement;

      this.motion.scope(
        el,
        () => {
          const list = el.querySelector<HTMLElement>('[data-list]')!;

          gsap.fromTo(
            el.querySelector('[data-rail-fill]'),
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: list,
                start: 'top 62%',
                end: 'bottom 78%',
                scrub: 0.5,
              },
            },
          );

          gsap.utils.toArray<HTMLElement>('[data-phase]', el).forEach((phase) => {
            gsap.from(phase.querySelectorAll('[data-phase-part]'), {
              y: 34,
              opacity: 0,
              duration: 1,
              stagger: 0.07,
              scrollTrigger: {
                trigger: phase,
                start: 'top 82%',
                toggleActions: 'play none none reverse',
              },
            });

            ScrollTrigger.create({
              trigger: phase,
              start: 'top 62%',
              end: 'bottom 55%',
              toggleClass: { targets: phase, className: 'is-live' },
            });
          });
        },
        this.destroyRef,
      );
    });
  }
}
