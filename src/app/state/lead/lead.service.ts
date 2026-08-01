import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Lead } from './lead.model';

export interface LeadReceipt {
  reference: string;
}

/**
 * Envío del formulario de contacto.
 *
 * Sin `leadEndpoint` configurado esto **falla a propósito**. La versión
 * anterior simulaba el envío y respondía "Recibido, te escribimos en 24 h",
 * de modo que una persona podía escribirnos y quedarse esperando una respuesta
 * que nunca iba a llegar. Un error honesto es mucho menos grave que eso.
 *
 * Para ponerlo en marcha: rellena `leadEndpoint` en `src/environments/`.
 */
@Injectable({ providedIn: 'root' })
export class LeadService {
  private readonly http = inject(HttpClient);

  send(lead: Lead): Observable<LeadReceipt> {
    if (!environment.leadEndpoint) {
      return throwError(
        () =>
          new Error(
            'El formulario todavía no está conectado a ningún correo. ' +
              'Escríbenos directamente mientras tanto.',
          ),
      );
    }

    const reference = `MW-${new Date().getFullYear()}-${Math.random()
      .toString(36)
      .slice(2, 7)
      .toUpperCase()}`;

    return this.http
      .post<unknown>(environment.leadEndpoint, { ...lead, reference, sentAt: new Date().toISOString() })
      .pipe(
        map(() => ({ reference })),
        catchError(() =>
          throwError(
            () =>
              new Error(
                'No hemos podido enviar el mensaje. Inténtalo otra vez en un minuto ' +
                  'o escríbenos directamente.',
              ),
          ),
        ),
      );
  }
}
