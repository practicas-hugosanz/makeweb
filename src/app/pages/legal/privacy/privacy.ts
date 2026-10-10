import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LEGAL } from '../../../data/legal';
import { LegalLayout } from '../legal-layout';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'mw-privacy',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LegalLayout, RouterLink],
  templateUrl: './privacy.html',
})
export class Privacy {
  protected readonly legal = LEGAL;
}
