import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  input,
} from '@angular/core';

/** Los servicios con ilustración, por su `id` de `SERVICES`. */
export type ServiceArtKind = 'diseno' | 'desarrollo' | 'seo-local' | 'conversion' | 'cuidado';

/**
 * La ilustración de cada servicio, dibujada en línea violeta sobre tinta.
 * Sustituye a las fotos: es de la marca, pesa nada y no hay que generar ni
 * licenciar ninguna imagen. Lleva su propio fondo oscuro, así que se ve igual
 * sobre la tinta que sobre el papel.
 *
 * Cada una tiene su pequeño bucle en CSS —el puntero que pulsa, el código que
 * se escribe, la chincheta que cae—. Solo corre mientras se ve: fuera de la
 * pantalla se pausa, y con movimiento reducido queda quieta en su estado final.
 */
@Component({
  selector: 'mw-service-art',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg class="art" viewBox="0 0 320 200" aria-hidden="true">
      @switch (kind()) {
        <!-- Diseño: una ventana con su maqueta, la paleta y el puntero. -->
        @case ('diseno') {
          <rect class="frame" x="40" y="28" width="240" height="150" rx="10" />
          <path class="line" d="M40 50h240" />
          <circle class="dot" cx="54" cy="39" r="3" />
          <circle class="dot" cx="65" cy="39" r="3" />
          <circle class="dot" cx="76" cy="39" r="3" />
          <rect class="fill a-grow" x="58" y="66" width="104" height="12" rx="3" />
          <rect class="soft" x="58" y="86" width="84" height="6" rx="3" />
          <rect class="soft" x="58" y="98" width="94" height="6" rx="3" />
          <rect class="accent a-press" x="58" y="116" width="52" height="16" rx="8" />
          <rect class="frame" x="180" y="66" width="82" height="66" rx="6" />
          <path class="line a-draw" pathLength="1" d="M184 124l22-24 16 14 12-10 24 20" />
          <circle class="swatch1 a-pop a-d1" cx="196" cy="156" r="9" />
          <circle class="swatch2 a-pop a-d2" cx="220" cy="156" r="9" />
          <circle class="swatch3 a-pop a-d3" cx="244" cy="156" r="9" />
          <path class="cursor a-cursor" d="M132 140l0 26 7-7 6 12 5-2-6-12 10 0z" />
        }

        <!-- Desarrollo: el editor con su código y el indicador de velocidad. -->
        @case ('desarrollo') {
          <rect class="frame" x="30" y="28" width="170" height="150" rx="10" />
          <path class="line" d="M30 50h170" />
          <circle class="dot" cx="44" cy="39" r="3" />
          <circle class="dot" cx="55" cy="39" r="3" />
          <circle class="dot" cx="66" cy="39" r="3" />
          <path class="accent-stroke a-blink" d="M52 74l-10 9 10 9M70 74l10 9-10 9" />
          <rect class="soft a-type a-d1" x="92" y="80" width="78" height="6" rx="3" />
          <rect class="soft a-type a-d2" x="58" y="102" width="96" height="6" rx="3" />
          <rect class="fill a-type a-d3" x="58" y="116" width="62" height="6" rx="3" />
          <rect class="soft a-type a-d4" x="58" y="130" width="110" height="6" rx="3" />
          <rect class="soft a-type a-d5" x="42" y="148" width="70" height="6" rx="3" />
          <path class="frame" d="M220 150a45 45 0 0 1 90 0" />
          <path class="accent-stroke a-gauge" pathLength="1" d="M220 150a45 45 0 0 1 80-28" />
          <path class="needle a-needle" d="M265 150l26-30" />
          <circle class="accent" cx="265" cy="150" r="5" />
        }

        <!-- SEO local: el plano del barrio y la chincheta en primer puesto. -->
        @case ('seo-local') {
          <rect class="frame" x="30" y="24" width="260" height="156" rx="10" />
          <path class="line" d="M30 84h260M30 136h260M104 24v156M196 24v156M30 40l74 44M196 136l94 34" />
          <rect class="soft" x="116" y="96" width="68" height="28" rx="4" />
          <rect class="soft" x="208" y="44" width="70" height="30" rx="4" />
          <rect class="soft" x="42" y="96" width="50" height="28" rx="4" />
          <g class="a-pin">
            <path class="accent" d="M150 46c-14 0-24 10-24 23 0 17 24 41 24 41s24-24 24-41c0-13-10-23-24-23z" />
            <circle class="hole" cx="150" cy="69" r="8" />
          </g>
          <ellipse class="a-ripple" cx="150" cy="112" rx="18" ry="5" />
          <g class="a-badge">
            <rect class="fill" x="182" y="92" width="50" height="22" rx="11" />
            <text class="badge" x="207" y="107" text-anchor="middle">1.º</text>
          </g>
        }

        <!-- Reservas: el calendario del mes con la cita confirmada. -->
        @case ('conversion') {
          <rect class="frame" x="70" y="22" width="180" height="160" rx="12" />
          <path class="line" d="M70 54h180" />
          <path class="frame-stroke" d="M106 14v18M214 14v18" />
          @for (row of rows; track row) {
            @for (col of cols; track col) {
              <rect
                [class]="row === 2 && col === 4 ? 'accent a-pick' : 'soft'"
                [attr.x]="86 + col * 22"
                [attr.y]="68 + row * 26"
                width="16"
                height="16"
                rx="4"
              />
            }
          }
          <path class="check a-check" pathLength="1" d="M175 128l4 4 8-9" />
        }

        <!-- Mantenimiento: el escudo con la copia hecha y la flecha de vuelta. -->
        @case ('cuidado') {
          <path class="frame" d="M160 24l58 22v44c0 40-26 68-58 82-32-14-58-42-58-82V46z" />
          <path class="accent a-breathe" d="M160 46l38 14v30c0 27-17 46-38 56-21-10-38-29-38-56V60z" />
          <path class="check-lg a-check" pathLength="1" d="M142 100l12 12 24-26" />
          <g class="a-orbit">
            <path class="frame-stroke" d="M248 64a40 40 0 0 1 0 72M256 140l-8-4 2-9" />
            <path class="frame-stroke" d="M72 136a40 40 0 0 1 0-72M64 60l8 4-2 9" />
          </g>
        }
      }
    </svg>
  `,
  styleUrl: './service-art.scss',
})
export class ServiceArt {
  readonly kind = input.required<ServiceArtKind>();

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const io = new IntersectionObserver(([entry]) =>
        this.host.classList.toggle('is-playing', entry.isIntersecting),
      );
      io.observe(this.host);
      destroyRef.onDestroy(() => io.disconnect());
    });
  }

  protected readonly rows = [0, 1, 2, 3];
  protected readonly cols = [0, 1, 2, 3, 4, 5, 6];
}
