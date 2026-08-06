import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  viewChild,
} from '@angular/core';
import { gsap } from '../../core/animation/gsap';
import { MotionService } from '../../core/animation/motion.service';
import { RevealDirective } from '../../core/animation/reveal.directive';
import { COMMITMENTS } from '../../data/content';

/**
 * Lo que ocupa el sitio de los testimonios.
 *
 * Un estudio que empieza no tiene reseñas, e inventarlas es publicidad
 * engañosa. Los testimonios sirven para quitarle miedo a comprar; unos
 * compromisos concretos y verificables hacen ese mismo trabajo sin mentir.
 *
 * La rejilla se dibuja sola al entrar: primero la línea de arriba y después las
 * fichas en diagonal. Son seis promesas seguidas y quietas se leían como una
 * tabla.
 */
@Component({
  selector: 'mw-commitments',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RevealDirective],
  templateUrl: './commitments.html',
  styleUrl: './commitments.scss',
})
export class Commitments {
  private readonly root = viewChild.required<ElementRef<HTMLElement>>('root');
  private readonly motion = inject(MotionService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly commitments = COMMITMENTS;

  constructor() {
    afterNextRender(() => {
      const el = this.root().nativeElement;
      const items = gsap.utils.toArray<HTMLElement>('[data-item]', el);

      if (this.motion.reducedMotion()) {
        gsap.set(items, { visibility: 'visible' });
        return;
      }

      this.motion.scope(
        el,
        () => {
          gsap.set(items, { visibility: 'visible' });

          gsap
            .timeline({
              defaults: { ease: 'power3.out' },
              scrollTrigger: {
                trigger: el.querySelector('[data-list]')!,
                start: 'top 80%',
                toggleActions: 'play none none reverse',
              },
            })
            .from(el.querySelector('[data-rule]'), {
              scaleX: 0,
              duration: 0.9,
              ease: 'power2.inOut',
            })
            .from(
              items,
              {
                y: 40,
                opacity: 0,
                duration: 0.9,
                // En diagonal y no fila a fila: la vista entra por arriba a la
                // izquierda, que es por donde se empieza a leer.
                stagger: { each: 0.07, grid: 'auto', from: 'start' },
              },
              0.15,
            );
        },
        this.destroyRef,
      );
    });
  }
}
