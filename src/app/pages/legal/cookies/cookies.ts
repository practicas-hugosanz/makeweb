import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { COOKIE_CATEGORIES, COOKIE_INVENTORY, LEGAL } from '../../../data/legal';
import { ConsentActions } from '../../../state/consent/consent.actions';
import { selectChoice } from '../../../state/consent/consent.feature';
import { LegalLayout } from '../legal-layout';

@Component({
  selector: 'mw-cookies',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LegalLayout],
  templateUrl: './cookies.html',
})
export class Cookies {
  private readonly store = inject(Store);

  protected readonly legal = LEGAL;
  protected readonly categories = COOKIE_CATEGORIES;
  protected readonly inventory = COOKIE_INVENTORY;

  private readonly choice = this.store.selectSignal(selectChoice);

  /** Lo que el visitante tiene decidido ahora mismo, en una frase. */
  protected readonly current = computed(() => {
    const choice = this.choice();
    if (!choice) return 'Todavía no has elegido.';

    const on = this.categories
      .filter((c) => !c.required && choice[c.id as 'analytics' | 'marketing'])
      .map((c) => c.name.toLowerCase());

    return on.length
      ? `Ahora mismo tienes activadas las cookies ${on.join(' y ')}.`
      : 'Ahora mismo solo están activas las cookies técnicas.';
  });

  protected reopen(): void {
    this.store.dispatch(ConsentActions.reopened());
  }
}
