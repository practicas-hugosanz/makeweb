import { ChangeDetectionStrategy, Component, afterNextRender, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MotionService } from '../../core/animation/motion.service';
import { Commitments } from '../../sections/commitments/commitments';
import { Contact } from '../../sections/contact/contact';
import { Faq } from '../../sections/faq/faq';
import { Footer } from '../../sections/footer/footer';
import { Hero } from '../../sections/hero/hero';
import { Process } from '../../sections/process/process';
import { Services } from '../../sections/services/services';

@Component({
  selector: 'mw-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    Hero,
    Services,
    Process,
    Commitments,
    Faq,
    Contact,
    Footer,
  ],
  template: `
    <main id="contenido">
      <mw-hero />
      <mw-services />
      <mw-process />
      <mw-commitments />
      <mw-faq />
      <mw-contact />
    </main>
    <mw-footer />
  `,
})
export class Home {
  private readonly route = inject(ActivatedRoute);
  private readonly motion = inject(MotionService);

  constructor() {
    afterNextRender(() => {
      // Se llega aquí con fragmento cuando alguien pulsa "Precios" desde una
      // página legal: la portada se monta primero y luego baja a la sección.
      const fragment = this.route.snapshot.fragment;
      if (!fragment) return;

      // setTimeout y no requestAnimationFrame: en una pestaña en segundo plano
      // el navegador congela los frames y el salto no llegaría a producirse.
      setTimeout(() => {
        this.motion.refresh();
        this.motion.scrollTo(`#${fragment}`);
      }, 0);
    });
  }
}
