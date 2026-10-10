import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { simpleWhatsapp } from '@ng-icons/simple-icons';
import { Store } from '@ngrx/store';
import { MotionService } from '../../core/animation/motion.service';
import { LEAD_LIMITS } from '../../core/forms/sanitize';
import { emailFormat, minTrimmed, notBlank } from '../../core/forms/validators';
import { LeadService } from '../../state/lead/lead.service';
import { UiActions } from '../../state/ui/ui.actions';
import { ISOTIPO_PATHS, ISOTIPO_VIEWBOX } from '../neon/isotipo';
import { QuickContactService } from './quick-contact.service';

type Status = 'idle' | 'sending' | 'sent' | 'error';

/**
 * El contacto rápido: una ventana con cuatro campos para quien tiene una
 * pregunta y no quiere rellenar el formulario de presupuesto entero. Se abre
 * al pulsar la M de neón, como el colibrí de la web de Sourati.
 *
 * Es un `<dialog>` nativo abierto con `showModal()`: el navegador ya atrapa el
 * foco dentro, cierra con Escape y deja inerte el resto de la página.
 */
@Component({
  selector: 'mw-quick-contact',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatCheckboxModule, RouterLink, NgIcon],
  providers: [provideIcons({ simpleWhatsapp })],
  templateUrl: './quick-contact.html',
  styleUrl: './quick-contact.scss',
})
export class QuickContact {
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');
  private readonly quick = inject(QuickContactService);
  private readonly leads = inject(LeadService);
  private readonly store = inject(Store);
  private readonly motion = inject(MotionService);
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly limits = LEAD_LIMITS;
  protected readonly isoPaths = ISOTIPO_PATHS;
  protected readonly isoViewBox = ISOTIPO_VIEWBOX;
  protected readonly status = signal<Status>('idle');
  protected readonly error = signal('');

  protected readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, notBlank, minTrimmed(2), Validators.maxLength(LEAD_LIMITS.name)]],
    email: ['', [Validators.required, emailFormat, Validators.maxLength(LEAD_LIMITS.email)]],
    phone: ['', [Validators.pattern(/^[+0-9 ()-]{9,20}$/)]],
    message: [
      '',
      [Validators.required, notBlank, minTrimmed(6), Validators.maxLength(LEAD_LIMITS.message)],
    ],
    consent: [false, Validators.requiredTrue],
  });

  constructor() {
    effect(() => {
      const el = this.dialog().nativeElement;
      const open = this.quick.isOpen();
      if (open && !el.open) {
        el.showModal();
        this.motion.setPaused(true);
      } else if (!open && el.open) {
        el.close();
      }
    });
  }

  /** El `<dialog>` se cierra también con Escape: el estado tiene que enterarse. */
  protected onClosed(): void {
    this.quick.close();
    this.motion.setPaused(false);
    if (this.status() === 'sent') this.reset();
  }

  /** Pulsar en el fondo oscuro, fuera de la caja, cierra. */
  protected onBackdrop(event: MouseEvent): void {
    if (event.target === this.dialog().nativeElement) this.quick.close();
  }

  protected close(): void {
    this.quick.close();
  }

  protected whatsapp(): void {
    this.quick.close();
    this.store.dispatch(UiActions.whatsappToggled({ anchor: 'fab' }));
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.status.set('sending');
    this.error.set('');
    const sub = this.leads.sendQuick(this.form.getRawValue()).subscribe({
      next: () => this.status.set('sent'),
      error: (e: Error) => {
        this.status.set('error');
        this.error.set(e.message);
      },
    });
    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }

  private reset(): void {
    this.status.set('idle');
    this.error.set('');
    this.form.reset();
  }
}
