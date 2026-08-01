export interface ConsentChoice {
  /** Siempre true: las cookies técnicas no dependen del consentimiento. */
  necessary: true;
  analytics: boolean;
  marketing: boolean;
}

export interface StoredConsent {
  choice: ConsentChoice;
  /** ISO. Hay que poder demostrar cuándo se dio el consentimiento. */
  date: string;
  /**
   * Al cambiar las cookies que usa la web hay que volver a preguntar. Sube
   * este número y todos los consentimientos anteriores dejan de valer.
   */
  version: number;
}

export const CONSENT_VERSION = 1;
export const CONSENT_KEY = 'mw-consent';

export const ACCEPT_ALL: ConsentChoice = { necessary: true, analytics: true, marketing: true };
export const REJECT_ALL: ConsentChoice = { necessary: true, analytics: false, marketing: false };
