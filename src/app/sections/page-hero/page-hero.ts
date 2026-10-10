import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ISOTIPO_PATHS, ISOTIPO_VIEWBOX } from '../neon/isotipo';

/**
 * La cabecera de todas las páginas interiores: una tarjeta enmarcada como el
 * hero de la portada, con migas de pan, el titular (que llega proyectado, con
 * su cursiva), la entradilla, el botón y, a la derecha, una ilustración o el
 * isotipo dibujado en línea. Abajo, el filete violeta.
 */
@Component({
  selector: 'mw-page-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <section class="ph" [class.ph--image]="media()">
      <div class="ph__card">
        <div class="ph__copy">
          <nav class="ph__crumbs" aria-label="Estás aquí" i18n-aria-label>
            <a routerLink="/" i18n>Inicio</a>
            @if (parent(); as p) {
              <span aria-hidden="true">/</span>
              <a [routerLink]="p.link" [fragment]="p.fragment">{{ p.label }}</a>
            }
            <span aria-hidden="true">/</span>
            <span aria-current="page">{{ crumb() }}</span>
          </nav>

          <h1 class="ph__title"><ng-content select="[title]" /></h1>

          @if (lead()) {
            <p class="ph__lead">{{ lead() }}</p>
          }

          @if (cta()) {
            <div>
              <a class="btn btn--primary btn--go" routerLink="/contacto">
                <span class="btn__label" i18n>Pide presupuesto</span>
              </a>
            </div>
          }
        </div>

        @if (!media()) {
          <!-- Sin foto, la mitad derecha la ocupa el isotipo dibujado en
               línea, enorme, con la firma de la marca. -->
          <svg class="ph__mark" [attr.viewBox]="markViewBox" aria-hidden="true">
            @for (d of markPaths; track $index) {
              <path [attr.d]="d" />
            }
          </svg>
        }

        @if (media()) {
          <div class="ph__media"><ng-content select="[media]" /></div>
        }
      </div>
    </section>
  `,
  styleUrl: './page-hero.scss',
})
export class PageHero {
  readonly crumb = input.required<string>();
  readonly parent = input<{ label: string; link: string; fragment?: string } | null>(null);
  readonly lead = input('');
  /** Si la página pone algo a la derecha (`<… media>`); si no, va el isotipo. */
  readonly media = input(false);
  readonly cta = input(true);

  protected readonly markPaths = ISOTIPO_PATHS;
  protected readonly markViewBox = ISOTIPO_VIEWBOX;
}
