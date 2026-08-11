import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { simpleWhatsapp } from '@ng-icons/simple-icons';
import { Store } from '@ngrx/store';
import { MotionService } from '../../core/animation/motion.service';
import { LEGAL_PAGES, PHONES } from '../../data/legal';
import { ConsentActions } from '../../state/consent/consent.actions';
import { UiActions } from '../../state/ui/ui.actions';
import { selectWhatsappOpen } from '../../state/ui/ui.feature';
import { WhatsappLines } from '../whatsapp/whatsapp-lines';

@Component({
  selector: 'mw-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, NgIcon, WhatsappLines],
  providers: [provideIcons({ simpleWhatsapp })],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  private readonly motion = inject(MotionService);
  private readonly router = inject(Router);
  private readonly store = inject(Store);

  protected readonly legalPages = LEGAL_PAGES;
  protected readonly phones = PHONES;
  private readonly whatsappAnchor = this.store.selectSignal(selectWhatsappOpen);

  /** Solo cuando se abrió desde aquí: en la esquina lo enseña el botón flotante. */
  protected readonly whatsappOpen = computed(() => this.whatsappAnchor() === 'footer');

  protected readonly year = new Date().getFullYear();

  protected toTop(event: Event): void {
    event.preventDefault();
    if (!this.onHome()) {
      this.router.navigate(['/']);
      return;
    }
    this.motion.scrollTo('#inicio');
  }

  protected go(event: Event, id: string): void {
    event.preventDefault();
    if (!this.onHome()) {
      this.router.navigate(['/'], { fragment: id });
      return;
    }
    this.motion.scrollTo(`#${id}`);
  }

  protected openWhatsapp(): void {
    this.store.dispatch(UiActions.whatsappToggled({ anchor: 'footer' }));
  }

  protected openCookiePrefs(): void {
    this.store.dispatch(ConsentActions.reopened());
  }

  private onHome(): boolean {
    return this.router.url.split(/[?#]/)[0] === '/';
  }
}
