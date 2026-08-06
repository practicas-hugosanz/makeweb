import { DestroyRef, Injectable, NgZone, inject, signal } from '@angular/core';
import { gsap, ScrollSmoother, ScrollTrigger } from './gsap';

/**
 * Owns the page-level scroll rig: the ScrollSmoother instance, the global
 * "reduced motion" switch, and the anchor navigation everything else calls.
 *
 * Components never create a smoother themselves; they ask for `smoother()` or
 * simply build ScrollTriggers, which stay in sync automatically.
 */
@Injectable({ providedIn: 'root' })
export class MotionService {
  private readonly zone = inject(NgZone);

  private smoother: ScrollSmoother | null = null;

  /** Section id currently under the viewport centre. */
  readonly activeSection = signal<string>('inicio');
  /** True when the OS asks for reduced motion — all decorative motion opts out. */
  readonly reducedMotion = signal(
    typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  /** Creates the smoother. Call once, from the shell component, after render. */
  init(wrapper: HTMLElement, content: HTMLElement): void {
    if (this.smoother || this.reducedMotion()) {
      // Reduced motion keeps native scrolling: no smoothing, no lag.
      document.documentElement.style.scrollBehavior = 'auto';
      return;
    }

    // The browser restores the previous scroll offset before the smoother
    // exists; ScrollSmoother would then start from 0 while the window sits
    // mid-page, leaving the content frozen. The page opens on the preloader
    // anyway, so start every visit at the top.
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);

    this.zone.runOutsideAngular(() => {
      this.smoother = ScrollSmoother.create({
        wrapper,
        content,
        smooth: 0.9,
        smoothTouch: 0,
        effects: true, // enables data-speed / data-lag on any element
        // normalizeScroll intercepts wheel and touch input to drive scrolling
        // in JS. It fixes mobile address-bar resizing, but on desktop it turns
        // every wheel tick into main-thread work and is what made the page feel
        // heavy. The browser's own scrolling is smoother here.
        normalizeScroll: false,
        ignoreMobileResize: true,
      });

      this.watchHeight(content);
      this.followFocus();
    });
  }

  /**
   * ScrollSmoother mete el contenido en un contenedor `position: fixed` y lo
   * mueve con `transform`. El navegador, cuando el foco salta a un elemento
   * fuera de la vista, intenta desplazarlo a la vista y no encuentra nada que
   * desplazar: navegando con el tabulador el foco acababa en elementos
   * invisibles. Aquí se hace a mano lo que el navegador ya no puede hacer.
   */
  private followFocus(): void {
    document.addEventListener('focusin', (event) => {
      const el = event.target as HTMLElement | null;
      if (!el || !this.smoother) return;

      // El menú y el banner de cookies son `position: fixed`: ya se ven.
      if (el.closest('#smooth-content') === null) return;

      const rect = el.getBoundingClientRect();
      const margin = 96; // deja hueco bajo la cabecera fija
      const fitsOnScreen = rect.top >= margin && rect.bottom <= window.innerHeight - 24;
      if (fitsOnScreen) return;

      this.smoother.scrollTo(el, false, `center center`);
    });
  }

  /**
   * Anything that changes the page height — a FAQ answer opening, a font
   * landing late, a section swapping its content — invalidates every scroll
   * position ScrollTrigger has cached. Without this the triggers below the
   * change fire at the wrong place, or never fire at all.
   */
  private watchHeight(content: HTMLElement): void {
    let last = content.offsetHeight;
    let queued = 0;

    const observer = new ResizeObserver(() => {
      if (Math.abs(content.offsetHeight - last) < 2) return;
      last = content.offsetHeight;
      clearTimeout(queued);
      queued = window.setTimeout(() => ScrollTrigger.refresh(), 120);
    });

    observer.observe(content);
  }

  /** Smooth-scrolls to an element or selector, accounting for the fixed header. */
  scrollTo(target: string | Element, offset = 0): void {
    const el = typeof target === 'string' ? document.querySelector(target) : target;
    if (!el) return;

    if (this.smoother) {
      this.smoother.scrollTo(el, true, `top ${72 + offset}px`);
      return;
    }
    const top = el.getBoundingClientRect().top + window.scrollY - (72 + offset);
    window.scrollTo({ top, behavior: this.reducedMotion() ? 'auto' : 'smooth' });
  }

  /** Jumps to the top with no animation. Used when changing page. */
  scrollToTop(): void {
    if (this.smoother) {
      this.smoother.scrollTo(0, false);
      return;
    }
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  /** Pauses/resumes smoothing — used while the mobile menu is open. */
  setPaused(paused: boolean): void {
    this.smoother?.paused(paused);
  }

  /** Recalculates every trigger. Call after fonts load or layout changes. */
  refresh(): void {
    ScrollTrigger.refresh();
  }

  /**
   * Runs `build` inside a gsap.context() scoped to `root` and reverts it when
   * the calling component is destroyed. This is what keeps ScrollTriggers from
   * leaking across route changes or hot reloads.
   */
  scope(root: Element, build: (ctx: gsap.Context) => void, destroyRef: DestroyRef): void {
    if (this.reducedMotion()) return;

    let ctx: gsap.Context;
    this.zone.runOutsideAngular(() => {
      ctx = gsap.context(build, root);
    });
    destroyRef.onDestroy(() => ctx?.revert());
  }
}
