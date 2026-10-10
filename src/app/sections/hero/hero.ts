import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { gsap } from '../../core/animation/gsap';
import { MotionService } from '../../core/animation/motion.service';
import { ISOTIPO_PATHS, ISOTIPO_VIEWBOX } from '../neon/isotipo';

/**
 * La primera pantalla: la promesa, en una tarjeta con la luz de la marca y el
 * isotipo dibujado en línea. La demostración del buscador tiene su propia
 * sección justo debajo (`mw-finder`).
 */
@Component({
  selector: 'mw-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class Hero {
  private readonly root = viewChild.required<ElementRef<HTMLElement>>('root');
  private readonly motion = inject(MotionService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly markPaths = ISOTIPO_PATHS;
  protected readonly markViewBox = ISOTIPO_VIEWBOX;

  constructor() {
    afterNextRender(() => this.buildScrollScenes());
  }

  // -- scroll ----------------------------------------------------------------

  private buildScrollScenes(): void {
    const el = this.root().nativeElement;

    this.motion.scope(
      el,
      () => {
        // Al bajar, el texto se aleja: una pista de profundidad que se deshace
        // sola al volver a subir.
        const scrub = { trigger: el, start: 'top top', end: 'bottom top', scrub: true };

        gsap.to(el.querySelector('.hero__inner'), {
          y: -60,
          opacity: 0.2,
          ease: 'none',
          scrollTrigger: { ...scrub, end: 'bottom 20%' },
        });
      },
      this.destroyRef,
    );
  }
}
