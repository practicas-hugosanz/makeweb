import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  viewChild,
} from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter } from 'rxjs';
import { AnalyticsService } from './core/analytics.service';
import { MotionService } from './core/animation/motion.service';
import { CookieBanner } from './sections/cookie-banner/cookie-banner';
import { Header } from './sections/header/header';
import { ConsentActions } from './state/consent/consent.actions';
import { ConsentService } from './state/consent/consent.service';
import { UiActions } from './state/ui/ui.actions';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, Header, CookieBanner],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly wrapper = viewChild.required<ElementRef<HTMLElement>>('wrapper');
  private readonly content = viewChild.required<ElementRef<HTMLElement>>('content');
  private readonly motion = inject(MotionService);
  private readonly store = inject(Store);
  private readonly consent = inject(ConsentService);
  // Se instancia aquí para que quede escuchando el consentimiento desde el
  // arranque; no carga nada hasta que hay permiso y un identificador.
  private readonly analytics = inject(AnalyticsService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {
      this.motion.init(this.wrapper().nativeElement, this.content().nativeElement);

      // Nada bloquea el primer pintado, así que la página está "arrancada" en
      // cuanto se ha renderizado. La portada espera a esto para su intro.
      document.body.classList.remove('js-loading');
      this.store.dispatch(UiActions.bootCompleted());

      // Lo que el visitante decidió sobre cookies en una visita anterior. Si no
      // hay nada guardado, el banner aparece.
      this.store.dispatch(ConsentActions.restored({ choice: this.consent.read() }));

      // Las fuentes tardías cambian todas las medidas de la página.
      document.fonts.ready.then(() => this.motion.refresh());

      this.watchNavigation();
    });
  }

  /**
   * Cambiar de página no mueve el scroll por sí solo cuando lo controla
   * ScrollSmoother: hay que llevarlo arriba a mano y volver a medir, porque la
   * página nueva tiene otra altura y otras posiciones.
   *
   * Excepto cuando la navegación lleva fragmento (`/#precios`, al pulsar una
   * sección desde una página legal): ahí el destino no es el principio, y subir
   * arriba pelearía con el salto a la sección que hace la portada.
   */
  private watchNavigation(): void {
    const sub = this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        if (!event.urlAfterRedirects.includes('#')) this.motion.scrollToTop();
        setTimeout(() => this.motion.refresh(), 0);
      });

    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }
}
