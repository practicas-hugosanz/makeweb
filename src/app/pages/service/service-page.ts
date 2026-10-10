import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { PROCESS } from '../../data/content';
import { SERVICE_PAGES, servicePage } from '../../data/services';
import { CtaCard, CtaLink } from '../../sections/cta-card/cta-card';
import { Footer } from '../../sections/footer/footer';
import { PageHero } from '../../sections/page-hero/page-hero';
import { ServiceArt, ServiceArtKind } from '../../sections/service-art/service-art';

/**
 * Una página por servicio, con la misma estructura en todas: hero, tres datos,
 * lo que incluye, el proceso, las preguntas y el cierre. El contenido sale de
 * `SERVICE_PAGES`; la ruta solo dice cuál.
 */
@Component({
  selector: 'mw-service-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageHero, CtaCard, Footer, ServiceArt],
  template: `
    @if (page(); as p) {
      <main id="contenido">
        <mw-page-hero
          [crumb]="p.name"
          [parent]="parent"
          [lead]="p.lead"
          [media]="true"
        >
          <span title>{{ p.title[0] }}<em>{{ p.title[1] }}</em>{{ p.title[2] }}</span>
          <mw-service-art media [kind]="artFor(p.service.id)" />
        </mw-page-hero>

        <!-- Tres datos, en grande, con un filete entre ellos. -->
        <section class="sp-stats shell">
          @for (stat of p.stats; track stat.title) {
            <div class="sp-stat">
              <p class="sp-stat__value">{{ stat.value }}</p>
              <h2 class="sp-stat__title">{{ stat.title }}</h2>
              <p class="sp-stat__body">{{ stat.body }}</p>
            </div>
          }
        </section>

        <section class="sec shell sp-offers">
          <h2 class="sec-title">
            {{ p.offersTitle[0] }}<em>{{ p.offersTitle[1] }}</em>{{ p.offersTitle[2] }}
          </h2>

          <ol class="sp-offers__list">
            @for (offer of p.offers; track offer.title; let i = $index) {
              <li class="sp-offer">
                <span class="sp-offer__num">{{ pad(i + 1) }}</span>
                <h3 class="sp-offer__title">{{ offer.title }}</h3>
                <p class="sp-offer__body">
                  {{ offer.body }}
                  @if (offer.monthly; as fee) {
                    <span class="sp-offer__fee">{{ fee }}</span>
                  }
                </p>
              </li>
            }
          </ol>
        </section>

        <section class="sec shell sp-process">
          <div class="sec-head sec-head--split">
            <h2 class="sec-title" i18n>Una semana, <em>del principio al final.</em></h2>
            <p class="sec-lead" i18n>
              Un solo interlocutor y sin jerga. Siempre sabes en qué punto está tu web.
            </p>
          </div>

          <ol class="sp-steps">
            @for (step of process; track step.title) {
              <li class="sp-step">
                <span class="sp-step__when">{{ step.window }}</span>
                <h3 class="sp-step__title">{{ step.title }}</h3>
                <p class="sp-step__body">{{ step.body }}</p>
              </li>
            }
          </ol>
        </section>

        <section class="sec shell sp-faq">
          <h2 class="sec-title" i18n>Tus <em>preguntas.</em></h2>

          <div class="sp-faq__list">
            @for (item of p.faqs; track item.q) {
              <details class="sp-q">
                <summary>
                  {{ item.q }}
                  <span class="sp-q__sign" aria-hidden="true"></span>
                </summary>
                <p>{{ item.a }}</p>
              </details>
            }
          </div>
        </section>

        <mw-cta-card [title]="p.closing" [links]="related()" />
      </main>

      <mw-footer />
    }
  `,
  styleUrl: './service-page.scss',
})
export class ServicePage {
  private readonly route = inject(ActivatedRoute);

  // Cada servicio tiene su propia ruta fija, y el `slug` viaja en sus datos.
  private readonly slug = toSignal(this.route.data.pipe(map((d) => (d['slug'] as string) ?? '')), {
    initialValue: (this.route.snapshot.data['slug'] as string) ?? '',
  });

  protected readonly page = computed(() => servicePage(this.slug()));
  protected readonly process = PROCESS;
  protected readonly parent = { label: $localize`Servicios`, link: '/', fragment: 'servicios' };

  /** Los dos servicios siguientes, en bucle: cada página lleva a otras dos. */
  protected readonly related = computed<CtaLink[]>(() => {
    const i = SERVICE_PAGES.findIndex((p) => p.slug === this.slug());
    return [1, 2].map((step) => {
      const next = SERVICE_PAGES[(i + step) % SERVICE_PAGES.length];
      return { label: next.name, sub: next.service.title, link: '/servicios/' + next.slug };
    });
  });

  protected artFor(id: string): ServiceArtKind {
    return id as ServiceArtKind;
  }

  protected pad(n: number): string {
    return String(n).padStart(2, '0');
  }
}
