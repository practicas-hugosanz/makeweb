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
  { id: 'servicios', label: 'Servicios' },
  { id: 'proceso', label: 'Proceso' },
  { id: 'precios', label: 'Precios', route: '/precios' },
  { id: 'preguntas', label: 'Preguntas' },
];

// --- hero -------------------------------------------------------------------

/** Búsquedas que se van tecleando en el buscador de la portada. */
export const HERO_QUERIES: readonly string[] = [
  'peluquería cerca de mí',
  'dentista urgencias hoy',
  'taller de coches abierto ahora',
  'restaurante para cenar esta noche',
  'gimnasio con clases por la mañana',
];

// --- services ---------------------------------------------------------------

export interface Service {
  id: string;
  index: string;
  title: string;
  summary: string;
  includes: readonly string[];
}

export const SERVICES: readonly Service[] = [
  {
    id: 'diseno',
    index: 'Diseño',
    title: 'La primera impresión que te gana clientes',
    summary:
      'No diseñamos webs. Diseñamos la primera impresión que te va a ganar clientes. Cada color, cada detalle, pensado para tu negocio, no copiado de una plantilla.',
    includes: ['Dirección de arte', 'Diseño en Figma', 'Sistema de componentes', 'Textos incluidos'],
  },
  {
    id: 'desarrollo',
    index: 'Desarrollo',
    title: 'Rápida de verdad, no rápida en el portátil del diseñador',
    summary:
      'Construimos tu web para que cargue rápido de verdad en todos los dispositivos, comprobado en condiciones reales, tal y como lo va a usar tu cliente.',
    // La pila que se entrega al cliente, dicha sin rodeos: HTML, CSS y
    // JavaScript escritos a mano, y PHP con MySQL solo cuando el negocio
    // necesita guardar datos. Ni plantillas ni gestores que engordan la web.
    includes: [
      'HTML, CSS y JavaScript',
      'PHP, MySQL y phpMyAdmin si lleva base de datos',
      'Sin plantillas ni WordPress',
      'Accesible AA',
      'Hosting configurado',
    ],
  },
  {
    id: 'seo-local',
    index: 'SEO',
    title: 'Ser el mejor no sirve de nada si no te encuentran',
    summary:
      'Nos encargamos de que aparezcas primero cuando alguien busca cerca: ficha de Google, datos estructurados y páginas por zona.',
    includes: ['Google Business', 'Schema local', 'Páginas por zona', 'Reseñas integradas'],
  },
  {
    id: 'conversion',
    index: 'Reservas',
    title: 'Convertimos visitas en clientes',
    summary:
      'Montamos y cuidamos todo el sistema de reservas, citas y pedidos de tu web, conectado con las herramientas que ya usas, para que cada visita tenga un camino claro hasta convertirse en cliente.',
    includes: ['Reserva online', 'WhatsApp Business', 'Pedidos y pagos', 'Avisos automáticos'],
  },
  {
    id: 'cuidado',
    index: 'Cuidado',
    title: 'No te dejamos con la web y adiós',
    summary:
      'Actualizaciones, copias de seguridad y un informe mensual en castellano donde se entiende qué ha pasado.',
    includes: ['Soporte por WhatsApp', 'Copias diarias', 'Cambios mensuales', 'Informe de resultados'],
  },
];

// --- process ----------------------------------------------------------------

export interface ProcessPhase {
  window: string;
  title: string;
  body: string;
  outputs: readonly string[];
}

/** Una secuencia real con duraciones reales: por eso va numerada por días. */
export const PROCESS: readonly ProcessPhase[] = [
  {
    window: 'Día 1',
    title: 'Escuchamos',
    body: 'Una videollamada contigo. Salimos sabiendo a quién quieres atraer y qué te está frenando ahora.',
    outputs: ['Sesión de arranque', 'Mapa de clientes', 'Auditoría de la web actual'],
  },
  {
    window: 'Días 2 – 4',
    title: 'Diseñamos',
    body: 'Ves la web antes de que exista: pantallas reales, con tus fotos y tus textos. Ajustamos hasta que la reconoces como tuya.',
    outputs: ['Diseño en Figma', 'Textos redactados', 'Dos rondas de cambios'],
  },
  {
    window: 'Días 5 – 6',
    title: 'Desarrollamos',
    body: 'Programamos, conectamos reservas y analítica, y lo probamos en móviles de verdad antes de enseñártelo.',
    outputs: ['Web a medida', 'Reservas conectadas', 'Analítica y eventos'],
  },
  {
    window: 'Día 7',
    title: 'Lanzamos',
    body: 'Publicamos, avisamos a Google y te enseñamos a moverla.',
    outputs: ['Puesta en marcha', 'Formación en vídeo', 'Alta en Google'],
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
    name: 'Esencial',
    kind: 'Web estática',
    from: 350,
    to: 400,
    note: 'Negociable',
    pitch: 'Para el negocio que hoy solo tiene un perfil de Instagram y necesita estar en internet ya.',
    best: false,
    features: [
      'Web de una página, larga y bien contada',
      'Diseño a medida, no plantilla',
      'Ficha de Google optimizada',
      'Botón de WhatsApp y llamada',
      'Lista en una semana',
    ],
    cta: 'Empezar por aquí',
  },
  {
    id: 'animaciones',
    name: 'Profesional',
    kind: 'Web con animaciones',
    from: 450,
    to: 700,
    pitch: 'La web que se recuerda: movimiento con criterio, sin sacrificar velocidad.',
    best: true,
    features: [
      'Todo lo del plan Esencial',
      'Animaciones al desplazarte, como esta página',
      'Varias páginas o secciones',
      'SEO local por servicio y por zona',
      'Analítica con objetivos medibles',
    ],
    cta: 'Quiero esta',
  },
  {
    id: 'citas',
    name: 'Integral',
    kind: 'Animaciones y sistema de citas',
    from: 1000,
    to: 1100,
    pitch: 'Para quien vive de la agenda: peluquerías, clínicas, talleres, restaurantes.',
    best: false,
    features: [
      'Todo lo del plan Profesional',
      'Sistema de reservas y citas integrado',
      'Avisos automáticos al cliente y a ti',
      'Conectado con tus herramientas',
      'Panel para gestionar la agenda',
    ],
    cta: 'Hablemos del proyecto',
  },
];

// --- commitments ------------------------------------------------------------

export interface Commitment {
  title: string;
  body: string;
}

/**
 * Sustituye a los testimonios. Un estudio que empieza no tiene reseñas, y
 * inventarlas además de engañar es competencia desleal. Lo que sí se puede
 * ofrecer son compromisos verificables: esto es lo que reduce el riesgo de
 * comprar, que es para lo que servían los testimonios.
 */
export const COMMITMENTS: readonly Commitment[] = [
  {
    title: 'Precio cerrado antes de empezar',
    body: 'El presupuesto que firmas es el que pagas. Si aparece algo fuera de alcance, se te dice y decides tú; no llega como sorpresa en la factura.',
  },
  {
    title: 'La web es tuya, toda',
    body: 'Dominio a tu nombre, código entregado y accesos en tu poder. Puedes llevártela a otro estudio cuando quieras y no te pediremos explicaciones.',
  },
  {
    title: 'Plazo con fecha, no “pronto”',
    body: 'Te damos día de entrega desde el principio. Si se mueve por nuestra culpa, descontamos; si se mueve porque faltan tus fotos, te avisamos el mismo día.',
  },
  {
    title: 'Te enseñamos a manejarla',
    body: 'Al publicar te grabamos vídeos cortos con lo que vas a tocar tú, y durante el primer mes nos escribes por WhatsApp cuando te atasques. No dependes de nadie para cambiar un horario.',
  },
  {
    title: 'Lo medimos y te lo enseñamos',
    body: 'Velocidad, visitas y contactos, en un informe en castellano. Empezando por esta misma página: los números de arriba están medidos, no estimados.',
  },
  {
    title: 'Te contesta quien la hace',
    body: 'No hay cuenta ni centralita. Escribes y responde la persona que tiene el proyecto en las manos.',
  },
];

// --- faq --------------------------------------------------------------------

export interface Faq {
  q: string;
  a: string;
}

export const FAQS: readonly Faq[] = [
  {
    q: '¿Cuánto se tarda en tener la web funcionando?',
    a: 'Una semana. El día 1 hablamos, del 2 al 4 diseñamos, el 5 y el 6 desarrollamos y el día 7 se publica. El plazo solo se alarga si faltan fotos o textos por tu parte, y te avisamos en cuanto ocurre.',
  },
  {
    q: '¿Cuánto cuesta y de qué depende el precio?',
    a: 'Una web estática va de 350 € a 400 € y es negociable. Con animaciones, de 450 € a 700 €. Con animaciones y sistema de citas, de 1.000 € a 1.100 €. Dentro de cada horquilla el precio depende del número de páginas y de las integraciones, y se cierra por escrito antes de empezar: el presupuesto que firmas es el que pagas.',
  },
  {
    q: '¿Cómo se paga?',
    a: 'La mitad al empezar y la mitad al publicar. Sin cuotas escondidas: el mantenimiento es aparte, opcional, y solo si lo quieres.',
  },
  {
    q: 'Trabajáis en remoto. ¿Eso me afecta en algo?',
    a: 'En el precio, para bien: sin oficina que mantener, el presupuesto se va entero a tu proyecto. El trabajo se hace por videollamada y con un documento compartido donde ves el avance cada día. Si prefieres vernos en persona para arrancar, se organiza.',
  },
  {
    q: 'No tengo fotos buenas de mi negocio. ¿Es un problema?',
    a: 'No. Te enviamos una guía para hacerlas tú con el móvil, y si prefieres, coordinamos a un fotógrafo en tu ciudad. Mientras tanto usamos recursos de calidad para que la web pueda salir a tiempo.',
  },
  {
    q: '¿La web es mía o me quedo atado a vosotros?',
    a: 'Es tuya. El dominio se registra a tu nombre, te entregamos el código y los accesos, y puedes llevártela cuando quieras. El mantenimiento es opcional y se cancela con un mes de aviso.',
  },
  {
    q: '¿Y si a mitad del proyecto quiero cambiar cosas?',
    a: 'Durante el diseño hay dos rondas de cambios incluidas, que es donde salen casi todos. Si el cambio llega después y toca el alcance, te decimos qué cuesta y decides tú; nunca aparece de sorpresa en la factura.',
  },
  {
    q: '¿Podré cambiar textos o precios yo mismo?',
    a: 'Sí. Dejamos editable lo que se toca a menudo (carta, horarios, precios, ofertas) y te grabamos un vídeo corto explicando cómo. Si prefieres no tocar nada, lo hacemos nosotros dentro del mantenimiento.',
  },
  {
    q: '¿Qué pasa si ya tengo una web hecha?',
    a: 'La auditamos gratis. A veces sale más a cuenta arreglar lo que tienes que rehacerlo, y te lo diremos aunque nos convenga lo contrario. Si la rehacemos, mantenemos las direcciones que ya posicionan.',
  },
];
