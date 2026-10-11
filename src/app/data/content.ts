/**
 * Todo el texto de la portada.
 *
 * Regla de la casa: aquí no entra ningún dato que no se pueda demostrar. Si un
 * número no se puede medir y repetir, no se escribe.
 */

export interface NavLink {
  id: string;
  label: string;
  /** Presente solo si el enlace lleva a otra página en vez de a una sección. */
  route?: string;
}

export const NAV_LINKS: readonly NavLink[] = [
  // Servicios baja a la sección de la portada, y en escritorio despliega las
  // páginas de servicio. El resto son páginas propias, como en cualquier
  // web de varias páginas: la portada resume y enlaza, no lo contiene todo.
  { id: 'servicios', label: $localize`Servicios` },
  { id: 'proyectos', label: $localize`Proyectos`, route: '/proyectos' },
  { id: 'precios', label: $localize`Precios`, route: '/precios' },
  { id: 'estudio', label: $localize`Estudio`, route: '/estudio' },
  { id: 'contacto', label: $localize`Contacto`, route: '/contacto' },
];

// --- hero -------------------------------------------------------------------

/** Búsquedas que se van tecleando en el buscador de la portada. */
export const HERO_QUERIES: readonly string[] = [
  $localize`peluquería cerca de mí`,
  $localize`pastelería con tartas por encargo`,
  $localize`dentista urgencias hoy`,
  $localize`taller de coches abierto ahora`,
  $localize`restaurante para cenar esta noche`,
  $localize`gimnasio con clases por la mañana`,
];

// --- services ---------------------------------------------------------------

/**
 * Una línea de lo que entra en un servicio. Lo que se cobra aparte va marcado:
 * si algo tiene cuota mensual se dice aquí, no en la factura.
 */
export interface ServiceItem {
  label: string;
  /**
   * Presente solo cuando la línea no va en el precio cerrado sino en cuota
   * mensual. El texto es el que se lee en la etiqueta: cada extra tiene su
   * propia tarifa, así que el precio vive aquí y no en la plantilla.
   */
  monthly?: string;
}

export interface Service {
  id: string;
  index: string;
  title: string;
  summary: string;
  includes: readonly ServiceItem[];
}

export const SERVICES: readonly Service[] = [
  {
    id: 'diseno',
    index: $localize`Diseño`,
    title: $localize`La primera impresión que te gana clientes`,
    summary:
      $localize`No diseñamos webs. Diseñamos la primera impresión que te va a ganar clientes. Cada color, cada detalle, pensado para tu negocio, no copiado de una plantilla.`,
    includes: [
      { label: $localize`Estilo propio para tu marca` },
      { label: $localize`Demo de la web antes de empezar` },
      { label: $localize`Igual de cuidada en todas las páginas` },
      { label: $localize`Textos incluidos` },
    ],
  },
  {
    id: 'desarrollo',
    index: $localize`Desarrollo`,
    title: $localize`Rápida de verdad, no rápida en el portátil del diseñador`,
    summary:
      $localize`Construimos tu web para que cargue rápido de verdad en todos los dispositivos, comprobado en condiciones reales, tal y como lo va a usar tu cliente.`,
    // Dicho como lo diría el dueño del negocio: la pila técnica (HTML, CSS y
    // JavaScript a mano, PHP y MySQL si hay datos) vive en la página del
    // servicio, para quien la busque; en la tarjeta asustaba más que ayudaba.
    includes: [
      { label: $localize`Carga rápido en cualquier móvil` },
      { label: $localize`Base de datos si la necesitas` },
      { label: $localize`Sin plantillas ni WordPress` },
      { label: $localize`Fácil de usar para todo el mundo` },
      { label: $localize`Publicada y funcionando` },
    ],
  },
  {
    id: 'seo-local',
    index: $localize`SEO`,
    title: $localize`Ser el mejor no sirve de nada si no te encuentran`,
    summary:
      $localize`Trabajamos tu ficha de Google, los datos de la web y las páginas por zona para que te encuentren cuando buscan cerca. Sin prometer posiciones: dependen también de tus reseñas y del tiempo.`,
    includes: [
      { label: $localize`Google Business` },
      { label: $localize`Google entiende tu horario y tu zona` },
      { label: $localize`Páginas por zona` },
      { label: $localize`Reseñas integradas` },
    ],
  },
  {
    id: 'conversion',
    index: $localize`Reservas`,
    title: $localize`Convertimos visitas en clientes`,
    summary:
      $localize`Reservas, citas y encargos desde tu web, conectados con lo que ya usas. Por ejemplo, una pastelería que recibe las tartas por encargo con fecha de recogida y señal pagada, en vez de perseguir mensajes de WhatsApp.`,
    includes: [
      { label: $localize`Reserva online` },
      { label: $localize`WhatsApp Business`, monthly: $localize`desde 50 €/mes` },
      { label: $localize`Pedidos y pagos` },
      { label: $localize`Avisos automáticos` },
    ],
  },
  // Lo que va más allá de la web del negocio local. Sin cuota ni precio: cada
  // uno es un proyecto distinto y se presupuesta aparte.
  {
    id: 'tienda',
    index: $localize`Tiendas`,
    title: $localize`Tu tienda, abierta las 24 horas`,
    summary:
      $localize`Tiendas online a medida para vender tus productos: catálogo, carrito, pagos seguros y envíos, con un panel sencillo para gestionar pedidos y existencias.`,
    includes: [
      { label: $localize`Catálogo y carrito` },
      { label: $localize`Pagos seguros` },
      { label: $localize`Envío o recogida en tienda` },
      { label: $localize`Panel de pedidos y stock` },
    ],
  },
  {
    id: 'software',
    index: $localize`Software`,
    title: $localize`Programas hechos para cómo trabajas`,
    summary:
      $localize`Aplicaciones web, paneles de gestión e integraciones a medida. Lo que hoy haces a mano o repartido en varias hojas de cálculo, en una sola herramienta.`,
    includes: [
      { label: $localize`Aplicaciones web` },
      { label: $localize`Paneles de gestión` },
      { label: $localize`Integraciones` },
      { label: $localize`Automatización de tareas` },
    ],
  },
  {
    id: 'ia',
    index: $localize`IA`,
    title: $localize`Inteligencia artificial que te quita trabajo`,
    summary:
      $localize`Asistentes que responden a tus clientes en la web o por WhatsApp con la información de tu negocio: si a las once de la noche te preguntan por una tarta de chocolate para el sábado, contesta él y te deja el encargo apuntado.`,
    includes: [
      { label: $localize`Asistente para web y WhatsApp` },
      { label: $localize`Automatización con IA` },
      { label: $localize`Correos y documentos` },
      { label: $localize`Formación para tu equipo` },
    ],
  },
  {
    id: 'cuidado',
    index: $localize`Cuidado`,
    title: $localize`No te dejamos con la web y adiós`,
    summary:
      $localize`Actualizaciones, copias de seguridad, los cambios pequeños del mes y un informe en castellano donde se entiende qué ha pasado. Todo en una sola cuota.`,
    // Una cuota y no tres: sueltas sumaban 100 €/mes y espantaban justo al
    // comercio pequeño que más las necesita.
    includes: [
      { label: $localize`Copias diarias` },
      { label: $localize`Cambios mensuales` },
      { label: $localize`Informe de resultados` },
      { label: $localize`Todo en un pack`, monthly: $localize`desde 49 €/mes` },
    ],
  },
];

// --- projects ---------------------------------------------------------------

/** Un trabajo publicado para un cliente real. */
export interface Project {
  /** Nombre del negocio, tal y como quiere aparecer. */
  name: string;
  /** Sector en dos o tres palabras: «Peluquería», «Clínica dental». */
  sector: string;
  /** Ciudad o zona, si el cliente da permiso. */
  place?: string;
  /** Captura de la web, en `public/img/proyectos/`, ancho 1200 y en WebP. */
  image: string;
  /** Dirección pública de la web, si se puede enlazar. */
  url?: string;
}

/**
 * Los trabajos que se enseñan en portada.
 *
 * Vacía a propósito: hay clientes, pero sus casos se publican cuando estén
 * preparados y con su permiso. Mientras esté vacía, la sección enseña tres
 * fichas de «caso en preparación». Nada inventado: ni negocios de ejemplo ni
 * capturas de webs que no hemos hecho.
 */
export const PROJECTS: readonly Project[] = [];

// --- process ----------------------------------------------------------------

export interface ProcessPhase {
  window: string;
  /** Primer y último día de la semana que ocupa la fase, de 1 a 7. */
  from: number;
  to: number;
  title: string;
  body: string;
  outputs: readonly string[];
}

/** Una secuencia real con duraciones reales: por eso va numerada por días. */
export const PROCESS: readonly ProcessPhase[] = [
  {
    window: $localize`Día 1`,
    from: 1,
    to: 1,
    title: $localize`Escuchamos`,
    body: $localize`Una videollamada contigo. Salimos sabiendo a quién quieres atraer y qué te está frenando ahora.`,
    outputs: [$localize`Primera reunión`, $localize`A quién quieres atraer`, $localize`Revisión de lo que ya tienes`],
  },
  {
    window: $localize`Días 2 – 4`,
    from: 2,
    to: 4,
    title: $localize`Diseñamos`,
    body: $localize`Ves la web antes de que exista: una demo navegable, con tus fotos y tus textos. Ajustamos hasta que la reconoces como tuya.`,
    outputs: [$localize`Demo de la web`, $localize`Textos redactados`, $localize`Dos rondas de cambios`],
  },
  {
    window: $localize`Días 5 – 6`,
    from: 5,
    to: 6,
    title: $localize`Desarrollamos`,
    body: $localize`Programamos, conectamos reservas y analítica, y lo probamos en móviles de verdad antes de enseñártelo.`,
    outputs: [$localize`Web a medida`, $localize`Reservas conectadas`, $localize`Medición de visitas y contactos`],
  },
  {
    window: $localize`Día 7`,
    from: 7,
    to: 7,
    title: $localize`Lanzamos`,
    body: $localize`Publicamos, avisamos a Google y te enseñamos a moverla.`,
    outputs: [$localize`Puesta en marcha`, $localize`Formación en vídeo`, $localize`Alta en Google`],
  },
];

/**
 * El proceso de las tiendas, el software y la IA. Sin días: cada proyecto tiene
 * su tamaño, y la fecha se da en la propuesta, no antes de saber qué se hace.
 */
export const PROJECT_PROCESS: readonly ProcessPhase[] = [
  {
    window: $localize`Paso 1`,
    from: 1,
    to: 1,
    title: $localize`Escuchamos`,
    body: $localize`Una videollamada para entender cómo trabajas hoy, qué te quita tiempo y qué quieres conseguir.`,
    outputs: [],
  },
  {
    window: $localize`Paso 2`,
    from: 2,
    to: 2,
    title: $localize`Proponemos`,
    body: $localize`Te enviamos por escrito qué vamos a hacer, el precio cerrado y la fecha de entrega. Decides tú.`,
    outputs: [],
  },
  {
    window: $localize`Paso 3`,
    from: 3,
    to: 3,
    title: $localize`Construimos`,
    body: $localize`Por fases, para que lo pruebes desde pronto y lo ajustemos con tu uso real.`,
    outputs: [],
  },
  {
    window: $localize`Paso 4`,
    from: 4,
    to: 4,
    title: $localize`Entregamos`,
    body: $localize`Lo ponemos en marcha, te enseñamos a usarlo y te entregamos el código y los accesos.`,
    outputs: [],
  },
];

// --- pricing ----------------------------------------------------------------

export interface Plan {
  id: string;
  name: string;
  /** Qué es en román paladino: el nombre da categoría, esto da claridad. */
  kind: string;
  /** Horquilla real: el precio final depende del alcance, y se cierra antes de empezar. */
  from: number;
  to: number;
  /** Matiz que va pegado al precio, si lo hay. */
  note?: string;
  pitch: string;
  best: boolean;
  features: readonly string[];
  cta: string;
}

export const PLANS: readonly Plan[] = [
  {
    id: 'estatica',
    name: $localize`Esencial`,
    kind: $localize`Web estática`,
    from: 350,
    to: 400,
    note: $localize`Negociable`,
    pitch: $localize`Una página bien contada y tu ficha de Google, listas en una semana.`,
    best: false,
    features: [
      $localize`Web de una página, larga y bien contada`,
      $localize`Diseño a medida, no plantilla`,
      $localize`Ficha de Google optimizada`,
      $localize`Botón de WhatsApp y llamada`,
      $localize`Lista en una semana`,
    ],
    cta: $localize`Empezar por aquí`,
  },
  {
    id: 'animaciones',
    name: $localize`Profesional`,
    kind: $localize`Web con animaciones`,
    from: 450,
    to: 700,
    pitch: $localize`Diseño a medida y movimiento al servicio de la lectura, sin perder velocidad.`,
    best: true,
    features: [
      $localize`Todo lo del plan Esencial`,
      $localize`Cambias tú precios, fotos y horarios`,
      $localize`Varias páginas o secciones`,
      $localize`Páginas para salir en Google en cada zona`,
      $localize`Sabes cuántos te llaman o escriben desde la web`,
    ],
    cta: $localize`Quiero esta`,
  },
  {
    id: 'citas',
    name: $localize`Integral`,
    kind: $localize`Animaciones, citas y encargos`,
    from: 1000,
    to: 1100,
    pitch: $localize`Citas, reservas o encargos con señal desde la web, con avisos automáticos.`,
    best: false,
    features: [
      $localize`Todo lo del plan Profesional`,
      $localize`Citas, reservas o encargos con hora de recogida`,
      $localize`Avisos automáticos al cliente y a ti`,
      $localize`Pago o señal desde la web`,
      $localize`Tu agenda y tus encargos, desde el móvil`,
    ],
    cta: $localize`Hablemos del proyecto`,
  },
];

// --- commitments ------------------------------------------------------------

/** El icono de cada compromiso, dibujado en `CommitmentsSection`. */
export type CommitmentIcon = 'price' | 'key' | 'calendar' | 'play' | 'chart' | 'chat';

export interface Commitment {
  icon: CommitmentIcon;
  title: string;
  body: string;
}

/**
 * Compromisos verificables: lo que reduce el riesgo de comprar. Nacieron para
 * sustituir a los testimonios cuando el estudio aún no tenía clientes, porque
 * inventar reseñas además de engañar es competencia desleal. Las reseñas de
 * verdad irán junto a los casos de `PROJECTS`.
 */
export const COMMITMENTS: readonly Commitment[] = [
  {
    icon: 'price',
    title: $localize`Precio cerrado antes de empezar`,
    body: $localize`El presupuesto que firmas es el que pagas. Si aparece algo fuera de alcance, se te dice y decides tú; no llega como sorpresa en la factura.`,
  },
  {
    icon: 'key',
    title: $localize`La web es tuya, toda`,
    body: $localize`Dominio a tu nombre, código entregado y accesos en tu poder. Puedes llevártela a otro estudio cuando quieras y no te pediremos explicaciones.`,
  },
  {
    icon: 'calendar',
    title: $localize`Plazo con fecha, no “pronto”`,
    body: $localize`Te damos día de entrega desde el principio. Si se mueve por nuestra culpa, te descontamos un 5 % por cada día laborable de retraso, hasta un 25 %; si se mueve porque faltan tus fotos, te avisamos el mismo día.`,
  },
  {
    icon: 'play',
    title: $localize`Te enseñamos a manejarla`,
    body: $localize`Al publicar te grabamos vídeos cortos con lo que vas a tocar tú, y durante el primer mes nos escribes por WhatsApp cuando te atasques; después, si tienes el mantenimiento, seguimos ahí. No dependes de nadie para cambiar un horario.`,
  },
  {
    icon: 'chart',
    title: $localize`Lo medimos y te lo enseñamos`,
    body: $localize`Velocidad, visitas y contactos, en un informe en castellano. Empezando por esta misma página: mide su velocidad con la herramienta gratuita de Google y compruébalo tú.`,
  },
  {
    icon: 'chat',
    title: $localize`Te contesta quien la hace`,
    body: $localize`No hay cuenta ni centralita. Escribes y responde la persona que tiene el proyecto en las manos.`,
  },
];

// --- faq --------------------------------------------------------------------

export interface Faq {
  q: string;
  a: string;
}

export const FAQS: readonly Faq[] = [
  {
    q: $localize`¿Cuánto se tarda en tener la web funcionando?`,
    a: $localize`Una semana. El día 1 hablamos, del 2 al 4 diseñamos, el 5 y el 6 desarrollamos y el día 7 se publica. El plazo solo se alarga si faltan fotos o textos por tu parte, y te avisamos en cuanto ocurre.`,
  },
  {
    q: $localize`¿Cuánto cuesta y de qué depende el precio?`,
    a: $localize`Una web estática va de 350 € a 400 € y es negociable. Con animaciones, de 450 € a 700 €. Con animaciones y citas o encargos con señal, de 1.000 € a 1.100 €. Dentro de cada horquilla el precio depende del número de páginas y de las integraciones, y se cierra por escrito antes de empezar: el presupuesto que firmas es el que pagas.`,
  },
  {
    q: $localize`¿Cómo se paga?`,
    a: $localize`La mitad al empezar y la mitad al publicar. Sin cuotas escondidas: el mantenimiento es aparte, opcional, y solo si lo quieres.`,
  },
  {
    q: $localize`Trabajáis en remoto. ¿Eso me afecta en algo?`,
    a: $localize`En el precio, para bien: sin oficina que mantener, el presupuesto se va entero a tu proyecto. El trabajo se hace por videollamada y con un documento compartido donde ves el avance cada día. Si prefieres vernos en persona para arrancar, se organiza.`,
  },
  {
    q: $localize`No tengo fotos buenas de mi negocio. ¿Es un problema?`,
    a: $localize`No. Te enviamos una guía para hacerlas tú con el móvil, y si prefieres, coordinamos a un fotógrafo en tu ciudad. Mientras tanto usamos recursos de calidad para que la web pueda salir a tiempo.`,
  },
  {
    q: $localize`¿La web es mía o me quedo atado a vosotros?`,
    a: $localize`Es tuya. El dominio se registra a tu nombre, te entregamos el código y los accesos, y puedes llevártela cuando quieras. El mantenimiento es opcional y se cancela con un mes de aviso.`,
  },
  {
    q: $localize`¿Y si a mitad del proyecto quiero cambiar cosas?`,
    a: $localize`Durante el diseño hay dos rondas de cambios incluidas, que es donde salen casi todos. Si el cambio llega después y toca el alcance, te decimos qué cuesta y decides tú; nunca aparece de sorpresa en la factura.`,
  },
  {
    q: $localize`¿Podré cambiar textos o precios yo mismo?`,
    a: $localize`Sí. Dejamos editable lo que se toca a menudo (carta, horarios, precios, ofertas) y te grabamos un vídeo corto explicando cómo. Si prefieres no tocar nada, lo hacemos nosotros dentro del mantenimiento.`,
  },
  {
    q: $localize`¿Qué pasa si ya tengo una web hecha?`,
    a: $localize`La auditamos gratis. A veces sale más a cuenta arreglar lo que tienes que rehacerlo, y te lo diremos aunque nos convenga lo contrario. Si la rehacemos, mantenemos las direcciones que ya posicionan.`,
  },
  // Al final y no en medio: las páginas de servicio eligen sus preguntas por
  // posición en esta lista.
  {
    q: $localize`¿Dónde estáis? ¿Solo hacéis webs en Alicante?`,
    a: $localize`Estamos en Mutxamel, junto a Alicante, y hacemos webs para negocios de toda España. Con los de la provincia de Alicante podemos vernos en persona para arrancar; con el resto, todo funciona igual de bien por videollamada.`,
  },
  {
    q: $localize`¿Solo hacéis páginas web?`,
    a: $localize`No. También hacemos tiendas online, software a medida, soluciones con inteligencia artificial y, en general, cualquier proyecto informático que necesite tu negocio. Cuéntanos qué te hace falta y te decimos con sinceridad si podemos hacerlo, cuánto cuesta y cuánto tarda.`,
  },
  {
    q: $localize`¿Por qué no me la hago yo con Wix o algo parecido?`,
    a: $localize`Puedes, y a veces para empezar basta. La diferencia es que no la montas tú: trabajamos tu ficha de Google y las páginas por zona para que te encuentren, la web carga rápido en el móvil, es tuya y no dependes de la cuota de una plataforma. Haz la cuenta a tres años: una plataforma de unos 20 € al mes son más de 700 €, y la web nunca llega a ser tuya. Con nosotros pagas la web una vez y después solo el dominio y el alojamiento, entre 50 y 120 € al año. Si con lo que necesitas te basta una plantilla, te lo diremos.`,
  },
];
