/** What a business owner tells us before we get on a call. */
export interface Lead {
  name: string;
  business: string;
  email: string;
  phone: string;
  /** Matches the `id` of an entry in SERVICES. */
  service: string;
  budget: string;
  message: string;
  consent: boolean;
}

export type LeadStatus = 'idle' | 'sending' | 'sent' | 'error';

export interface BudgetOption {
  id: string;
  label: string;
}

export const BUDGETS: readonly BudgetOption[] = [
  { id: 'under-1k', label: 'Menos de 1.000 €' },
  { id: '1k-3k', label: '1.000 € – 3.000 €' },
  { id: '3k-6k', label: '3.000 € – 6.000 €' },
  { id: 'over-6k', label: 'Más de 6.000 €' },
  { id: 'unsure', label: 'Aún no lo tengo claro' },
];
