import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Lead } from './lead.model';

export const LeadActions = createActionGroup({
  source: 'Lead',
  events: {
    Submitted: props<{ lead: Lead }>(),
    'Submit Succeeded': props<{ reference: string }>(),
    'Submit Failed': props<{ message: string }>(),
    Reset: emptyProps(),
  },
});
