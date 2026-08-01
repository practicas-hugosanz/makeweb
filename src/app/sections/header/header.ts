import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter } from 'rxjs';
import { ScrollTrigger, gsap } from '../../core/animation/gsap';
import { MagneticDirective } from '../../core/animation/magnetic.directive';
import { MotionService } from '../../core/animation/motion.service';
import { NAV_LINKS } from '../../data/content';
import { UiActions } from '../../state/ui/ui.actions';
import { selectActiveSection, selectMenuOpen } from '../../state/ui/ui.feature';

@Component({
  selector: 'mw-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MagneticDirective],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  private readonly bar = viewChild.required<ElementRef<HTMLElement>>('bar');
  private readonly panel = viewChild.required<ElementRef<HTMLElement>>('panel');
  private readonly store = inject(Store);
  private readonly motion = inject(MotionService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly links = NAV_LINKS;
  protected readonly menuOpen = this.store.selectSignal(selectMenuOpen);
  protected readonly active = this.store.selectSignal(selectActiveSection);
  protected readonly condensed = signal(false);
  protected readonly progress = computed(() => this.motion.progress());

  private menuTl?: gsap.core.Timeline;
  private sectionTriggers: ScrollTrigger[] = [];

  constructor() {
    afterNextRender(() => {
      this.watchScroll();
      this.trackSections();
      this.buildMenuTimeline();

      // Las secciones solo existen en la portada. Al ir y volver de una página
      // legal hay que rehacer los triggers contra el DOM nuevo.
      const sub = this.router.events
        .pipe(filter((event) => event instanceof NavigationEnd))
        .subscribe(() => queueMicrotask(() => this.trackSections()));

      this.destroyRef.onDestroy(() => sub.unsubscribe());
    });

    // The menu is state in the store, so the animation follows the state —
    // never the other way round.
    effect(() => {
      const open = this.menuOpen();
      if (!this.menuTl) return;
      open ? this.menuTl.play() : this.menuTl.reverse();
      document.body.classList.toggle('is-locked', open);
      this.motion.setPaused(open);
    });
  }

  protected pad(n: number): string {
    return String(n).padStart(2, '0');
  }

  protected toggleMenu(): void {
    this.store.dispatch(UiActions.menuToggled());
  }

  protected go(event: Event, id: string): void {
    event.preventDefault();
    const wasOpen = this.menuOpen();
    this.store.dispatch(UiActions.menuClosed());

    // Desde una página legal no hay a dónde bajar: primero se vuelve a la
    // portada y allí se busca la sección.
    if (!this.onHome()) {
      this.router.navigate(['/'], { fragment: id });
      return;
    }

    // Deja que el menú empiece a cerrarse antes de que el scroll tome el mando.
    setTimeout(() => this.motion.scrollTo(`#${id}`), wasOpen ? 320 : 0);
  }

  private onHome(): boolean {
    return this.router.url.split(/[?#]/)[0] === '/';
  }

  /** Header retracts while reading downward, returns the instant you scroll back. */
  private watchScroll(): void {
    if (this.motion.reducedMotion()) return;

    const bar = this.bar().nativeElement;
    const show = gsap.quickTo(bar, 'yPercent', { duration: 0.45, ease: 'power3.out' });

    const trigger = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        const past = self.scroll() > 140;
        this.condensed.set(past);
        show(past && self.direction === 1 && !this.menuOpen() ? -120 : 0);
      },
    });

    this.destroyRef.onDestroy(() => trigger.kill());
  }

  /** Keeps the nav's current-section marker in sync with what is on screen. */
  private trackSections(): void {
    this.sectionTriggers.forEach((trigger) => trigger.kill());

    this.sectionTriggers = [{ id: 'inicio' }, ...this.links, { id: 'contacto' }]
      .map(({ id }) => {
        const el = document.getElementById(id);
        if (!el) return null;
        return ScrollTrigger.create({
          trigger: el,
          start: 'top 45%',
          end: 'bottom 45%',
          onToggle: (self) => self.isActive && this.store.dispatch(UiActions.sectionEntered({ id })),
        });
      })
      .filter(Boolean) as ScrollTrigger[];

    this.destroyRef.onDestroy(() => this.sectionTriggers.forEach((t) => t.kill()));
  }

  private buildMenuTimeline(): void {
    const panel = this.panel().nativeElement;
    gsap.set(panel, { autoAlpha: 0 });

    this.menuTl = gsap
      .timeline({ paused: true, defaults: { ease: 'power4.inOut' } })
      .set(panel, { autoAlpha: 1 })
      .fromTo(
        panel.querySelector('[data-menu-sheet]'),
        { clipPath: 'inset(0% 0% 100% 0%)' },
        { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.7 },
      )
      .from(
        panel.querySelectorAll('[data-menu-item]'),
        { yPercent: 110, opacity: 0, duration: 0.65, stagger: 0.055, ease: 'expo.out' },
        0.16,
      )
      .from(panel.querySelectorAll('[data-menu-meta]'), { opacity: 0, y: 16, duration: 0.5 }, 0.4);

    this.destroyRef.onDestroy(() => this.menuTl?.kill());
  }
}
