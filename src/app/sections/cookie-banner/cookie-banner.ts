import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Store } from '@ngrx/store';
import { COOKIE_CATEGORIES } from '../../data/legal';
import { ConsentActions } from '../../state/consent/consent.actions';
import { selectAsking, selectDetailOpen } from '../../state/consent/consent.feature';
import { ConsentChoice } from '../../state/consent/consent.model';

type OptionalCategory = 'analytics' | 'marketing';

/**
 * Banner de cookies.
 *
 * Reglas que condicionan el diseño, no son decorativas:
 *
 * - Aceptar y rechazar tienen el mismo peso visual y el mismo número de clics.
 *   Un "rechazar" escondido detrás de un submenú invalida el consentimiento.
 * - Nada opcional se carga antes de que haya una respuesta: el estado arranca
 *   en `null` y `ConsentService.allows()` devuelve false mientras tanto.
 * - Cerrar sin elegir no cuenta como aceptar, así que el banner no se puede
 *   descartar: solo se sale decidiendo.
 *
 * La entrada es una animación CSS, no un tween de GSAP: `gsap.from()` deja el
 * elemento en opacidad 0 hasta que la línea de tiempo corre, y esto tiene que
 * verse aunque la animación no llegue a ejecutarse nunca.
 */
@Component({
  selector: 'mw-cookie-banner',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, MatSlideToggleModule],
  templateUrl: './cookie-banner.html',
  styleUrl: './cookie-banner.scss',
})
export class CookieBanner {
  private readonly store = inject(Store);

  protected readonly categories = COOKIE_CATEGORIES;
  protected readonly asking = this.store.selectSignal(selectAsking);
  protected readonly detailOpen = this.store.selectSignal(selectDetailOpen);

  /** Selección en curso mientras el panel de detalle está abierto. */
  protected readonly draft = signal<ConsentChoice>({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  protected acceptAll(): void {
    this.store.dispatch(ConsentActions.acceptedAll());
  }

  protected rejectAll(): void {
    this.store.dispatch(ConsentActions.rejectedAll());
  }

  protected toggleDetail(): void {
    this.store.dispatch(ConsentActions.panelToggled());
  }

  protected saveDraft(): void {
    this.store.dispatch(ConsentActions.saved({ choice: this.draft() }));
  }

  protected setCategory(id: string, value: boolean): void {
    if (id === 'necessary') return;
    this.draft.update((current) => ({ ...current, [id as OptionalCategory]: value }));
  }

  protected isOn(id: string): boolean {
    if (id === 'necessary') return true;
    return this.draft()[id as OptionalCategory];
  }
}
