import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  NgZone,
  afterNextRender,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { MotionService } from '../../core/animation/motion.service';
import { selectMenuOpen } from '../../state/ui/ui.feature';
import { QuickContactService } from '../quick-contact/quick-contact.service';
import { ISOTIPO_PATHS, ISOTIPO_VIEWBOX } from './isotipo';

/** Escritorio con ratón: vuela por el margen y ofrece hablar al pasar por encima. */
const WIDE = '(min-width: 1001px) and (hover: hover) and (pointer: fine)';

/** Ancho del rótulo en píxeles: en escritorio y, más pequeño, en móvil. */
const W_WIDE = 46;
const W_COMPACT = 28;
const heightFor = (w: number) => Math.round((w * 1059) / 953);

/**
 * El rótulo de neón: la M del logotipo, encendida, acompañando la lectura.
 *
 * En escritorio, mientras se desplaza la página vuela por el margen derecho;
 * cuando el lector se para, se posa al final del titular o junto al botón que
 * tiene a la vista. Al pasar el puntero se detiene y ofrece hablar.
 *
 * En móvil y en táctil no hay margen por el que volar sin tapar el texto, así
 * que va más pequeña y se posa solo en los titulares: viaja con el que tiene
 * debajo mientras se desplaza la página y, al pararse, salta al que queda más
 * cerca del centro. Si no hay ninguno a la vista, espera en la esquina
 * inferior izquierda, encima de la barra de pestañas.
 *
 * En los dos casos, al pulsarla abre el contacto rápido. Pidiendo menos
 * movimiento se queda quieta en la esquina.
 */
@Component({
  selector: 'mw-neon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (enabled()) {
      <div
        class="neon"
        #sign
        aria-hidden="true"
        [class.neon--compact]="compact()"
        [class.is-hover]="hover()"
        (mouseenter)="onEnter()"
        (mouseleave)="hover.set(false)"
        (click)="talk()"
      >
        <svg class="neon__glyph" [attr.viewBox]="viewBox" [attr.width]="size().w" [attr.height]="size().h">
          @for (d of paths; track $index) {
            <path [attr.d]="d" />
          }
        </svg>
      </div>

      @if (!compact()) {
        <p class="neon__bubble" #bubble [class.is-visible]="hover()" aria-hidden="true">
          <ng-container i18n>¿Una pregunta? <span>Pulsa y escríbenos.</span></ng-container>
        </p>
      }
    } @else if (docked()) {
      <!-- Pidiendo menos movimiento no vuela: se queda pequeña en la esquina,
           encima de la barra de pestañas. Al tocarla, el mismo contacto rápido. -->
      <button
        class="neon neon--dock"
        type="button"
        aria-label="Contacto rápido: escríbenos una pregunta"
        i18n-aria-label
        (click)="talk()"
      >
        <svg class="neon__glyph" [attr.viewBox]="viewBox" [attr.width]="compactW" [attr.height]="compactH">
          @for (d of paths; track $index) {
            <path [attr.d]="d" />
          }
        </svg>
      </button>
    }
  `,
  styleUrl: './neon.scss',
})
export class Neon {
  private readonly zone = inject(NgZone);
  private readonly store = inject(Store);
  private readonly motion = inject(MotionService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly sign = viewChild<ElementRef<HTMLElement>>('sign');
  private readonly bubble = viewChild<ElementRef<HTMLElement>>('bubble');

  private readonly menuOpen = this.store.selectSignal(selectMenuOpen);
  private readonly quickContact = inject(QuickContactService);

  protected readonly enabled = signal(false);
  /** Pidiendo menos movimiento: quieta en la esquina, sin volar. */
  protected readonly docked = signal(false);
  /** Móvil o táctil: más pequeña y posándose solo en los titulares. */
  protected readonly compact = signal(false);
  protected readonly size = signal({ w: W_WIDE, h: heightFor(W_WIDE) });
  protected readonly compactW = W_COMPACT;
  protected readonly compactH = heightFor(W_COMPACT);
  protected readonly hover = signal(false);
  protected readonly paths = ISOTIPO_PATHS;
  protected readonly viewBox = ISOTIPO_VIEWBOX;

  /** Si está posado ahora mismo; lo escribe el bucle de vuelo. */
  private perched = false;

  constructor() {
    afterNextRender(() => {
      // Se decide en vivo y no una vez al cargar: si la ventana se estrecha o
      // se ensancha, cambia de versión sin recargar.
      const wide = matchMedia(WIDE);
      let start = 0;
      let first = true;
      const apply = () => {
        clearTimeout(start);
        if (this.motion.reducedMotion()) {
          this.zone.run(() => {
            this.enabled.set(false);
            this.docked.set(true);
          });
          return;
        }

        const compact = !wide.matches;
        if (this.enabled() && compact === this.compact()) return;

        // Al cambiar de versión se apaga y se vuelve a encender: el bucle de
        // vuelo se acaba solo cuando el elemento deja de existir.
        const w = compact ? W_COMPACT : W_WIDE;
        this.zone.run(() => {
          this.docked.set(false);
          this.enabled.set(false);
          this.compact.set(compact);
          this.size.set({ w, h: heightFor(w) });
        });

        // La primera vez entra cuando la página ya se ha asentado, no
        // compitiendo con el hero.
        start = window.setTimeout(
          () => {
            this.zone.run(() => this.enabled.set(true));
            // Un tick para que exista el elemento antes de empezar a moverlo.
            window.setTimeout(() => this.zone.runOutsideAngular(() => this.fly()), 0);
          },
          first ? 2600 : 200,
        );
        first = false;
      };

      apply();
      wide.addEventListener('change', apply);
      this.destroyRef.onDestroy(() => {
        clearTimeout(start);
        wide.removeEventListener('change', apply);
      });
    });
  }

  /** Solo se detiene a ofrecer conversación si está posado, no al cruzarse en vuelo. */
  protected onEnter(): void {
    if (this.perched && !this.compact()) this.hover.set(true);
  }

  /** Abre el contacto rápido, como el colibrí de Sourati. */
  protected talk(): void {
    this.hover.set(false);
    this.quickContact.open();
  }

  private fly(): void {
    const el = this.sign()?.nativeElement;
    const bubble = this.bubble()?.nativeElement;
    const compact = this.compact();
    if (!el || (!compact && !bubble)) return;
    const { w: W, h: H } = this.size();

    // Arranca fuera de la pantalla, por la derecha, y entra volando.
    let x = innerWidth + 40;
    let y = innerHeight * 0.45;
    let vx = 0;
    let vy = 0;
    let perch: Element | null = null;
    let scrolling = false;
    let idle = 0;
    let frame = 0;
    let t = 0;
    let resting = false;

    const onScroll = () => {
      scrolling = true;
      // En escritorio, al desplazarse levanta el vuelo hacia el margen. En
      // móvil no hay margen: sigue posada y viaja con su titular.
      if (!compact) perch = null;
      // Si tenía el bocadillo abierto, lo cierra. Sin esto, con el puntero
      // quieto encima se quedaba clavado en mitad de la página mientras el
      // contenido pasaba por debajo.
      if (this.hover()) this.zone.run(() => this.hover.set(false));
      clearTimeout(idle);
      idle = window.setTimeout(
        () => {
          scrolling = false;
          perch = this.choosePerch(compact);
        },
        compact ? 350 : 650,
      );
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    // La primera vez se posa sin esperar a que nadie desplace.
    idle = window.setTimeout(() => (perch = this.choosePerch(compact)), 900);

    const tick = () => {
      // Apagado o cambiado de versión: el elemento ya no existe, se acaba el bucle.
      if (!el.isConnected) {
        window.removeEventListener('scroll', onScroll);
        clearTimeout(idle);
        return;
      }
      frame = requestAnimationFrame(tick);
      if (document.hidden) return;
      t += 1 / 60;

      // Con el menú abierto se aparta: el panel ocupa toda la pantalla.
      el.classList.toggle('is-away', this.menuOpen());

      let tx: number;
      let ty: number;
      let spot = perch && (compact || !scrolling) ? this.spotFor(perch, W, H, compact) : null;
      // En móvil, si su titular se ha ido de la pantalla, espera en la esquina.
      // El suelo es el borde de arriba de la barra de pestañas, medido en cada
      // fotograma: en el móvil sube y baja con la barra del navegador.
      const floor = compact ? this.floor() : innerHeight;
      if (spot && compact && (spot.y < 72 || spot.y > floor - 60 - H)) spot = null;
      this.perched = !!spot && Math.hypot(vx, vy) < 1.5;
      // En la esquina se pone su círculo oscuro detrás: ahí suele haber texto.
      if (compact) el.classList.toggle('is-resting', !spot);

      if (spot) {
        tx = spot.x;
        ty = spot.y;
      } else if (compact) {
        // La esquina inferior izquierda, encima de la barra de pestañas.
        tx = 22;
        ty = floor - 26 - H;
      } else {
        // En vuelo: por el margen derecho, a media altura, con un vaivén lento.
        tx = innerWidth - W - 56 + Math.sin(t * 0.9) * 18;
        ty = innerHeight * 0.42 + Math.cos(t * 0.7) * 26;
      }

      if (!this.hover()) {
        // Muelle con amortiguación y un tope de velocidad: llega con decisión
        // y frena al posarse, sin dar saltos aunque el destino cambie de golpe.
        // En móvil, más firme: tiene que seguir al titular mientras se mueve.
        const k = compact && scrolling && spot ? 0.05 : 0.012;
        vx = (vx + (tx - x) * k) * 0.86;
        vy = (vy + (ty - y) * k) * 0.86;
        const speed = Math.hypot(vx, vy);
        const max = compact && scrolling && spot ? 40 : 16;
        if (speed > max) {
          vx = (vx / speed) * max;
          vy = (vy / speed) * max;
        }
        x += vx;
        y += vy;

        // Ya en la esquina, va pegada a la barra sin muelle: al esconderse la
        // barra del navegador, la de pestañas baja de golpe y, con el muelle,
        // la M se quedaba un momento montada encima de ella.
        if (compact && !spot) {
          if (resting) {
            x = tx;
            y = ty;
            vx = vy = 0;
          } else if (Math.hypot(tx - x, ty - y) < 2 && Math.hypot(vx, vy) < 0.5) {
            resting = true;
          }
        } else {
          resting = false;
        }
      }

      // Posado, respira; volando, cabecea en la dirección en que va.
      const bob = spot ? Math.sin(t * 2.2) * (compact ? 2 : 3) : compact ? 0 : Math.sin(t * 5) * 2;
      const tilt = Math.max(-16, Math.min(16, vx * 1.6));
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${(y + bob).toFixed(1)}px, 0) rotate(${tilt.toFixed(1)}deg)`;

      // El bocadillo, a la izquierda del rótulo: a su derecha se saldría.
      if (bubble) {
        bubble.style.transform = `translate3d(${(x - 14).toFixed(1)}px, ${(y + bob + H / 2).toFixed(1)}px, 0) translate(-100%, -50%)`;
      }
    };

    frame = requestAnimationFrame(tick);

    this.destroyRef.onDestroy(() => {
      cancelAnimationFrame(frame);
      clearTimeout(idle);
      window.removeEventListener('scroll', onScroll);
    });
  }

  /**
   * Dónde posarse: el titular o el botón principal más cerca del centro de la
   * pantalla, de los que se ven enteros. En móvil, solo titulares: los botones
   * ocupan todo el ancho y no queda sitio al lado.
   */
  private choosePerch(compact: boolean): Element | null {
    let best: Element | null = null;
    let bestDist = Infinity;

    if (compact) {
      // En móvil, cualquier titular o subtítulo (también los de las tarjetas)
      // en el que quepa al final sin tapar letras, y cuyo final se vea entre la
      // barra de arriba y la de pestañas de abajo.
      const { w, h } = this.size();
      const mid = innerHeight * 0.45;
      document.querySelectorAll('#smooth-content :is(h1, h2, h3)').forEach((c) => {
        if (c.getBoundingClientRect().width === 0) return;
        const spot = this.spotFor(c, w, h, true);
        if (!spot || spot.y < 90 || spot.y > this.floor() - 60 - h) return;
        const d = Math.abs(spot.y - mid);
        if (d < bestDist) {
          bestDist = d;
          best = c;
        }
      });
      return best;
    }

    const candidates = document.querySelectorAll(
      '#smooth-content .hero__title, #smooth-content .ph__title, #smooth-content .sec-title, #smooth-content .cls__title, #smooth-content .btn--primary:not([type=submit])',
    );
    const mid = innerHeight * 0.5;

    candidates.forEach((c) => {
      const r = c.getBoundingClientRect();
      if (r.width === 0 || r.top < 110 || r.bottom > innerHeight - 40) return;
      const d = Math.abs((r.top + r.bottom) / 2 - mid);
      if (d < bestDist) {
        bestDist = d;
        best = c;
      }
    });

    return best;
  }

  /**
   * El borde de arriba de la barra de pestañas, que es el suelo de la M en
   * móvil. Se mide en vez de calcularse con `innerHeight`: en el móvil la barra
   * del navegador aparece y desaparece, y la de pestañas se mueve con ella.
   */
  private floor(): number {
    if (!this.tabbar?.isConnected) this.tabbar = document.querySelector<HTMLElement>('.tb');
    const r = this.tabbar?.getBoundingClientRect();
    return r && r.height ? r.top : innerHeight - 86;
  }

  private tabbar: HTMLElement | null = null;

  /** El punto exacto: al final de la última línea del titular, o junto al botón. */
  private spotFor(target: Element, W: number, H: number, compact: boolean): { x: number; y: number } | null {
    // Junto al botón, a su derecha y centrado en alto. Encima tapaba la
    // última línea del texto que suele ir justo antes.
    if (target.classList.contains('btn')) {
      const r = target.getBoundingClientRect();
      const fits = r.right + W + 28 < innerWidth;
      return fits
        ? { x: r.right + 14, y: r.top + r.height / 2 - H / 2 }
        : { x: r.left - W - 14, y: r.top + r.height / 2 - H / 2 };
    }

    const range = document.createRange();
    range.selectNodeContents(target);
    const lines = [...range.getClientRects()].filter((r) => r.width > 4);
    const last = lines.at(-1) ?? target.getBoundingClientRect();
    if (!last.width) return null;

    const y = last.bottom - H - last.height * 0.12;

    // En móvil la M es más alta que las líneas de los subtítulos y asoma a la
    // altura de la línea de arriba: se pone después de la que acabe más a la
    // derecha de las dos. Si así no cabe, aquí no se posa.
    if (compact) {
      // Solo las cajas del texto: las de los elementos de dentro (un `<em>` en
      // bloque, por ejemplo) miden todo el ancho aunque la letra acabe antes.
      const text: DOMRect[] = [];
      const walker = document.createTreeWalker(target, NodeFilter.SHOW_TEXT);
      for (let n = walker.nextNode(); n; n = walker.nextNode()) {
        if (!n.textContent?.trim()) continue;
        range.selectNodeContents(n);
        text.push(...[...range.getClientRects()].filter((r) => r.width > 4));
      }
      const end = text.at(-1);
      if (!end) return null;
      const ty = end.bottom - H - end.height * 0.12;
      const right = Math.max(...text.filter((l) => l.bottom > ty + 2).map((l) => l.right));
      return right + 8 + W + 12 < innerWidth ? { x: right + 8, y: ty } : null;
    }

    // Al final de la última línea, apoyado en ella; si no cabe a la derecha,
    // encima del final de la línea.
    return last.right + 16 + W + 28 < innerWidth
      ? { x: last.right + 16, y }
      : { x: last.right - W, y: last.top - H - 6 };
  }
}
