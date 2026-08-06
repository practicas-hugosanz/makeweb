import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { MotionService } from '../../core/animation/motion.service';
import { LEGAL_PAGES } from '../../data/legal';
import { ConsentActions } from '../../state/consent/consent.actions';

@Component({
  selector: 'mw-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  private readonly motion = inject(MotionService);
  private readonly router = inject(Router);
  private readonly store = inject(Store);

  protected readonly legalPages = LEGAL_PAGES;
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

  protected openCookiePrefs(): void {
    this.store.dispatch(ConsentActions.reopened());
  }

  private onHome(): boolean {
    return this.router.url.split(/[?#]/)[0] === '/';
  }
}
