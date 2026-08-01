import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Footer } from '../../sections/footer/footer';

/**
 * Antes, cualquier dirección desconocida redirigía en silencio a la portada.
 * Eso confunde a quien llega desde un enlace roto y le dice a Google que esa
 * URL existe. Mejor decir la verdad y ofrecer una salida.
 */
@Component({
  selector: 'mw-not-found',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Footer],
  template: `
    <main class="nf" id="contenido">
      <div class="shell nf__inner">
        <p class="nf__code">404</p>
        <h1 class="nf__title">Esta página no existe.</h1>
        <p class="nf__body">
          O la dirección está mal escrita, o la hemos movido. Ninguna de las dos es culpa tuya.
        </p>
        <div class="nf__actions">
          <a class="btn btn--primary" routerLink="/"><span class="btn__label">Ir al inicio</span></a>
          <a class="btn btn--ghost" routerLink="/" fragment="contacto">
            <span class="btn__label">Escríbenos</span>
          </a>
        </div>
      </div>
    </main>
    <mw-footer />
  `,
  styleUrl: './not-found.scss',
})
export class NotFound {}
