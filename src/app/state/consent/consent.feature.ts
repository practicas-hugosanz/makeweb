import { createFeature, createReducer, on } from '@ngrx/store';
import { ConsentActions } from './consent.actions';
import { ACCEPT_ALL, ConsentChoice, REJECT_ALL } from './consent.model';

export interface ConsentState {
  /** null mientras no se sepa: ni preguntado ni restaurado todavía. */
  choice: ConsentChoice | null;
  /** true cuando hay que enseñar el banner. */
  asking: boolean;
  /** true cuando el detalle por categorías está abierto. */
  detailOpen: boolean;
}

const initialState: ConsentState = {
  choice: null,
  asking: false,
  detailOpen: false,
};

export const consentFeature = createFeature({
  name: 'consent',
  reducer: createReducer(
    initialState,
    on(ConsentActions.restored, (state, { choice }) => ({
      ...state,
      choice,
      asking: choice === null,
    })),
    on(ConsentActions.acceptedAll, () => ({
      choice: ACCEPT_ALL,
      asking: false,
      detailOpen: false,
    })),
    on(ConsentActions.rejectedAll, () => ({
      choice: REJECT_ALL,
      asking: false,
      detailOpen: false,
    })),
    on(ConsentActions.saved, (_, { choice }) => ({
      choice,
      asking: false,
      detailOpen: false,
    })),
    on(ConsentActions.reopened, (state) => ({ ...state, asking: true, detailOpen: true })),
    on(ConsentActions.panelToggled, (state) => ({ ...state, detailOpen: !state.detailOpen })),
  ),
});

export const {
  name: consentFeatureKey,
  reducer: consentReducer,
  selectChoice,
  selectAsking,
  selectDetailOpen,
} = consentFeature;
