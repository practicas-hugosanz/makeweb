import { createFeature, createReducer, on } from '@ngrx/store';
import { UiActions, WhatsappAnchor } from './ui.actions';

export interface UiState {
  /** True once the shell has rendered; the hero waits on it before animating. */
  booted: boolean;
  menuOpen: boolean;
  activeSection: string;
  /**
   * Desde dónde está abierto el selector de líneas de WhatsApp, o `null` si no
   * lo está. Guardar el origen y no un booleano es lo que permite que la lista
   * salga pegada a lo que se ha pulsado y no en la otra punta de la pantalla.
   */
  whatsappOpen: WhatsappAnchor | null;
}

const initialState: UiState = {
  booted: false,
  menuOpen: false,
  activeSection: 'inicio',
  whatsappOpen: null,
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
      whatsappOpen: null,
    })),
    on(UiActions.menuClosed, (state) => ({ ...state, menuOpen: false })),
    // Pulsar el mismo origen otra vez cierra; pulsar el otro mueve la lista allí.
    on(UiActions.whatsappToggled, (state, { anchor }) => ({
      ...state,
      whatsappOpen: state.whatsappOpen === anchor ? null : anchor,
    })),
    on(UiActions.whatsappClosed, (state) => ({ ...state, whatsappOpen: null })),
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
