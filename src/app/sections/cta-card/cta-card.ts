import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface CtaLink {
  label: string;
  sub: string;
  link: string;
}

/**
 * La tarjeta que cierra cada página interior: una frase, el botón de
 * presupuesto y, al lado, dos caminos para seguir leyendo.
 */
@Component({
  selector: 'mw-cta-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <section class="cta">
      <div class="cta__card shell">
        <div class="cta__copy">
          <p class="cta__eyebrow" i18n>Nuevo proyecto</p>
          <h2 class="cta__title">{{ title() }}</h2>
          <p class="cta__text" i18n>
            Cuéntanos qué negocio tienes y qué te gustaría conseguir. Te respondemos en 24 horas,
            con alcance, precio cerrado y fecha.
          </p>
          <div>
            <a class="btn btn--primary btn--go" routerLink="/contacto">
              <span class="btn__label" i18n>Pide presupuesto</span>
            </a>
          </div>
        </div>

        <ul class="cta__links">
          @for (item of links(); track item.link) {
            <li>
              <a class="cta__link" [routerLink]="item.link">
                <span>
                  <strong>{{ item.label }}</strong>
                  <small>{{ item.sub }}</small>
                </span>
                <span class="cta__arrow" aria-hidden="true">→</span>
              </a>
            </li>
          }
        </ul>
      </div>
    </section>
  `,
  styleUrl: './cta-card.scss',
})
export class CtaCard {
  readonly title = input($localize`hablemos de tu web.`);
  readonly links = input<readonly CtaLink[]>([
    { label: $localize`Ver los precios`, sub: $localize`Tres formas de hacerlo, con su horquilla real`, link: '/precios' },
    { label: $localize`Conocer el estudio`, sub: $localize`Quién hace tu web y cómo trabajamos`, link: '/estudio' },
  ]);
}
