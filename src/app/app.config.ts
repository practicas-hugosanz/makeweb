import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';

import { routes } from './app.routes';
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
