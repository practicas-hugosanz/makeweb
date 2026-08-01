/**
 * Datos identificativos que aparecen en el aviso legal, la política de
 * privacidad y la de cookies.
 *
 * Todo lo que está EN MAYÚSCULAS es un hueco por rellenar: son datos legales y
 * no se pueden inventar. Cámbialos aquí una sola vez y quedan bien en las tres
 * páginas y en el pie.
 */
export const LEGAL = {
  brand: 'MakeWeb',
  /** Razón social completa, con la forma jurídica. */
  company: 'RAZÓN SOCIAL COMPLETA, S.L.',
  nif: 'NIF / CIF',
  /**
   * El estudio trabaja en remoto y no atiende público aquí, pero el domicilio
   * fiscal es obligatorio en el aviso legal (art. 10 LSSI-CE): pon el que
   * conste en Hacienda, aunque sea tu domicilio particular o el de la gestoría.
   */
  address: 'DOMICILIO FISCAL COMPLETO, CÓDIGO POSTAL, LOCALIDAD (PROVINCIA), España',
  /** Solo si es una sociedad; si eres autónomo, borra esta línea de la página. */
  registry: 'Registro Mercantil de PROVINCIA, tomo TOMO, folio FOLIO, hoja HOJA',
  email: 'hola@makeweb.es',
  privacyEmail: 'privacidad@makeweb.es',
  phone: '+34 600 00 00 00',
  domain: 'makeweb.es',
  site: 'https://makeweb.es',
  /** Quién aloja la web y dónde están los servidores. */
  host: {
    name: 'NOMBRE DEL PROVEEDOR DE ALOJAMIENTO',
    location: 'Unión Europea',
  },
  /** Actualiza esta fecha cada vez que cambies el contenido de las páginas. */
  updated: '1 de agosto de 2026',
} as const;

export interface LegalPageLink {
  path: string;
  label: string;
}

export const LEGAL_PAGES: readonly LegalPageLink[] = [
  { path: '/aviso-legal', label: 'Aviso legal' },
  { path: '/privacidad', label: 'Privacidad' },
  { path: '/cookies', label: 'Cookies' },
];

// ---------------------------------------------------------------------------
// Cookies
// ---------------------------------------------------------------------------

export interface CookieCategory {
  id: 'necessary' | 'analytics' | 'marketing';
  name: string;
  summary: string;
  /** Las técnicas no se pueden desactivar; el resto empiezan apagadas. */
  required: boolean;
}

export const COOKIE_CATEGORIES: readonly CookieCategory[] = [
  {
    id: 'necessary',
    name: 'Técnicas',
    summary:
      'Imprescindibles para que la web funcione y para recordar tu decisión sobre estas cookies. No se pueden desactivar y no requieren tu permiso.',
    required: true,
  },
  {
    id: 'analytics',
    name: 'Analíticas',
    summary:
      'Nos dicen cuánta gente entra y qué páginas lee, de forma agregada, para saber qué mejorar. Nunca para identificarte.',
    required: false,
  },
  {
    id: 'marketing',
    name: 'Publicitarias',
    summary:
      'Permitirían medir la eficacia de nuestros anuncios y mostrarte contenido relacionado fuera de esta web.',
    required: false,
  },
];

export interface CookieRow {
  name: string;
  owner: string;
  purpose: string;
  duration: string;
  category: CookieCategory['id'];
}

/**
 * Inventario real de cookies. Ahora mismo la web solo guarda la decisión del
 * banner; en cuanto conectes analítica o píxeles publicitarios, añade aquí una
 * fila por cada cookie con su nombre, titular, finalidad y plazo exactos.
 */
export const COOKIE_INVENTORY: readonly CookieRow[] = [
  {
    name: 'mw-consent',
    owner: `${'MakeWeb'} (propia)`,
    purpose: 'Guarda qué categorías de cookies has aceptado para no volver a preguntártelo.',
    duration: '12 meses',
    category: 'necessary',
  },
];
