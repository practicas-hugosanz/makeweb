import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs';
import { ConsentActions } from './consent.actions';
import { ConsentService } from './consent.service';
import { ACCEPT_ALL, ConsentChoice, REJECT_ALL } from './consent.model';

/**
 * Cualquier decisión, venga del botón que venga, se guarda igual: con su fecha
 * y la versión del inventario de cookies vigente en ese momento.
 */
export const persistConsent = createEffect(
  (actions$ = inject(Actions), consent = inject(ConsentService)) =>
    actions$.pipe(
      ofType(ConsentActions.acceptedAll, ConsentActions.rejectedAll, ConsentActions.saved),
      tap((action) => {
        let choice: ConsentChoice;

        switch (action.type) {
          case ConsentActions.acceptedAll.type:
            choice = ACCEPT_ALL;
            break;
          case ConsentActions.rejectedAll.type:
            choice = REJECT_ALL;
            break;
          default:
            choice = action.choice;
        }

        consent.write(choice);
      }),
    ),
  { functional: true, dispatch: false },
);
