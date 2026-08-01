/**
 * Todo el texto de la portada.
 *
 * Regla de la casa: aquí no entra ningún dato que no se pueda demostrar. Las
 * cifras de la sección "Esta web" salen de una medición real con Lighthouse
 * (ver MEASURED.date) y cualquiera puede repetirla.
 */

export interface NavLink {
  id: string;
  label: string;
}

export const NAV_LINKS: readonly NavLink[] = [
  { id: 'servicios', label: 'Servicios' },
  { id: 'comparativa', label: 'Antes / después' },
  { id: 'proceso', label: 'Proceso' },
  { id: 'esta-web', label: 'Esta web' },
  { id: 'precios', label: 'Precios' },
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
    title: 'Una web que se parece a tu negocio',
    summary:
      'Nada de plantillas recicladas. Partimos de tu local, tu carta, tu forma de atender, y de ahí sale la identidad digital.',
    includes: ['Dirección de arte', 'Diseño en Figma', 'Sistema de componentes', 'Textos incluidos'],
  },
  {
    id: 'desarrollo',
    index: 'Desarrollo',
    title: 'Rápida en el móvil de tu cliente',
    summary:
      'La construimos en Angular, se publica como HTML ya generado y medimos Core Web Vitals reales, no en el portátil del diseñador.',
    includes: ['Angular 20 + TypeScript', 'HTML prerenderizado', 'Accesible AA', 'Hosting configurado'],
  },
  {
    id: 'seo-local',
    index: 'SEO local',
    title: 'Que te encuentren al buscar “cerca de mí”',
    summary:
      'Ficha de Google, datos estructurados, páginas por servicio y por barrio. Lo que hace que aparezcas en el mapa.',
    includes: ['Google Business', 'Schema local', 'Páginas por zona', 'Reseñas integradas'],
  },
  {
    id: 'conversion',
    index: 'Reservas',
    title: 'Reservas, pedidos y llamadas',
    summary:
      'Conectamos la web con la herramienta que ya usas para que la visita termine en una mesa reservada o una cita cerrada.',
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
    window: 'Días 1 – 2',
    title: 'Escuchamos',
    body: 'Una videollamada larga contigo. Salimos sabiendo a quién quieres atraer y qué te está frenando ahora.',
    outputs: ['Sesión de arranque', 'Mapa de clientes', 'Auditoría de la web actual'],
  },
  {
    window: 'Días 3 – 7',
    title: 'Diseñamos',
    body: 'Ves la web antes de que exista: pantallas reales, con tus fotos y tus textos. Ajustamos hasta que la reconoces como tuya.',
    outputs: ['Diseño en Figma', 'Textos redactados', 'Dos rondas de cambios'],
  },
  {
    window: 'Días 8 – 17',
    title: 'Desarrollamos',
    body: 'Programamos, conectamos reservas y analítica, y lo probamos en móviles de verdad antes de enseñártelo.',
    outputs: ['Web en Angular', 'Reservas conectadas', 'Analítica y eventos'],
  },
  {
    window: 'Días 18 – 21',
    title: 'Lanzamos',
    body: 'Publicamos, avisamos a Google y te enseñamos a moverla. A los 30 días revisamos juntos los primeros números.',
    outputs: ['Puesta en marcha', 'Formación en vídeo', 'Revisión a 30 días'],
  },
];

// --- "esta web" -------------------------------------------------------------

export interface Measurement {
  value: number;
  decimals?: number;
  suffix?: string;
  label: string;
  note: string;
}

/**
 * Medido con Lighthouse 12 sobre el build de producción servido comprimido,
 * que es como lo sirve cualquier hosting. Repetible: `npm run build` y pasarle
 * PageSpeed Insights al dominio.
 */
export const MEASURED = {
  date: '1 de agosto de 2026',
  tool: 'Lighthouse 12, build de producción',
} as const;

export const METRICS: readonly Measurement[] = [
  {
    value: 100,
    suffix: '/100',
    label: 'PageSpeed escritorio',
    note: 'Y 100 también en accesibilidad, buenas prácticas y SEO.',
  },
  {
    value: 95,
    suffix: '/100',
    label: 'PageSpeed móvil',
    note: 'Con 4G lento y CPU limitada, que es el escenario del test.',
  },
  {
    value: 2,
    decimals: 1,
    suffix: ' s',
    label: 'LCP en móvil',
    note: 'Lo que tarda en verse lo principal. Google pide menos de 2,5 s.',
  },
  {
    // Más claro que un CLS de 0,003: cualquiera puede abrir la pestaña de red
    // del navegador y contar. Y explica por qué la página va rápida.
    value: 0,
    suffix: '',
    label: 'Peticiones a terceros',
    note: 'Ni fuentes de Google, ni rastreadores, ni scripts de fuera.',
  },
];

export interface BuildFact {
  label: string;
  value: string;
}

/** Cómo está hecha esta misma página. Es el portfolio que sí podemos enseñar. */
export const BUILD_FACTS: readonly BuildFact[] = [
  { label: 'Framework', value: 'Angular 20, sin zone.js' },
  { label: 'Entrega', value: 'HTML generado en el build, no montado en el navegador' },
  { label: 'Tipografía', value: 'Autoalojada, 2 archivos de 16 kB' },
  { label: 'Peticiones a terceros', value: 'Cero' },
  { label: 'Cookies de terceros', value: 'Cero' },
  { label: 'Sin JavaScript', value: 'La página se lee entera igual' },
];

// --- pricing ----------------------------------------------------------------

export interface Plan {
  id: string;
  name: string;
  price: number;
  care: number;
  pitch: string;
  best: boolean;
  features: readonly string[];
  cta: string;
}

export const PLANS: readonly Plan[] = [
  {
    id: 'esencial',
    name: 'Esencial',
    price: 1190,
    care: 39,
    pitch: 'Para el negocio que hoy solo tiene un perfil de Instagram.',
    best: false,
    features: [
      'Web de una página, larga y bien contada',
      'Diseño a medida, no plantilla',
      'Ficha de Google optimizada',
      'Botón de WhatsApp y llamada',
      'Entrega en 14 días',
    ],
    cta: 'Empezar por aquí',
  },
  {
    id: 'negocio',
    name: 'Negocio',
    price: 2490,
    care: 69,
    pitch: 'Web completa y lista para captar, con todo lo que hace falta para aparecer.',
    best: true,
    features: [
      'Hasta 6 páginas + blog',
      'Reservas o pedidos conectados',
      'SEO local por servicio y por barrio',
      'Textos y sesión de fotos guiada',
      'Analítica con objetivos medibles',
      'Entrega en 21 días',
    ],
    cta: 'Quiero esta',
  },
  {
    id: 'medida',
    name: 'A medida',
    price: 4900,
    care: 129,
    pitch: 'Varios locales, catálogo grande o integraciones con tu software.',
    best: false,
    features: [
      'Arquitectura y diseño a medida',
      'Tienda online o portal de reservas',
      'Integración con tu TPV o CRM',
      'Multiidioma y multisede',
      'Acompañamiento durante 6 meses',
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
    title: 'Devolución a los 30 días',
    body: 'Si a los 30 días de publicarla no estás conforme, devolvemos el primer pago. Sin discutir y sin quedarnos con el trabajo.',
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
    a: 'Tres semanas desde que nos das el visto bueno al diseño. El plan Esencial suele estar en dos. El plazo solo se alarga si faltan fotos o textos por tu parte, y te avisamos en cuanto ocurre.',
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
    q: '¿Podré cambiar textos o precios yo mismo?',
    a: 'Sí. Dejamos editable lo que se toca a menudo (carta, horarios, precios, ofertas) y te grabamos un vídeo corto explicando cómo. Si prefieres no tocar nada, lo hacemos nosotros dentro del mantenimiento.',
  },
  {
    q: '¿Qué pasa si ya tengo una web hecha?',
    a: 'La auditamos gratis. A veces sale más a cuenta arreglar lo que tienes que rehacerlo, y te lo diremos aunque nos convenga lo contrario. Si la rehacemos, mantenemos las direcciones que ya posicionan.',
  },
];
