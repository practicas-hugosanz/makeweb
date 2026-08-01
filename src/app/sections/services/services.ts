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
import { gsap } from '../../core/animation/gsap';
import { MotionService } from '../../core/animation/motion.service';
import { RevealDirective } from '../../core/animation/reveal.directive';
import { SERVICES } from '../../data/content';

/**
 * What we do, read sideways.
 *
 * The section pins and the row of cards travels horizontally under scroll
 * control, so the five services are one continuous movement rather than five
 * boxes. Below 900px the pin is dropped entirely and the same cards become a
 * snap-scrolling row you can swipe.
 */
@Component({
  selector: 'mw-services',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RevealDirective],
  templateUrl: './services.html',
  styleUrl: './services.scss',
})
export class Services {
  private readonly root = viewChild.required<ElementRef<HTMLElement>>('root');
  private readonly motion = inject(MotionService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly services = SERVICES;
  protected readonly current = signal(1);

  constructor() {
    afterNextRender(() => {
      const el = this.root().nativeElement;

      this.motion.scope(
        el,
        () => {
          const mm = gsap.matchMedia();

          mm.add('(min-width: 901px)', () => {
            const viewport = el.querySelector<HTMLElement>('[data-viewport]')!;
            const track = el.querySelector<HTMLElement>('[data-track]')!;
            const cards = gsap.utils.toArray<HTMLElement>('[data-card]', el);

            // The track is `width: max-content`, so its own scrollWidth and
            // clientWidth are identical. The travel distance is how much wider
            // the track is than the window it moves inside.
            const distance = () => Math.max(0, track.scrollWidth - viewport.clientWidth);

            // On a screen wide enough to fit every card there is nothing to
            // travel, and pinning would just freeze the page for no reason.
            if (distance() < 120) return;

            const tween = gsap.to(track, {
              x: () => -distance(),
              ease: 'none',
              scrollTrigger: {
                trigger: el,
                start: 'top top',
                end: () => `+=${distance()}`,
                pin: el.querySelector<HTMLElement>('[data-pin]')!,
                scrub: 0.6,
                anticipatePin: 1,
                invalidateOnRefresh: true,
                onUpdate: (self) =>
                  this.current.set(
                    Math.min(cards.length, Math.floor(self.progress * cards.length) + 1),
                  ),
              },
            });

            // Cards fade up as they approach the middle of the screen and fade
            // back out again — driven by the same tween, so it is reversible.
            // Opacity only: a 3D rotation here forces a new compositing layer
            // per card on every scroll frame.
            cards.forEach((card) => {
              gsap.fromTo(
                card,
                { opacity: 0.4 },
                {
                  opacity: 1,
                  ease: 'none',
                  scrollTrigger: {
                    trigger: card,
                    containerAnimation: tween,
                    start: 'left 92%',
                    end: 'left 55%',
                    scrub: true,
                  },
                },
              );
            });

            return () => gsap.set([track, ...cards], { clearProps: 'all' });
          });

          this.destroyRef.onDestroy(() => mm.revert());
        },
        this.destroyRef,
      );
    });
  }
}
