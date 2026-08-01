import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { RevealDirective } from '../../core/animation/reveal.directive';
import { FAQS } from '../../data/content';

@Component({
  selector: 'mw-faq',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatExpansionModule, RevealDirective],
  templateUrl: './faq.html',
  styleUrl: './faq.scss',
})
export class Faq {
  protected readonly faqs = FAQS;

  /** Index of the open question, or -1 when they are all closed. */
  protected readonly open = signal(0);

  /**
   * Closing the panel that is already open has to reset the marker too.
   * The guard matters when *switching* panels: the accordion opens the new one
   * first and only then closes the old one, so an unguarded reset here would
   * wipe out the index that was just set.
   */
  protected onClosed(index: number): void {
    if (this.open() === index) this.open.set(-1);
  }
}
