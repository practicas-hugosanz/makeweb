import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  signal,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { LANGUAGES, Language, currentLanguage, localizedPath } from '../../core/i18n';
import { routePath, withSlash } from '../../core/trailing-slash';

/**
 * El selector de idioma de la barra.
 *
 * En escritorio son tres píldoras a la vista, ES · EN · FR. En pantallas
 * estrechas no caben junto al logotipo y el botón: se queda un botón con el
 * idioma actual que despliega los otros.
 *
 * Son enlaces normales y no del router: cada idioma es una compilación aparte
 * en su carpeta, así que cambiar de idioma es cargar la misma página en la
 * otra. Funcionan también sin JavaScript.
 */
@Component({
  selector: 'mw-lang-switch',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(document:pointerdown)': 'onOutside($event)', '(document:keydown.escape)': 'open.set(false)' },
  template: `
    <button
      class="ls__toggle"
      type="button"
      [attr.aria-expanded]="open()"
      aria-controls="ls-list"
      (click)="open.set(!open())"
    >
      <svg class="ls__globe" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3.5 9h17M3.5 15h17M12 3c2.5 2.6 3.7 5.6 3.7 9s-1.2 6.4-3.7 9c-2.5-2.6-3.7-5.6-3.7-9S9.5 5.6 12 3z" />
      </svg>
      {{ current.short }}
      <span class="visually-hidden" i18n>Cambiar de idioma</span>
    </button>

    <ul class="ls__list" id="ls-list" [class.is-open]="open()" aria-label="Idioma" i18n-aria-label>
      @for (lang of languages; track lang.code) {
        <li>
          <a
            class="ls__item"
            [class.is-current]="lang.code === current.code"
            [attr.href]="hrefFor(lang)"
            [attr.hreflang]="lang.code"
            [attr.lang]="lang.code"
            [attr.aria-current]="lang.code === current.code ? 'true' : null"
            [attr.title]="lang.name"
          >
            {{ lang.short }}
          </a>
        </li>
      }
    </ul>
  `,
  styleUrl: './lang-switch.scss',
})
export class LangSwitch {
  private readonly router = inject(Router);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  protected readonly languages = LANGUAGES;
  protected readonly current = currentLanguage();
  protected readonly open = signal(false);
  private readonly path = signal('/');

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const read = () => this.path.set(routePath(this.router.url));
      read();
      const sub = this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe(() => {
        read();
        this.open.set(false);
      });
      destroyRef.onDestroy(() => sub.unsubscribe());
    });
  }

  protected hrefFor(lang: Language): string {
    return withSlash(localizedPath(lang, this.path()));
  }

  protected onOutside(event: PointerEvent): void {
    if (this.open() && !this.host.contains(event.target as Node)) this.open.set(false);
  }
}
