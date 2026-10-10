import { DefaultUrlSerializer, UrlTree } from '@angular/router';

/**
 * Las direcciones de la web llevan barra final: `/precios/`, no `/precios`.
 *
 * El prerenderizado deja cada página en `precios/index.html`, y GitHub Pages
 * sirve esas carpetas solo con barra: a `/precios` responde con un 301 hacia
 * `/precios/`. Si la web enlaza y declara como canónica la dirección sin barra,
 * Google recibe dos señales contrarias en cada página interior (la canónica
 * dice una cosa y el servidor otra) y cada enlace interno le cuesta un salto.
 * Con la barra en todas partes, la dirección que se enlaza, la canónica, la del
 * sitemap y la que sirve el hosting son la misma.
 */

/** `/precios` → `/precios/`; la portada y lo que ya la lleva, igual. */
export function withSlash(path: string): string {
  const [, base, rest] = path.match(/^([^?#]*)(.*)$/)!;
  return base === '' || base.endsWith('/') ? path : `${base}/${rest}`;
}

/** La ruta de una URL del enrutador, sin parámetros, fragmento ni barra final. */
export function routePath(url: string): string {
  const path = url.split(/[?#]/)[0] || '/';
  return path.length > 1 ? path.replace(/\/+$/, '') : path;
}

/**
 * El enrutador escribe las direcciones con barra (los `href` de `routerLink`,
 * la barra del navegador) y las lee con o sin ella: `/precios/` y `/precios`
 * llevan a la misma página.
 */
export class TrailingSlashUrlSerializer extends DefaultUrlSerializer {
  override parse(url: string): UrlTree {
    const [, base, rest] = url.match(/^([^?#]*)(.*)$/)!;
    return super.parse(base.length > 1 ? base.replace(/\/+$/, '') + rest : url);
  }

  override serialize(tree: UrlTree): string {
    return withSlash(super.serialize(tree));
  }
}
