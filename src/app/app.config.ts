import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { TitleStrategy, provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';

import { routes } from './app.routes';
import { SeoStrategy } from './core/seo';
import { uiFeature } from './state/ui/ui.feature';
import { leadFeature } from './state/lead/lead.feature';
import { consentFeature } from './state/consent/consent.feature';
import * as leadEffects from './state/lead/lead.effects';
import * as consentEffects from './state/consent/consent.effects';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    // ScrollSmoother controla el scroll, así que el router no debe tocarlo.
    provideRouter(routes, withInMemoryScrolling({ anchorScrolling: 'disabled' })),
    // Escribe título, descripción, canónica, Open Graph y datos estructurados
    // de cada página. El enrutador la llama también al prerenderizar, que es
    // cuando importa: ese HTML es el que lee el buscador.
    { provide: TitleStrategy, useClass: SeoStrategy },
    provideAnimationsAsync(),
    provideHttpClient(withFetch()),
    provideStore({
      [uiFeature.name]: uiFeature.reducer,
      [leadFeature.name]: leadFeature.reducer,
      [consentFeature.name]: consentFeature.reducer,
    }),
    provideEffects(leadEffects, consentEffects), provideClientHydration(withEventReplay()),
  ],
};
