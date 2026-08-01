import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CounterDirective } from '../../core/animation/counter.directive';
import { MotionService } from '../../core/animation/motion.service';
import { RevealDirective } from '../../core/animation/reveal.directive';
import { BUILD_FACTS, MEASURED, METRICS } from '../../data/content';

/**
 * El portfolio que sí se puede enseñar: esta misma página.
 *
 * Sustituye a la sección de trabajos inventados. Las cifras están medidas con
 * Lighthouse sobre el build de producción y cualquiera puede repetir la
 * medición desde PageSpeed Insights, así que la sección incluye el enlace.
 */
@Component({
  selector: 'mw-results',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CounterDirective, RevealDirective],
  templateUrl: './results.html',
  styleUrl: './results.scss',
})
export class Results {
  private readonly motion = inject(MotionService);

  protected readonly metrics = METRICS;
  protected readonly facts = BUILD_FACTS;
  protected readonly measured = MEASURED;

  protected jumpTo(event: Event, id: string): void {
    event.preventDefault();
    this.motion.scrollTo(`#${id}`);
  }
}
