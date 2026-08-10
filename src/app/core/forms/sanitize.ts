/**
 * Limpieza del texto que escribe un visitante antes de que salga de la web.
 *
 * El destino no es la página —Angular escapa todo lo que interpola y el lead no
 * se pinta de vuelta en ningún sitio—, sino el correo HTML que compone el
 * proveedor del formulario y que se abre en la bandeja de entrada. Ahí es donde
 * no interesa que aterrice una etiqueta, un manejador de eventos ni un enlace
 * que ejecute al pulsarlo.
 *
 * Sana en lugar de rechazar, y a propósito. Un validador que prohíba `<` da
 * error a quien escriba «precio < 500» o «<3», que es tráfico legítimo y
 * frecuente; el visitante no entiende qué ha hecho mal y se va. Esto le quita lo
 * peligroso a lo que escriba sin interrumpirle.
 *
 * Lo que NO hace: proteger de un ataque decidido. La clave del formulario viaja
 * en el JavaScript público, así que cualquiera puede enviar un POST directo al
 * proveedor saltándose esta función entera. Esto limpia lo que entra por el
 * formulario, que es por donde entra todo el tráfico real.
 */

/** Etiquetas completas: `<script>`, `<img onerror=…>`, `</div>`. Un `<` suelto no lo es. */
const TAG = /<\/?[a-z][^>]*>/gi;

/** Esquemas que ejecutan al pulsarlos si el cliente de correo los enlaza. */
const SCHEME = /\b(?:javascript|vbscript|data)\s*:/gi;

/** Manejadores sueltos, por si llegan sin etiqueta alrededor. */
const HANDLER = /\bon[a-z]+\s*=/gi;

/**
 * Caracteres de control, por categoría Unicode en vez de por rangos numéricos:
 * dice lo que busca y no hay escapes que se puedan estropear al editarlos.
 */
const CONTROL = /\p{Cc}/gu;

function strip(value: string): string {
  return value.replace(TAG, '').replace(SCHEME, '').replace(HANDLER, '');
}

/**
 * Nombre, negocio, correo, teléfono: una sola línea, sin saltos.
 *
 * Los saltos de línea importan más de lo que parece. Un campo de una línea que
 * los deja pasar es la forma clásica de colar cabeceras en un correo cuando
 * quien lo compone al otro lado no las filtra.
 */
export function singleLine(value: string, max: number): string {
  return strip(value).replace(CONTROL, ' ').replace(/\s+/g, ' ').trim().slice(0, max);
}

/** El mensaje: conserva los párrafos, se queda sin lo demás. */
export function multiLine(value: string, max: number): string {
  return strip(value)
    .replace(/\r\n?/g, '\n')
    .replace(CONTROL, (char) => (char === '\n' ? char : ''))
    .replace(/[^\S\n]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
    .slice(0, max);
}

/** Tope de cada campo, compartido por el formulario y por el envío. */
export const LEAD_LIMITS = {
  name: 80,
  business: 80,
  email: 120,
  phone: 20,
  message: 2000,
} as const;
