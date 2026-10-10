import { LOCALE_ID, inject } from '@angular/core';

/**
 * Los idiomas de la web. Cada uno se compila aparte, con su propia carpeta:
 * el castellano en la raíz y los demás en `/en/` y `/fr/` (ver `i18n` en
 * `angular.json`). Cambiar de idioma es, por tanto, cambiar de página: el
 * selector lleva a la misma ruta dentro de la otra carpeta.
 */
export interface Language {
  /** El código con el que Angular compila (`LOCALE_ID`). */
  code: 'es' | 'en' | 'fr';
  /** La carpeta: vacía para el castellano, que va en la raíz. */
  prefix: '' | '/en' | '/fr';
  /** Lo que se lee en el selector. */
  short: string;
  /** El nombre en su propio idioma, para lectores de pantalla y el `title`. */
  name: string;
  /** Para `og:locale`. */
  og: string;
}

export const LANGUAGES: readonly Language[] = [
  { code: 'es', prefix: '', short: 'ES', name: 'Español', og: 'es_ES' },
  { code: 'en', prefix: '/en', short: 'EN', name: 'English', og: 'en_GB' },
  { code: 'fr', prefix: '/fr', short: 'FR', name: 'Français', og: 'fr_FR' },
];

/** El idioma de esta compilación. Llamar desde un contexto de inyección. */
export function currentLanguage(): Language {
  const id = inject(LOCALE_ID).slice(0, 2);
  return LANGUAGES.find((l) => l.code === id) ?? LANGUAGES[0];
}

/** La ruta interna (`/precios`) en el idioma pedido (`/en/precios`). */
export function localizedPath(lang: Language, path: string): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (!lang.prefix) return clean;
  return clean === '/' ? `${lang.prefix}/` : `${lang.prefix}${clean}`;
}
