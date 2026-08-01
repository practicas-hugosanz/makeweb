import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { ConsentChoice } from './consent.model';

export const ConsentActions = createActionGroup({
  source: 'Consent',
  events: {
    /** Lo que había guardado de una visita anterior, o null si no había nada. */
    Restored: props<{ choice: ConsentChoice | null }>(),
    'Accepted All': emptyProps(),
    'Rejected All': emptyProps(),
    Saved: props<{ choice: ConsentChoice }>(),
    /** Reabre el panel desde el pie o desde la página de cookies. */
    Reopened: emptyProps(),
    'Panel Toggled': emptyProps(),
  },
});
