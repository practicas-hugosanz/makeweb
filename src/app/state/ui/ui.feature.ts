import { createFeature, createReducer, on } from '@ngrx/store';
import { UiActions } from './ui.actions';

export interface UiState {
  /** True once the shell has rendered; the hero waits on it before animating. */
  booted: boolean;
  menuOpen: boolean;
  activeSection: string;
  /** El selector de líneas de WhatsApp, que se abre desde el botón y desde el pie. */
  whatsappOpen: boolean;
}

const initialState: UiState = {
  booted: false,
  menuOpen: false,
  activeSection: 'inicio',
  whatsappOpen: false,
};

export const uiFeature = createFeature({
  name: 'ui',
  reducer: createReducer(
    initialState,
    on(UiActions.bootCompleted, (state) => ({ ...state, booted: true })),
    // Abrir el menú a pantalla completa se lleva por delante el selector de
    // WhatsApp: no puede quedarse abierto debajo esperando a que se cierre.
    on(UiActions.menuToggled, (state) => ({
      ...state,
      menuOpen: !state.menuOpen,
      whatsappOpen: false,
    })),
    on(UiActions.menuClosed, (state) => ({ ...state, menuOpen: false })),
    on(UiActions.whatsappToggled, (state) => ({
      ...state,
      whatsappOpen: !state.whatsappOpen,
    })),
    on(UiActions.whatsappClosed, (state) => ({ ...state, whatsappOpen: false })),
    on(UiActions.sectionEntered, (state, { id }) => ({ ...state, activeSection: id })),
  ),
});

export const {
  name: uiFeatureKey,
  reducer: uiReducer,
  selectBooted,
  selectMenuOpen,
  selectActiveSection,
  selectWhatsappOpen,
} = uiFeature;
