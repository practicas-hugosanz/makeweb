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
  /**
   * Los titulares del sitio, cada uno con su NIF.
   *
   * No hay sociedad: son dos autónomos que operan bajo la marca MakeWeb, así
   * que el artículo 10 de la LSSI-CE pide identificar a los dos, no a una razón
   * social. Por lo mismo no hay datos registrales: un autónomo no se inscribe
   * en el Registro Mercantil, y esa fila se retiró de `notice.html`.
   */
  owners: [
    { name: 'Hugo Sanz Abad', nif: '50507227D' },
    { name: 'Lucas Segovia Sánchez', nif: '51253727K' },
  ],
  /** Los dos titulares en una línea, para las frases corridas. */
  company: 'Hugo Sanz Abad y Lucas Segovia Sánchez',
  /**
   * El estudio trabaja en remoto y no atiende público aquí, pero el domicilio
   * fiscal es obligatorio en el aviso legal (art. 10 LSSI-CE), y completo:
   * calle, número, código postal, localidad y provincia.
   */
  address: 'Calle del Marge, 1, 03110 Mutxamel (Alicante), España',
  email: 'contacto@makeweb.es',
  privacyEmail: 'contacto@makeweb.es',
  domain: 'makeweb.es',
  site: 'https://makeweb.es',
  /**
   * Quién aloja la web y dónde están los servidores.
   *
   * Es GitHub Pages porque el despliegue lo hace el flujo de `.github/workflows`
   * y el dominio apunta ahí vía `public/CNAME`. Si algún día se cambia de
   * hosting, esto y el apartado de transferencias de la política de privacidad
   * cambian juntos: son la misma afirmación contada dos veces.
   */
  host: {
    name: 'GitHub Pages (GitHub, Inc.)',
    location: 'Estados Unidos y red de distribución de contenidos global',
  },
  /** Actualiza esta fecha cada vez que cambies el contenido de las páginas. */
  updated: '11 de agosto de 2026',
} as const;

/**
 * Los dos teléfonos del estudio. Son también los dos WhatsApp: el botón
 * flotante y la sección de contacto salen de esta misma lista, así que un
 * número solo se cambia aquí.
 *
 * `display` es como se lee; `e164` es lo que entienden `tel:` y `wa.me`, sin
 * espacios y con el prefijo del país (wa.me además lo quiere sin el `+`).
 */
export interface Phone {
  /** Cómo se distingue de la otra línea en el selector de WhatsApp. */
  label: string;
  display: string;
  e164: string;
}

export const PHONES: readonly Phone[] = [
  { label: 'Línea 1', display: '+34 683 10 68 46', e164: '+34683106846' },
  { label: 'Línea 2', display: '+34 617 84 52 64', e164: '+34617845264' },
];

/** Lo que aparece ya tecleado al abrir el chat, para que no empiece en blanco. */
export const WHATSAPP_GREETING = 'Hola, os escribo desde makeweb.es. Me gustaría preguntaros por…';

/** Enlace de chat de WhatsApp, con el mensaje ya escrito. */
export function whatsappLink(phone: Phone, text: string = WHATSAPP_GREETING): string {
  return `https://wa.me/${phone.e164.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`;
}

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
