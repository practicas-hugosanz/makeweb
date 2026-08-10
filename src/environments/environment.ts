/**
 * Configuración que cambia entre entornos.
 *
 * El formulario de contacto entrega en contacto@makeweb.es (buzón de IONOS),
 * pero una web estática no puede enviar correo por sí misma: no hay servidor
 * donde guardar la contraseña SMTP, y meterla aquí la haría pública. Por eso
 * el envío pasa por Web3Forms, que recibe el POST y reenvía el mensaje al
 * buzón con el que se creó la clave.
 *
 * `leadAccessKey` es lo único que falta para que funcione. Se saca en
 * https://web3forms.com poniendo contacto@makeweb.es: llega un correo con la
 * clave (un UUID), se pega aquí y ya está. Mientras esté vacía el formulario
 * NO finge que ha enviado nada: muestra un error explicando que falta
 * conectarlo.
 *
 * La clave es pública por diseño —va en el JavaScript del navegador—, pero no
 * da acceso a nada: solo permite enviar mensajes a ese mismo buzón, nunca
 * leerlos ni escribir desde él.
 *
 * `analyticsId` funciona igual: mientras esté vacío no se carga analítica
 * ninguna, ni siquiera con las cookies aceptadas.
 */
export const environment = {
  production: true,
  /** POST con el lead en JSON. Debe responder 2xx. */
  leadEndpoint: 'https://api.web3forms.com/submit',
  /** Clave de Web3Forms asociada a contacto@makeweb.es. Vacía = sin envío. */
  leadAccessKey: '95e16121-3938-4c65-99e5-d37696d55ef0',
  /** Buzón al que llegan los leads. Solo informativo: manda la clave. */
  leadInbox: 'contacto@makeweb.es',
  /** Identificador del proveedor de analítica. Vacío = sin analítica. */
  analyticsId: '',
} as const;
