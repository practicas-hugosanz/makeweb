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
import { selectAsking } from '../../state/consent/consent.feature';
import { UiActions } from '../../state/ui/ui.actions';
import { selectBooted, selectMenuOpen, selectWhatsappOpen } from '../../state/ui/ui.feature';
import { WhatsappLines } from './whatsapp-lines';

/**
 * Botón flotante de WhatsApp, en la esquina inferior izquierda.
 *
 * Hay dos líneas, así que pulsarlo no abre un chat: despliega la lista para
 * elegir con cuál se habla. Cada opción sale a `wa.me`, que decide sola entre
 * la app y WhatsApp Web según el aparato.
 *
 * La lista sale de `mw-whatsapp-lines`, compartida con el enlace del pie, y
 * aparece **pegada al botón** porque el estado guarda desde dónde se abrió.
 * Antes había un solo booleano y pulsar en el pie desplegaba el panel aquí, en
 * la otra punta de la pantalla, lejos de donde se había pulsado.
 *
 * Este componente es además quien escucha el cierre —pulsar fuera y Escape—
 * para los dos sitios: siempre está montado, así que no hace falta duplicar los
 * oyentes en el pie.
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
  imports: [NgIcon, WhatsappLines],
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
  private readonly anchor = this.store.selectSignal(selectWhatsappOpen);

  protected readonly visible = computed(
    () => this.booted() && !this.asking() && !this.menuOpen(),
  );
  protected readonly open = computed(() => this.anchor() === 'fab');

  constructor() {
    afterNextRender(() => {
      // Cerrar al pulsar fuera y con Escape: es un desplegable, no un diálogo.
      // El puntero se escucha en fase de captura para que también cierre cuando
      // el clic cae sobre algo que detiene la propagación.
      //
      // Quedan exentos los mandos y los paneles, estén donde estén: sin esa
      // excepción, el `pointerdown` cerraría la lista justo antes de que el
      // `click` del pie la volviera a abrir, y no habría forma de cerrarla
      // desde ahí.
      const onPointerDown = (event: Event) => {
        if (!this.anchor()) return;
        const target = event.target as HTMLElement;
        if (target.closest('[data-wa-trigger], [data-wa-panel]')) return;
        this.store.dispatch(UiActions.whatsappClosed());
      };

      const onKeyDown = (event: KeyboardEvent) => {
        if (event.key !== 'Escape' || !this.anchor()) return;
        // Devuelve el foco al mando que la abrió, no siempre a este botón.
        const abridor = this.anchor() === 'fab' ? '[data-wa-toggle]' : '[data-wa-footer-toggle]';
        this.store.dispatch(UiActions.whatsappClosed());
        document.querySelector<HTMLElement>(abridor)?.focus();
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
    this.store.dispatch(UiActions.whatsappToggled({ anchor: 'fab' }));
  }
}
