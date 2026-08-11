import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  effect,
  inject,
} from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { simpleWhatsapp } from '@ng-icons/simple-icons';
import { Store } from '@ngrx/store';
import { PHONES, Phone, whatsappLink } from '../../data/legal';
import { selectAsking } from '../../state/consent/consent.feature';
import { UiActions } from '../../state/ui/ui.actions';
import {
  selectBooted,
  selectMenuOpen,
  selectWhatsappOpen,
} from '../../state/ui/ui.feature';

/**
 * Botón flotante de WhatsApp, abajo a la izquierda.
 *
 * Hay dos líneas, así que pulsarlo no abre un chat: abre la lista para elegir
 * con cuál se habla. Cada opción sale a `wa.me`, que decide sola entre la app
 * y WhatsApp Web según el aparato.
 *
 * Quién está abierto vive en el store y no aquí, porque el enlace de WhatsApp
 * del pie abre esta misma lista: son dos mandos de una sola cosa.
 *
 * Cuándo NO se ve, que es lo que condiciona el diseño:
 *
 * - Mientras el aviso de cookies pide respuesta. Ocupan la misma esquina, y el
 *   consentimiento no se decide con un botón encima.
 * - Con el menú de navegación abierto, que en móvil ocupa la pantalla entera.
 * - Antes de que el arranque haya restaurado el consentimiento: si apareciera
 *   antes, se vería un parpadeo de botón justo antes de salir el aviso.
 */
@Component({
  selector: 'mw-whatsapp',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIcon],
  // La marca de WhatsApp viene del paquete, no copiada a mano en la plantilla:
  // `@ng-icons/simple-icons` trae el trazado oficial y solo se empaqueta el
  // icono que se declara aquí.
  providers: [provideIcons({ simpleWhatsapp })],
  templateUrl: './whatsapp.html',
  styleUrl: './whatsapp.scss',
})
export class Whatsapp {
  private readonly store = inject(Store);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);

  private readonly booted = this.store.selectSignal(selectBooted);
  private readonly asking = this.store.selectSignal(selectAsking);
  private readonly menuOpen = this.store.selectSignal(selectMenuOpen);

  protected readonly visible = computed(
    () => this.booted() && !this.asking() && !this.menuOpen(),
  );
  protected readonly open = this.store.selectSignal(selectWhatsappOpen);
  protected readonly phones = PHONES;

  constructor() {
    afterNextRender(() => {
      // Cerrar al pulsar fuera y con Escape: es un desplegable, no un diálogo.
      // El puntero se escucha en fase de captura para que también cierre cuando
      // el clic cae sobre algo que detiene la propagación.
      //
      // El enlace del pie queda exento: es el otro mando de esto mismo, y sin
      // la excepción el `pointerdown` cerraría la lista justo antes de que su
      // `click` la volviera a abrir, con lo que nunca se podría cerrar desde él.
      const onPointerDown = (event: Event) => {
        if (!this.open()) return;
        const target = event.target as HTMLElement;
        if (this.host.nativeElement.contains(target)) return;
        if (target.closest('[data-wa-trigger]')) return;
        this.store.dispatch(UiActions.whatsappClosed());
      };

      const onKeyDown = (event: KeyboardEvent) => {
        if (event.key !== 'Escape' || !this.open()) return;
        this.store.dispatch(UiActions.whatsappClosed());
        this.host.nativeElement.querySelector<HTMLElement>('[data-wa-toggle]')?.focus();
      };

      document.addEventListener('pointerdown', onPointerDown, true);
      document.addEventListener('keydown', onKeyDown);

      this.destroyRef.onDestroy(() => {
        document.removeEventListener('pointerdown', onPointerDown, true);
        document.removeEventListener('keydown', onKeyDown);
      });
    });

    // Si el botón desaparece con la lista desplegada —al reabrir el aviso de
    // cookies desde el pie, sin ir más lejos—, la lista no puede seguir abierta
    // esperando a que vuelva.
    effect(() => {
      if (!this.visible() && this.open()) this.store.dispatch(UiActions.whatsappClosed());
    });
  }

  protected toggle(): void {
    this.store.dispatch(UiActions.whatsappToggled());
  }

  protected link(phone: Phone): string {
    return whatsappLink(phone);
  }
}
