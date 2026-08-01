import { createFeature, createReducer, on } from '@ngrx/store';
import { LeadActions } from './lead.actions';
import { LeadStatus } from './lead.model';

export interface LeadState {
  status: LeadStatus;
  reference: string | null;
  error: string | null;
}

const initialState: LeadState = {
  status: 'idle',
  reference: null,
  error: null,
};

export const leadFeature = createFeature({
  name: 'lead',
  reducer: createReducer(
    initialState,
    on(LeadActions.submitted, (state) => ({ ...state, status: 'sending' as const, error: null })),
    on(LeadActions.submitSucceeded, (_, { reference }) => ({
      status: 'sent' as const,
      reference,
      error: null,
    })),
    on(LeadActions.submitFailed, (state, { message }) => ({
      ...state,
      status: 'error' as const,
      error: message,
    })),
    on(LeadActions.reset, () => initialState),
  ),
});

export const {
  name: leadFeatureKey,
  reducer: leadReducer,
  selectStatus,
  selectReference,
  selectError,
} = leadFeature;
