import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LEAD_LIMITS, multiLine, singleLine } from '../../core/forms/sanitize';
import { PLANS } from '../../data/content';
import { Lead, STARTING_POINTS, UNDECIDED_PLAN } from './lead.model';

export interface LeadReceipt {
  reference: string;
}

/** Lo que devuelve Web3Forms: un 200 con `success: false` sigue siendo un fallo. */
interface Web3FormsResponse {
  success: boolean;
  message?: string;
}

/** Los ids que viajan en el formulario no se entienden en un correo. */
function planLabel(id: string): string {
  if (id === UNDECIDED_PLAN.id) return UNDECIDED_PLAN.label;
  const plan = PLANS.find((candidate) => candidate.id === id);
  return plan ? `${plan.name} — ${plan.kind}` : id;
}

function startingPointLabel(id: string): string {
  return STARTING_POINTS.find((point) => point.id === id)?.label ?? id;
}

/**
 * Envío del formulario de contacto a contacto@makeweb.es vía Web3Forms.
 *
 * Sin `leadAccessKey` configurada esto **falla a propósito**. La versión
 * anterior simulaba el envío y respondía "Recibido, te escribimos en 24 h",
 * de modo que una persona podía escribirnos y quedarse esperando una respuesta
 * que nunca iba a llegar. Un error honesto es mucho menos grave que eso.
 *
 * Para ponerlo en marcha: rellena `leadAccessKey` en `src/environments/`.
 */
@Injectable({ providedIn: 'root' })
export class LeadService {
  private readonly http = inject(HttpClient);

  send(lead: Lead): Observable<LeadReceipt> {
    if (!environment.leadAccessKey || !environment.leadEndpoint) {
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

    // Última puerta antes de que el texto salga de la web. Va aquí y no solo en
    // el formulario porque este servicio es el único camino de salida: cualquier
    // pantalla que mande un lead el día de mañana pasa por esta línea.
    const clean = {
      name: singleLine(lead.name, LEAD_LIMITS.name),
      business: singleLine(lead.business, LEAD_LIMITS.business),
      email: singleLine(lead.email, LEAD_LIMITS.email),
      phone: singleLine(lead.phone, LEAD_LIMITS.phone),
      message: multiLine(lead.message, LEAD_LIMITS.message),
    };

    // Las claves de este objeto son las etiquetas que aparecen en el correo,
    // así que se leen tal cual en la bandeja de entrada.
    const payload = {
      access_key: environment.leadAccessKey,
      subject: `Nuevo contacto de ${clean.business} — ${reference}`,
      from_name: 'Formulario de MakeWeb',
      // Responder en el cliente de correo escribe directamente al interesado.
      replyto: clean.email,
      Referencia: reference,
      Nombre: clean.name,
      Negocio: clean.business,
      Correo: clean.email,
      Teléfono: clean.phone || '(no lo ha dejado)',
      'Plan que le encaja': planLabel(lead.plan),
      'Qué tiene ahora': startingPointLabel(lead.current),
      Mensaje: clean.message,
      'Acepta la política de privacidad': lead.consent ? 'Sí' : 'No',
      Enviado: new Date().toISOString(),
    };

    return this.http.post<Web3FormsResponse>(environment.leadEndpoint, payload).pipe(
      map((response) => {
        if (!response?.success) throw new Error(response?.message ?? 'Envío rechazado');
        return { reference };
      }),
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
