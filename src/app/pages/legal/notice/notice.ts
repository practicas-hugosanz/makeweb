import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LEGAL, PHONES } from '../../../data/legal';
import { LegalLayout } from '../legal-layout';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'mw-legal-notice',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LegalLayout, RouterLink],
  templateUrl: './notice.html',
})
export class LegalNotice {
  protected readonly legal = LEGAL;
  protected readonly phones = PHONES;
}
