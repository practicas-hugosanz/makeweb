import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { Store } from '@ngrx/store';
import { PHONES, Phone, whatsappLink } from '../../data/legal';
import { UiActions } from '../../state/ui/ui.actions';

/**
 * La lista para elegir con cuál de las dos líneas se habla.
 *
 * Existe como componente porque se abre desde dos sitios —el botón flotante y
 * el enlace del pie— y cada uno la ancla junto a sí mismo. Lo que cambia es
 * dónde aparece; lo que se ve dentro, no.
 */
@Component({
  selector: 'mw-whatsapp-lines',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p class="wal__title">Hablamos por WhatsApp</p>
    <p class="wal__note">Elige una de las dos líneas. Respondemos de 10:00 a 00:00.</p>

    <ul class="wal__list">
      @for (phone of phones; track phone.e164) {
        <li>
          <a
            class="wal__pick"
            role="menuitem"
            [href]="link(phone)"
            target="_blank"
            rel="noopener noreferrer"
            (click)="choose()"
          >
            <span class="wal__pick-label">{{ phone.label }}</span>
            <span class="wal__pick-number">{{ phone.display }}</span>
          </a>
        </li>
      }
    </ul>
  `,
  styleUrl: './whatsapp-lines.scss',
})
export class WhatsappLines {
  private readonly store = inject(Store);

  protected readonly phones = PHONES;
  readonly chosen = output<void>();

  protected link(phone: Phone): string {
    return whatsappLink(phone);
  }

  protected choose(): void {
    this.store.dispatch(UiActions.whatsappClosed());
    this.chosen.emit();
  }
}
