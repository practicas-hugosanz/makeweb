import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  afterNextRender,
  inject,
  signal,
} from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs';
import { SERVICE_PAGES } from '../../data/services';

interface Tab {
  label: string;
  /** Sin ruta, la pestaña abre la hoja de servicios. */
  link?: string;
  icon: 'home' | 'grid' | 'card' | 'people' | 'chat';
}

/**
 * La navegación de móvil y tableta: cinco pestañas fijas abajo, al alcance del
 * pulgar, como en una app. Servicios no lleva a una página: abre una hoja con
 * las cinco páginas de servicio y los precios.
 */
@Component({
  selector: 'mw-tabbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    @if (sheetOpen()) {
      <button class="tb__scrim" type="button" aria-label="Cerrar" i18n-aria-label (click)="sheetOpen.set(false)"></button>
      <nav class="tb__sheet" id="tb-servicios" aria-label="Servicios" i18n-aria-label>
        <p class="tb__sheet-head" i18n>Servicios</p>
        <ul>
          @for (page of servicePages; track page.slug) {
            <li>
              <a [routerLink]="'/servicios/' + page.slug" (click)="sheetOpen.set(false)">
                <strong>{{ page.name }}</strong>
                <small>{{ page.service.title }}</small>
              </a>
            </li>
          }
          <li>
            <a routerLink="/precios" (click)="sheetOpen.set(false)">
              <strong i18n>Precios</strong>
              <small i18n>Tres formas de hacerlo, con su horquilla real</small>
            </a>
          </li>
        </ul>
      </nav>
    }

    <nav class="tb" aria-label="Navegación principal" i18n-aria-label>
      @for (tab of tabs; track tab.label) {
        @if (tab.link) {
          <a
            class="tb__tab"
            [routerLink]="tab.link"
            [class.is-active]="!sheetOpen() && isActive(tab)"
            [attr.aria-current]="isActive(tab) ? 'page' : null"
            (click)="sheetOpen.set(false)"
          >
            <svg class="tb__icon" viewBox="0 0 24 24" aria-hidden="true">
              <path [attr.d]="icons[tab.icon]" />
            </svg>
            <span>{{ tab.label }}</span>
          </a>
        } @else {
          <button
            class="tb__tab"
            type="button"
            [class.is-active]="sheetOpen() || isActive(tab)"
            [attr.aria-expanded]="sheetOpen()"
            aria-controls="tb-servicios"
            (click)="sheetOpen.set(!sheetOpen())"
          >
            <svg class="tb__icon" viewBox="0 0 24 24" aria-hidden="true">
              <path [attr.d]="icons[tab.icon]" />
            </svg>
            <span>{{ tab.label }}</span>
          </button>
        }
      }
    </nav>
  `,
  styleUrl: './tabbar.scss',
})
export class Tabbar {
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly servicePages = SERVICE_PAGES;
  protected readonly sheetOpen = signal(false);
  private readonly path = signal('/');

  protected readonly tabs: readonly Tab[] = [
    { label: $localize`Inicio`, link: '/', icon: 'home' },
    { label: $localize`Servicios`, icon: 'grid' },
    { label: $localize`Proyectos`, link: '/proyectos', icon: 'card' },
    { label: $localize`Estudio`, link: '/estudio', icon: 'people' },
    { label: $localize`Contacto`, link: '/contacto', icon: 'chat' },
  ];

  /** Iconos de trazo, dibujados a mano para no cargar una librería por cinco. */
  protected readonly icons: Record<Tab['icon'], string> = {
    home: 'M4 10.5 12 4l8 6.5V20h-5.5v-5.5h-5V20H4z',
    grid: 'M4.5 4.5h6v6h-6zM13.5 4.5h6v6h-6zM4.5 13.5h6v6h-6zM13.5 13.5h6v6h-6z',
    card: 'M3.5 6.5h17v11h-17zM3.5 10h17',
    people: 'M9 11.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM2.5 20c.6-3.4 3.2-5.5 6.5-5.5s5.9 2.1 6.5 5.5M16 4.8a3.2 3.2 0 0 1 0 6.2M18 14.7c1.9.8 3.1 2.6 3.5 5.3',
    chat: 'M4.5 5h15v10.5H10L5.5 19.5v-4H4.5z',
  };

  constructor() {
    afterNextRender(() => {
      this.path.set(this.router.url.split(/[?#]/)[0]);
      const sub = this.router.events
        .pipe(filter((e) => e instanceof NavigationEnd))
        .subscribe(() => {
          this.path.set(this.router.url.split(/[?#]/)[0]);
          this.sheetOpen.set(false);
        });
      this.destroyRef.onDestroy(() => sub.unsubscribe());
    });
  }

  protected isActive(tab: Tab): boolean {
    const path = this.path();
    if (!tab.link) return path.startsWith('/servicios/') || path === '/precios';
    return tab.link === '/' ? path === '/' : path === tab.link;
  }
}
