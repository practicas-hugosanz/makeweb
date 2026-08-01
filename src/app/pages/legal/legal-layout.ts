import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LEGAL, LEGAL_PAGES } from '../../data/legal';
import { Footer } from '../../sections/footer/footer';

/**
 * Marco común de las tres páginas legales: cabecera, fecha de actualización,
 * navegación entre ellas y el pie. El cuerpo llega proyectado, así que sus
 * estilos viven en `styles/_prose.scss` (global) y no aquí.
 */
@Component({
  selector: 'mw-legal-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, Footer],
  template: `
    <main class="lg" id="contenido">
      <div class="shell lg__inner">
        <header class="lg__head">
          <p class="lg__eyebrow">Legal</p>
          <h1 class="lg__title">{{ title() }}</h1>
          <p class="lg__meta">Última actualización: {{ updated }}</p>
        </header>

        <nav class="lg__tabs" aria-label="Páginas legales">
          @for (page of pages; track page.path) {
            <a
              [routerLink]="page.path"
              routerLinkActive="is-current"
              [attr.aria-current]="null"
              class="lg__tab"
            >
              {{ page.label }}
            </a>
          }
        </nav>

        <div class="prose lg__body">
          <ng-content />
        </div>

        <a class="btn btn--ghost lg__back" routerLink="/">
          <span class="btn__label">Volver al inicio</span>
        </a>
      </div>
    </main>

    <mw-footer />
  `,
  styleUrl: './legal-layout.scss',
})
export class LegalLayout {
  readonly title = input.required<string>();

  protected readonly pages = LEGAL_PAGES;
  protected readonly updated = LEGAL.updated;
}
