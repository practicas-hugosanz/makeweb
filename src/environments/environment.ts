/**
 * Configuración que cambia entre entornos.
 *
 * `leadEndpoint` es lo único que hace falta para que el formulario empiece a
 * funcionar de verdad: pega aquí la URL que te dé Formspree, Resend, tu CRM o
 * una función serverless y ya está. Mientras esté vacío, el formulario NO
 * finge que ha enviado nada: muestra un error explicando que falta conectarlo.
 *
 * `analyticsId` funciona igual: mientras esté vacío no se carga analítica
 * ninguna, ni siquiera con las cookies aceptadas.
 */
export const environment = {
  production: true,
  /** POST con el lead en JSON. Debe responder 2xx. */
  leadEndpoint: '',
  /** Identificador del proveedor de analítica. Vacío = sin analítica. */
  analyticsId: '',
} as const;
