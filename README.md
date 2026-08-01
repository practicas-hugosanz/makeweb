# MakeWeb

Sitio web del estudio **MakeWeb**: diseño y desarrollo web para negocios locales, en remoto y para
toda España.

Está construido como escaparate de lo que vendemos: si nuestra web no carga rápido, no se lee bien
en el móvil y no convierte, nadie nos va a creer. Por eso la sección «Esta web» enseña sus propias
mediciones en lugar de un portfolio.

---

## Puesta en marcha

```bash
npm install
npm start          # http://localhost:4200
npm run build      # sitio estático en dist/makeweb/browser
```

Requiere **Node 20.19+, 22.12+ o 24+** (Angular 20).

El build genera **HTML ya renderizado** para las cinco rutas. La salida es estática pura: sirve
`dist/makeweb/browser` en cualquier hosting (Netlify, Vercel, Cloudflare Pages, un S3, nginx…). No
hace falta Node en producción.

> **Configura el hosting para comprimir** (gzip o brotli). Todos lo hacen por defecto; los que
> nombro arriba, seguro. Sin compresión el HTML pasa de 35 kB a 228 kB y el rendimiento en móvil
> se desploma de 95 a 52. Lo medí.

Conviene además que el servidor devuelva `/404/index.html` con estado 404 para las direcciones
desconocidas.

---

## Stack

| Pieza | Qué hace |
| --- | --- |
| **Angular 20** (standalone, zoneless, signals) | Estructura de la app. Sin NgModules y sin zone.js. |
| **Prerenderizado** (`outputMode: static`) | Las cinco rutas se generan en HTML durante el build. |
| **TypeScript 5.9** estricto | Todo el código de aplicación. |
| **SCSS** + custom properties | Sistema de diseño en `src/styles/`. |
| **GSAP 3.15** + ScrollTrigger, ScrollSmoother, SplitText, TextPlugin | Toda la animación. |
| **NgRx Store + Effects** | Estado de UI, envío del formulario y consentimiento de cookies. |
| **Angular Material (M3)** | Formulario, acordeón, selector de precios y conmutadores. |

---

## Estructura

```
src/
  app/
    core/animation/      gsap.ts, MotionService y las directivas reutilizables:
                         mwReveal, mwSplit, mwMagnetic, mwCounter
    core/analytics.service.ts
    data/content.ts      TODO el texto de la portada
    data/legal.ts        datos identificativos y cookies
    pages/               home, legal/ (3 páginas), not-found
    sections/            una carpeta por sección
    state/               ui/, lead/, consent/
  environments/          leadEndpoint y analyticsId
  styles/                _fonts, _tokens, _mixins, _buttons, _sections, _prose
public/
  brand/                 logotipo y juego de favicons
  fonts/                 mollen-regular.woff2, mollen-bold.woff2
  robots.txt, sitemap.xml, site.webmanifest, favicon.ico
```

### Dónde tocar

| Qué | Dónde |
| --- | --- |
| Textos, precios, servicios, preguntas, compromisos | `src/app/data/content.ts` |
| Razón social, NIF, domicilio, cookies | `src/app/data/legal.ts` |
| **Destino del formulario y analítica** | `src/environments/environment.ts` |
| Colores, tipografías, escalas | `src/styles/_tokens.scss` |
| Metadatos, Open Graph, JSON-LD | `src/index.html` |
| Dominio del sitemap | `public/sitemap.xml` y `public/robots.txt` |

---

## Rendimiento: medido, no estimado

Lighthouse 12 sobre el build de producción servido comprimido, que es como lo sirve un hosting real:

| | Rendimiento | Accesibilidad | Buenas prácticas | SEO |
| --- | --- | --- | --- | --- |
| **Escritorio** | 100 | 100 | 100 | 100 |
| **Móvil** | 95 | 100 | 100 | 100 |

LCP móvil 2,0 s · CLS 0,003 · cero peticiones a terceros.

**Para repetirlo:**

```bash
npm run build
npx serve dist/makeweb/browser          # o cualquier servidor que comprima
npx lighthouse http://localhost:3000 --view
```

Cuando la web esté publicada, mídela con [PageSpeed Insights](https://pagespeed.web.dev/) y
**actualiza las cifras de `METRICS` en `content.ts`**. Están puestas en la página: si dejan de ser
ciertas, la página miente.

### Qué las hace posibles

- **Prerenderizado.** Medido de forma controlada, mismo servidor y misma compresión: sin prerender
  78 en móvil, con prerender 95. FCP de 2,4 s a 0,9 s.
- **Fuentes autoalojadas.** Cero peticiones a Google Fonts.
- **Sin `filter: blur()` en el fondo.** Desenfocar un elemento de 700 px y moverlo con parallax
  obliga al compositor a recalcularlo en cada frame.
- **`backdrop-filter` solo cuando la cabecera está sobre contenido.**
- **`normalizeScroll` desactivado** en ScrollSmoother.
- **Sin rotaciones 3D** en el carrusel de servicios.

---

## Formulario de contacto

**No envía nada todavía, y no finge que sí.** `environment.leadEndpoint` está vacío, así que el
formulario muestra un error explicando que falta conectarlo. La versión anterior simulaba el envío
y respondía «Recibido, te escribimos en 24 h»: alguien podía escribir y quedarse esperando.

Para ponerlo en marcha, una línea:

```ts
// src/environments/environment.ts
leadEndpoint: 'https://formspree.io/f/xxxxxxx',
```

Vale cualquier cosa que acepte un POST con JSON y responda 2xx: Formspree, Resend, Web3Forms, una
función de Netlify o tu propio CRM. El efecto usa `exhaustMap`, así que un doble clic no crea dos
leads.

Pendiente cuando haya backend: protección antispam (honeypot o captcha) y limitación de peticiones.

---

## Cookies y analítica

- El estado arranca en `null` y `ConsentService.allows('analytics')` devuelve **false** mientras no
  haya respuesta.
- `AnalyticsService` carga la analítica solo si hay consentimiento **y** un `analyticsId`
  configurado. Como está vacío, hoy no se carga nada de terceros. Al retirar el consentimiento,
  borra las cookies del proveedor.
- «Aceptar todas» y «Rechazar todas» tienen el mismo tamaño y los mismos clics, a propósito.
- La decisión se guarda en `localStorage` con fecha y versión.

**Al conectar analítica:** añade una fila por cookie en `COOKIE_INVENTORY` (`data/legal.ts`), sube
`CONSENT_VERSION` para volver a preguntar, adapta `injectScript()` y añade el proveedor al
apartado 5 de la política de privacidad.

---

## Accesibilidad

100/100 en Lighthouse, sin fallos pendientes. Dos arreglos que no son evidentes:

- **Foco y scroll.** ScrollSmoother mete el contenido en un contenedor `position: fixed`, así que
  cuando el foco saltaba a un elemento fuera de la vista el navegador no tenía nada que desplazar:
  navegando con el tabulador el foco acababa en elementos invisibles. `MotionService.followFocus()`
  hace a mano lo que el navegador ya no puede hacer.
- **SplitText** añadía un `aria-label` prohibido en `<blockquote>`. Se desactiva con `aria: 'none'`.

Con `prefers-reduced-motion` no se crea ni una sola animación y el scroll vuelve a ser nativo.

### Móvil

Probado con emulación de dispositivo en Chrome a 390×844 (iPhone), 360×740 (Android pequeño) y
768×1024 (tablet), recorriendo las nueve secciones y abriendo el menú:

- **Sin desbordamiento horizontal** en ninguno de los tres tamaños (`scrollWidth === viewport`).
- **Objetivos táctiles de 44 px** en cabecera, menú, pie y datos de contacto. Antes había enlaces
  de 17-24 px de alto: se veían bien pero se fallaba al pulsarlos.
- Lo único que sigue por debajo de 28 px son enlaces dentro de una frase (exentos según el criterio
  2.5.8 de WCAG) y el `<input>` interior de los campos de Material, cuya área pulsable real es el
  contenedor de 56 px.

Sigue sin probarse en un teléfono físico, que es lo único que detecta cosas como el rendimiento
térmico o el comportamiento del teclado nativo.

---

## Tipografía

Una sola familia, **Mollen**, con sus dos cortes. Los `.otf` de `/mollen` se convirtieron a WOFF2
(28 kB → 16 kB) y se sirven desde `public/fonts/`. Como solo existen los pesos 400 y 700, en las
hojas de estilo no hay ningún 300, 500, 600 ni 800.

> ⚠️ Los archivos de `/mollen` son la versión **Personal Use**. Para la web de la agencia hace
> falta la licencia comercial: <https://www.myfonts.com/fonts/eko-bimantara/mollen/>

---

## Antes de publicar

- [ ] **Contratar dominio y correo**, y ponerlos en `data/legal.ts`, `index.html` (canonical y
      JSON-LD), `robots.txt` y `sitemap.xml`.
- [ ] **Conectar el formulario** (`environment.leadEndpoint`).
- [ ] **Rellenar `data/legal.ts`**: razón social, NIF, domicilio fiscal, datos registrales y
      proveedor de alojamiento. Que un abogado revise las tres páginas legales: son plantillas con
      la estructura que exigen la LSSI-CE y el RGPD, no asesoramiento jurídico.
- [ ] **Borrar los avisos `prose__note`** de las páginas legales: son recordatorios para ti y ahora
      mismo los ve cualquier visitante.
- [ ] **Revisar los precios** de `PLANS`. Son los únicos números de la web que no puedo medir yo.
- [ ] **Comprar la licencia comercial de Mollen.**
- [ ] Comprobar que el hosting comprime y que sirve `/404/index.html` con estado 404.
- [ ] Volver a medir con PageSpeed Insights y actualizar `METRICS`.

### Ya no hay que hacer

Estaban en la lista y se han quitado de la web porque eran inventados: los seis proyectos de
portfolio, los tres testimonios firmados con nombre y apellidos, y las métricas de resultados
(«47 negocios», «2,8× más contactos»). Inventar reseñas no es solo poco fiable: en España es
publicidad engañosa (Ley 3/1991). En su lugar hay dos secciones que dicen la verdad —«Esta web»,
con mediciones reproducibles, y «Compromisos», con garantías que sí se pueden cumplir.
