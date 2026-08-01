import { Injectable, computed, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  ACCEPT_ALL,
  CONSENT_KEY,
  CONSENT_VERSION,
  ConsentChoice,
  StoredConsent,
} from './consent.model';
import { selectChoice } from './consent.feature';

/**
 * Lee y escribe la decisión sobre cookies, y responde a la única pregunta que
 * importa antes de cargar un script de terceros: ¿puedo?
 *
 *   if (consent.allows('analytics')) { … carga la analítica … }
 *
 * Mientras no haya respuesta, `allows()` devuelve false. Esa es la regla: nada
 * que no sea técnico se carga sin permiso previo.
 */
@Injectable({ providedIn: 'root' })
export class ConsentService {
  private readonly store = inject(Store);

  readonly choice = this.store.selectSignal(selectChoice);
  readonly analytics = computed(() => this.choice()?.analytics === true);
  readonly marketing = computed(() => this.choice()?.marketing === true);

  allows(category: keyof ConsentChoice): boolean {
    if (category === 'necessary') return true;
    return this.choice()?.[category] === true;
  }

  /** Devuelve null si no hay nada guardado o si el guardado ya no vale. */
  read(): ConsentChoice | null {
    try {
      const raw = localStorage.getItem(CONSENT_KEY);
      if (!raw) return null;

      const stored = JSON.parse(raw) as StoredConsent;
      if (stored.version !== CONSENT_VERSION) return null;

      return { ...ACCEPT_ALL, ...stored.choice, necessary: true };
    } catch {
      // Modo incógnito, almacenamiento lleno o JSON corrupto: preguntamos otra vez.
      return null;
    }
  }

  write(choice: ConsentChoice): void {
    const stored: StoredConsent = {
      choice,
      date: new Date().toISOString(),
      version: CONSENT_VERSION,
    };

    try {
      localStorage.setItem(CONSENT_KEY, JSON.stringify(stored));
    } catch {
      // Si no se puede guardar, la web sigue funcionando: se volverá a preguntar.
    }
  }
}
