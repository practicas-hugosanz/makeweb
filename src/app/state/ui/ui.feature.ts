import { createFeature, createReducer, on } from '@ngrx/store';
import { UiActions } from './ui.actions';

export interface UiState {
  /** True once the shell has rendered; the hero waits on it before animating. */
  booted: boolean;
  menuOpen: boolean;
  activeSection: string;
}

const initialState: UiState = {
  booted: false,
  menuOpen: false,
  activeSection: 'inicio',
};

export const uiFeature = createFeature({
  name: 'ui',
  reducer: createReducer(
    initialState,
    on(UiActions.bootCompleted, (state) => ({ ...state, booted: true })),
    on(UiActions.menuToggled, (state) => ({ ...state, menuOpen: !state.menuOpen })),
    on(UiActions.menuClosed, (state) => ({ ...state, menuOpen: false })),
    on(UiActions.sectionEntered, (state, { id }) => ({ ...state, activeSection: id })),
  ),
});

export const {
  name: uiFeatureKey,
  reducer: uiReducer,
  selectBooted,
  selectMenuOpen,
  selectActiveSection,
} = uiFeature;
