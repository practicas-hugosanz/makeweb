/** What a business owner tells us before we get on a call. */
export interface Lead {
  name: string;
  business: string;
  email: string;
  phone: string;
  /** Coincide con el `id` de un plan de PLANS, de OTHER_PROJECTS, o 'sin-decidir'. */
  plan: string;
  /** Con qué presencia digital parte hoy. */
  current: string;
  message: string;
  consent: boolean;
}

/** Lo que llega desde el contacto rápido: menos campos, para una pregunta. */
export interface QuickMessage {
  name: string;
  email: string;
  phone: string;
  message: string;
  consent: boolean;
}

export type LeadStatus = 'idle' | 'sending' | 'sent' | 'error';

export interface ChoiceOption {
  id: string;
  label: string;
}

/**
 * De qué parte el negocio.
 *
 * Sustituye a la horquilla de presupuesto, que preguntaba entre 1.000 € y más
 * de 6.000 € cuando lo que se vende va de 350 € a 1.100 €: cualquiera habría
 * marcado "menos de 1.000" y el campo no habría dicho nada. Esto sí se traduce
 * en trabajo: rehacer una web vieja conservando su posicionamiento no se parece
 * en nada a partir de cero.
 */
export const STARTING_POINTS: readonly ChoiceOption[] = [
  { id: 'nada', label: $localize`Nada todavía, o solo redes sociales` },
  { id: 'web-vieja', label: $localize`Una web antigua que quiero rehacer` },
  { id: 'web-ok', label: $localize`Una web que funciona, pero quiero mejorarla` },
  { id: 'por-abrir', label: $localize`El negocio abre pronto y aún no hay nada` },
];

/**
 * Lo que no es una web de plan: se elige en la misma lista que los planes, y
 * cada uno se presupuesta aparte.
 */
export const OTHER_PROJECTS: readonly ChoiceOption[] = [
  { id: 'tienda', label: $localize`Tienda online` },
  { id: 'software', label: $localize`Software a medida` },
  { id: 'ia', label: $localize`Inteligencia artificial` },
  { id: 'otra', label: $localize`Otra solución informática` },
];

/** La opción que se añade a los planes para quien todavía no ha elegido. */
export const UNDECIDED_PLAN: ChoiceOption = {
  id: 'sin-decidir',
  label: $localize`Aún no lo sé`,
};
