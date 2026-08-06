import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
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

      if (this.motion.reducedMotion()) {
        // Sin movimiento: el mismo estado final, pero de un salto.
        this.menuTl.progress(open ? 1 : 0).pause();
      } else {
        // Las distancias del morfismo se miden en píxeles reales. Se recalculan
        // justo antes de abrir, y solo si la barra está entera: hacerlo a mitad
        // de un cierre tomaría como origen una posición intermedia.
        if (open && this.menuTl.progress() === 0) this.menuTl.invalidate();
        open ? this.menuTl.play() : this.menuTl.reverse();
      }

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

  protected go(event: Event, id: string, route?: string): void {
    event.preventDefault();
    const wasOpen = this.menuOpen();
    this.store.dispatch(UiActions.menuClosed());

    // Los precios viven en su propia página: ahí no hay sección a la que bajar.
    if (route) {
      this.router.navigateByUrl(route);
      return;
    }

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

  /**
   * La barra no se esconde para dejar sitio al menú: se convierte en él.
   *
   * La superficie de la píldora encoge hasta quedar del tamaño exacto del botón
   * de cerrar, y se queda ahí haciendo de círculo alrededor del aspa. Mientras,
   * el logotipo viaja al margen izquierdo y el botón al derecho, de modo que la
   * fila de arriba pasa a ser "logotipo … aspa" sin que nada aparezca ni
   * desaparezca de golpe. El botón de presupuesto se desvanece porque su sitio
   * lo ocupa el último elemento de la lista.
   *
   * Al cerrar, la línea de tiempo se reproduce al revés: el círculo se estira de
   * vuelta hasta reconstruir la píldora, y el logotipo y el botón vuelven con
   * ella. Todas las distancias son funciones y no números fijos: se recalculan
   * en cada apertura (`invalidate()`), así que girar el móvil no las descuadra.
   */
  private buildMenuTimeline(): void {
    const panel = this.panel().nativeElement;
    const inner = this.bar().nativeElement.querySelector<HTMLElement>('[data-bar-inner]')!;
    const shell = inner.querySelector<HTMLElement>('[data-bar-shell]')!;
    const brand = inner.querySelector<HTMLElement>('[data-bar-brand]')!;
    const cta = inner.querySelector<HTMLElement>('[data-bar-cta]')!;
    const burger = inner.querySelector<HTMLElement>('[data-bar-burger]')!;
    const sheet = panel.querySelector<HTMLElement>('[data-menu-sheet]')!;

    gsap.set(panel, { autoAlpha: 0 });

    // El margen de la página, resuelto: `--gutter` es un clamp() y leerlo del
    // :root devuelve la fórmula, no los píxeles. El panel del menú ya lo usa
    // como relleno lateral, así que se mide de ahí.
    const gutter = () => parseFloat(getComputedStyle(sheet).paddingLeft) || 20;

    const tl = gsap.timeline({ paused: true, defaults: { ease: 'power4.inOut', duration: 0.55 } });

    tl.to(
      shell,
      {
        width: () => burger.getBoundingClientRect().width,
        height: () => burger.getBoundingClientRect().height,
        x: () => window.innerWidth - gutter() - inner.getBoundingClientRect().right,
        y: () => (inner.getBoundingClientRect().height - burger.getBoundingClientRect().height) / 2,
      },
      0,
    )
      .to(brand, { x: () => gutter() - brand.getBoundingClientRect().left }, 0)
      .to(
        burger,
        {
          x: () =>
            window.innerWidth -
            gutter() -
            burger.getBoundingClientRect().width -
            burger.getBoundingClientRect().left,
        },
        0,
      )
      // El botón se va antes de que empiece el viaje: si se fuese a la vez, se
      // vería cruzar la pantalla por debajo del logotipo.
      .to(cta, { opacity: 0, scale: 0.92, duration: 0.22, ease: 'power2.in' }, 0)
      .set(cta, { pointerEvents: 'none' })
      // A partir de aquí, la apertura del panel de siempre.
      .set(panel, { autoAlpha: 1 }, 0.12)
      .fromTo(
        sheet,
        { clipPath: 'inset(0% 0% 100% 0%)' },
        { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.7 },
        0.12,
      )
      // `fromTo` y no `from`: estas animaciones sobreviven a un `invalidate()`.
      // Un `from()` invalidado vuelve a leer el estado actual como destino, y
      // como al invalidar los elementos están en su posición de partida
      // (opacidad 0), el destino pasaba a ser también opacidad 0 y la lista no
      // llegaba a aparecer nunca.
      .fromTo(
        panel.querySelectorAll('[data-menu-item]'),
        { yPercent: 110, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.65, stagger: 0.055, ease: 'expo.out' },
        0.28,
      )
      .fromTo(
        panel.querySelectorAll('[data-menu-cta]'),
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' },
        0.5,
      )
      .fromTo(
        panel.querySelectorAll('[data-menu-meta]'),
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.5 },
        0.6,
      );

    this.menuTl = tl;
    this.destroyRef.onDestroy(() => this.menuTl?.kill());
  }
}
