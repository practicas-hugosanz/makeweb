import { Injectable, effect, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { ConsentService } from '../state/consent/consent.service';

/**
 * Carga la analítica, y solo entonces, si se cumplen dos condiciones:
 *
 *   1. hay un identificador configurado en `environment.analyticsId`, y
 *   2. la persona ha aceptado explícitamente las cookies analíticas.
 *
 * Mientras `analyticsId` esté vacío esto no hace absolutamente nada, así que
 * la web no carga nada de terceros hoy. Cuando contrates la herramienta, rellena
 * el identificador y adapta `injectScript()` al proveedor: el resto ya está.
 *
 * Si el consentimiento se retira, no basta con dejar de medir: hay que borrar
 * las cookies que se hubieran puesto, y eso es lo que hace `revoke()`.
 */
@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private readonly consent = inject(ConsentService);
  private loaded = false;

  constructor() {
    effect(() => {
      if (this.consent.analytics()) this.load();
      else this.revoke();
    });
  }

  private load(): void {
    if (this.loaded || !environment.analyticsId) return;
    this.loaded = true;
    this.injectScript(environment.analyticsId);
  }

  private injectScript(id: string): void {
    // Sustituye el cuerpo por el snippet de tu proveedor. Ejemplo con un script
    // externo genérico, cargado en diferido para no tocar el primer pintado:
    const script = document.createElement('script');
    script.async = true;
    script.defer = true;
    script.dataset['analyticsId'] = id;
    // script.src = `https://…/script.js`;
    document.head.appendChild(script);
  }

  /** Quita las cookies del proveedor cuando se retira el consentimiento. */
  private revoke(): void {
    if (!this.loaded) return;

    for (const entry of document.cookie.split(';')) {
      const name = entry.split('=')[0]?.trim();
      if (!name || !this.isAnalyticsCookie(name)) continue;
      document.cookie = `${name}=; Max-Age=0; path=/`;
      document.cookie = `${name}=; Max-Age=0; path=/; domain=.${location.hostname}`;
    }

    this.loaded = false;
  }

  /** Ajusta los prefijos a los del proveedor que acabes usando. */
  private isAnalyticsCookie(name: string): boolean {
    return ['_ga', '_gid', '_gat', 'plausible', 'ph_'].some((prefix) => name.startsWith(prefix));
  }
}
