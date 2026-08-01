import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of } from 'rxjs';
import { LeadActions } from './lead.actions';
import { LeadService } from './lead.service';

/**
 * `exhaustMap` is deliberate: a double-click on "Enviar" must not create a
 * second lead while the first request is still in flight.
 */
export const submitLead = createEffect(
  (actions$ = inject(Actions), leads = inject(LeadService)) =>
    actions$.pipe(
      ofType(LeadActions.submitted),
      exhaustMap(({ lead }) =>
        leads.send(lead).pipe(
          map(({ reference }) => LeadActions.submitSucceeded({ reference })),
          catchError((error: Error) =>
            of(
              LeadActions.submitFailed({
                message: error.message || 'No hemos podido enviar el mensaje. Inténtalo otra vez.',
              }),
            ),
          ),
        ),
      ),
    ),
  { functional: true },
);
