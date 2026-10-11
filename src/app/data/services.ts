/**
 * Las páginas de servicio: una por cada servicio de la portada.
 *
 * Misma regla que `content.ts`: nada que no se pueda demostrar. Las cifras son
 * plazos del proceso o precios que ya están publicados, y las preguntas
 * reutilizan respuestas de `FAQS`, que son compromisos ya firmados en la web;
 * aquí no se promete nada nuevo.
 */

import { FAQS, Faq, SERVICES, Service } from './content';

export interface ServiceStat {
  value: string;
  title: string;
  body: string;
}

export interface ServiceOffer {
  title: string;
  body: string;
  /** Cuota mensual, si la tiene: siempre con «desde». */
  monthly?: string;
}

export interface ServicePage {
  slug: string;
  /** El servicio de la portada del que sale esta página. */
  service: Service;
  /** Nombre corto, para menús y migas de pan. */
  name: string;
  /** Titular en tres trozos: el del medio va en cursiva. */
  title: readonly [string, string, string];
  lead: string;
  stats: readonly ServiceStat[];
  offersTitle: readonly [string, string, string];
  offers: readonly ServiceOffer[];
  faqs: readonly Faq[];
  /** El cierre: «hablemos de tu …». */
  closing: string;
  /**
   * Proyecto a medida (tienda, software, IA): no cabe en la semana de una web,
   * así que la página enseña el proceso por pasos y sin días.
   */
  bespoke?: boolean;
  seoTitle: string;
  seoDescription: string;
}

const service = (id: string): Service => SERVICES.find((s) => s.id === id)!;
const faqs = (...indexes: number[]): Faq[] => indexes.map((i) => FAQS[i]);

export const SERVICE_PAGES: readonly ServicePage[] = [
  {
    slug: 'diseno-web',
    service: service('diseno'),
    name: $localize`Diseño web`,
    title: [$localize`Una web que `, $localize`parece tuya, `, $localize`no de plantilla.`],
    lead: $localize`Dirección de arte, textos y una demo navegable antes de programar nada. Ves tu web, con tus fotos y tus palabras, antes de que exista.`,
    stats: [
      { value: $localize`A medida`, title: $localize`Sin plantillas`, body: $localize`Cada pantalla se diseña para tu negocio. No se rellena una plantilla comprada.` },
      { value: '2', title: $localize`Rondas de cambios`, body: $localize`Incluidas en el diseño, que es donde salen casi todos los ajustes.` },
      { value: $localize`Días 2–4`, title: $localize`Demo navegable`, body: $localize`La pruebas en tu móvil antes de que empecemos a programar.` },
    ],
    offersTitle: [$localize`Lo que `, $localize`diseñamos `, $localize`para ti.`],
    offers: [
      { title: $localize`Dirección de arte`, body: $localize`Colores, tipografías e imágenes elegidos para tu negocio y para quien lo visita.` },
      { title: $localize`Demo antes de empezar`, body: $localize`Una versión navegable para que la pruebes y opines antes de escribir código.` },
      { title: $localize`Sistema de componentes`, body: $localize`Piezas coherentes entre sí, para que la web crezca sin perder su estilo.` },
      { title: $localize`Textos incluidos`, body: $localize`Los redactamos nosotros, pensando en lo que tu cliente busca y en cómo lo busca.` },
    ],
    faqs: faqs(4, 6, 0),
    closing: $localize`hablemos de tu web.`,
    seoTitle: $localize`Diseño web a medida en Alicante y toda España — MakeWeb`,
    seoDescription:
      $localize`Diseño de páginas web a medida en Alicante y toda España, sin plantillas: dirección de arte, textos incluidos y una demo navegable antes de programar.`,
  },
  {
    slug: 'desarrollo-web',
    service: service('desarrollo'),
    name: $localize`Desarrollo web`,
    title: [$localize`Rápida de verdad, `, $localize`también en el móvil `, $localize`de tu cliente.`],
    lead: $localize`Programamos tu web a mano, sin gestores que la engorden, y la probamos en móviles de verdad antes de enseñártela.`,
    stats: [
      { value: $localize`A mano`, title: $localize`HTML, CSS y JavaScript`, body: $localize`Sin WordPress ni plantillas: solo el código que tu web necesita.` },
      { value: $localize`AA`, title: $localize`Accesible`, body: $localize`Pensada para que la use cualquiera, también con lector de pantalla.` },
      { value: $localize`Días 5–6`, title: $localize`Programación y pruebas`, body: $localize`En móviles reales, no solo en el portátil de quien la hace.` },
    ],
    offersTitle: [$localize`Lo que `, $localize`construimos `, $localize`por dentro.`],
    offers: [
      { title: $localize`HTML, CSS y JavaScript`, body: $localize`Código escrito para tu web, ligero y fácil de mantener por cualquier estudio.` },
      { title: $localize`Base de datos si hace falta`, body: $localize`PHP y MySQL cuando el negocio necesita guardar datos, con phpMyAdmin para gestionarlos.` },
      { title: $localize`Accesibilidad AA`, body: $localize`Contraste, teclado y lectores de pantalla, comprobados antes de publicar.` },
      { title: $localize`Hosting configurado`, body: $localize`La dejamos publicada y funcionando, con el dominio a tu nombre.` },
    ],
    faqs: faqs(5, 7, 8),
    closing: $localize`hablemos de tu web.`,
    seoTitle: $localize`Desarrollo web en Alicante, rápido y a medida — MakeWeb`,
    seoDescription:
      $localize`Desarrollo web a medida desde Alicante: programada a mano, accesible y probada en móviles reales, con base de datos si hace falta. Código y dominio a tu nombre.`,
  },
  {
    slug: 'seo-local',
    service: service('seo-local'),
    name: $localize`SEO local`,
    title: [$localize`Que te encuentren `, $localize`cuando buscan `, $localize`cerca.`],
    lead: $localize`Ser el mejor no sirve de nada si no te encuentran. Trabajamos tu ficha de Google, los datos de la web y las páginas por zona para que aparezcas cuando alguien busca lo que haces.`,
    stats: [
      { value: $localize`Google`, title: $localize`Ficha de empresa`, body: $localize`Completa y optimizada: horarios, fotos, categorías y enlace a tu web.` },
      { value: $localize`Schema`, title: $localize`Datos estructurados`, body: $localize`Para que Google entienda qué haces, dónde y en qué horario.` },
      { value: $localize`Por zona`, title: $localize`Páginas locales`, body: $localize`Una página por barrio o ciudad donde trabajas, con contenido propio.` },
    ],
    offersTitle: [$localize`Lo que hacemos `, $localize`para que `, $localize`te encuentren.`],
    offers: [
      { title: $localize`Google Business`, body: $localize`Tu ficha de Google, completa y conectada con la web.` },
      { title: $localize`Schema local`, body: $localize`Datos estructurados de negocio local, horario y servicios.` },
      { title: $localize`Páginas por zona`, body: $localize`Contenido para cada zona donde das servicio, sin páginas copiadas.` },
      { title: $localize`Reseñas integradas`, body: $localize`Tus reseñas de Google, visibles en la web donde ayudan a decidir.` },
    ],
    faqs: faqs(8, 3, 0),
    closing: $localize`hablemos de tu negocio.`,
    seoTitle: $localize`SEO local en Alicante: aparece en Google — MakeWeb`,
    seoDescription:
      $localize`Posicionamiento SEO local en Alicante y toda España: ficha de Google optimizada, datos estructurados, páginas por zona y reseñas integradas en la web.`,
  },
  {
    slug: 'reservas-online',
    service: service('conversion'),
    name: $localize`Reservas online`,
    title: [$localize`Convierte visitas `, $localize`en reservas, `, $localize`también de noche.`],
    lead: $localize`Montamos el sistema de reservas, citas y pedidos de tu web, conectado con lo que ya usas, para que cada visita tenga un camino claro hasta convertirse en cliente.`,
    stats: [
      { value: $localize`24 h`, title: $localize`Reserva online`, body: $localize`Tus clientes reservan a la hora que les conviene, no a la tuya.` },
      { value: $localize`Avisos`, title: $localize`Automáticos`, body: $localize`Confirmación y recordatorio al cliente, y aviso para ti en cada cita.` },
      { value: $localize`desde 50 €`, title: $localize`WhatsApp Business`, body: $localize`Conectado a la web, con cuota mensual desde 50 €.` },
    ],
    offersTitle: [$localize`Lo que `, $localize`montamos `, $localize`para ti.`],
    offers: [
      { title: $localize`Reserva online`, body: $localize`Citas y reservas desde la web, sin llamadas ni mensajes de ida y vuelta.` },
      { title: $localize`WhatsApp Business`, body: $localize`Conectado a la web para responder desde un solo sitio.`, monthly: $localize`desde 50 €/mes` },
      { title: $localize`Pedidos y pagos`, body: $localize`Pedidos y cobros desde la web cuando tu negocio los necesita.` },
      { title: $localize`Avisos automáticos`, body: $localize`Confirmaciones y recordatorios sin que tengas que escribirlos tú.` },
    ],
    faqs: faqs(7, 2, 1),
    closing: $localize`hablemos de tus reservas.`,
    seoTitle: $localize`Reservas y citas online para negocios en Alicante — MakeWeb`,
    seoDescription:
      $localize`Reservas, citas y pedidos online integrados en la web de tu negocio en Alicante o en toda España, con avisos automáticos y WhatsApp Business.`,
  },
  {
    slug: 'tiendas-online',
    service: service('tienda'),
    name: $localize`Tiendas online`,
    title: [$localize`Tu tienda, `, $localize`abierta `, $localize`las 24 horas.`],
    lead: $localize`Diseñamos y programamos tu tienda online a medida: catálogo, carrito, pagos seguros y envíos, con un panel sencillo para que gestiones pedidos y existencias sin ayuda.`,
    stats: [
      { value: $localize`24 h`, title: $localize`Abierta siempre`, body: $localize`Tus clientes compran cuando les viene bien, no solo en horario de tienda.` },
      { value: $localize`Móvil`, title: $localize`Comprar desde el teléfono`, body: $localize`Carrito y pago cómodos en pantalla pequeña, probados en móviles reales.` },
      { value: $localize`Panel`, title: $localize`Pedidos y existencias`, body: $localize`Cada pedido, su estado y lo que queda en el almacén, en un solo sitio.` },
    ],
    offersTitle: [$localize`Lo que `, $localize`montamos `, $localize`en tu tienda.`],
    offers: [
      { title: $localize`Catálogo a medida`, body: $localize`Fichas de producto con fotos, variantes de talla o color y buscador, pensadas para que se entienda qué compras.` },
      { title: $localize`Carrito y pagos seguros`, body: $localize`Pago con tarjeta y otros métodos habituales, a través de pasarelas de pago reconocidas.` },
      { title: $localize`Envíos y devoluciones`, body: $localize`Gastos de envío por zona o por peso, seguimiento del pedido y avisos automáticos al cliente.` },
      { title: $localize`Panel de gestión`, body: $localize`Pedidos, clientes y existencias en un panel sencillo, con vídeos cortos que te enseñan a usarlo.` },
    ],
    faqs: [
      {
        q: $localize`¿Cuánto cuesta una tienda online?`,
        a: $localize`Depende del número de productos, de los métodos de pago y de cómo gestionas los envíos. Te enviamos una propuesta con el precio cerrado antes de empezar, y el presupuesto que firmas es el que pagas.`,
      },
      {
        q: $localize`¿Podré añadir productos yo mismo?`,
        a: $localize`Sí. Te dejamos un panel para dar de alta productos, cambiar precios y ver pedidos, y te grabamos vídeos cortos explicando cómo se hace.`,
      },
      ...faqs(5, 2),
    ],
    closing: $localize`hablemos de tu tienda.`,
    bespoke: true,
    seoTitle: $localize`Tiendas online a medida en Alicante y España — MakeWeb`,
    seoDescription:
      $localize`Creamos tiendas online a medida en Alicante y para toda España: catálogo, carrito, pagos seguros, envíos y un panel sencillo para gestionar pedidos y stock.`,
  },
  {
    slug: 'software-a-medida',
    service: service('software'),
    name: $localize`Software a medida`,
    title: [$localize`Software `, $localize`hecho para cómo `, $localize`trabaja tu negocio.`],
    lead: $localize`Aplicaciones web, paneles de gestión e integraciones a medida. Lo que hoy haces a mano o repartido en varias hojas de cálculo, en una sola herramienta pensada para tu equipo.`,
    stats: [
      { value: $localize`A medida`, title: $localize`Solo lo que necesitas`, body: $localize`Las funciones que usa tu equipo, sin pagar por un programa genérico lleno de opciones que sobran.` },
      { value: $localize`Navegador`, title: $localize`En cualquier equipo`, body: $localize`Desde el ordenador, la tableta o el móvil, sin instalar nada.` },
      { value: $localize`Tuyo`, title: $localize`Código entregado`, body: $localize`Te damos el código y los accesos: el programa es tuyo, igual que una web.` },
    ],
    offersTitle: [$localize`Lo que `, $localize`programamos `, $localize`para ti.`],
    offers: [
      { title: $localize`Aplicaciones web`, body: $localize`Herramientas internas para tu equipo: presupuestos, inventario, fichajes o lo que tu día a día necesite.` },
      { title: $localize`Paneles de gestión`, body: $localize`Tus datos en un solo sitio, con los números que importan a la vista.` },
      { title: $localize`Integraciones`, body: $localize`Conectamos las herramientas que ya usas para que los datos pasen de una a otra sin copiar y pegar.` },
      { title: $localize`Automatización de tareas`, body: $localize`Informes, avisos o copias de datos que se hacen solos, sin que nadie tenga que acordarse.` },
    ],
    faqs: [
      {
        q: $localize`¿Cómo sé si necesito software a medida?`,
        a: $localize`Si tu equipo pierde horas copiando datos de un sitio a otro, o si ningún programa del mercado encaja con cómo trabajas, probablemente sí. Nos lo cuentas en una videollamada y te decimos con sinceridad si te sale más a cuenta uno a medida o uno que ya exista.`,
      },
      {
        q: $localize`¿Cuánto tarda y cuánto cuesta?`,
        a: $localize`Depende del alcance. Antes de empezar te damos por escrito qué se va a hacer, el precio cerrado y la fecha de entrega. Si el proyecto es grande, lo dividimos en fases para que empieces a usarlo cuanto antes.`,
      },
      ...faqs(3, 2),
    ],
    closing: $localize`hablemos de tu proyecto.`,
    bespoke: true,
    seoTitle: $localize`Software a medida para empresas en Alicante — MakeWeb`,
    seoDescription:
      $localize`Desarrollo de software a medida en Alicante y toda España: aplicaciones web, paneles de gestión, integraciones y automatizaciones pensadas para tu negocio.`,
  },
  {
    slug: 'inteligencia-artificial',
    service: service('ia'),
    name: $localize`Inteligencia artificial`,
    title: [$localize`Inteligencia artificial `, $localize`que te quita trabajo, `, $localize`no que te lo da.`],
    lead: $localize`Asistentes que responden a tus clientes con la información de tu negocio, automatizaciones que leen y ordenan correos y documentos, y herramientas de IA conectadas con lo que ya usas.`,
    stats: [
      { value: $localize`24 h`, title: $localize`Asistente siempre activo`, body: $localize`Resuelve las dudas frecuentes en tu web a cualquier hora, y te pasa lo que no sabe resolver.` },
      { value: $localize`Tus datos`, title: $localize`Respuestas con tu información`, body: $localize`Contesta con tus horarios, precios y servicios, no con respuestas genéricas.` },
      { value: $localize`A medida`, title: $localize`Donde ya trabajas`, body: $localize`Correo, hojas de cálculo, agenda o la web: la IA se conecta a lo que ya usas.` },
    ],
    offersTitle: [$localize`Lo que `, $localize`hacemos `, $localize`con IA.`],
    offers: [
      { title: $localize`Asistente para tu web`, body: $localize`Un chat que resuelve las dudas de tus clientes con la información de tu negocio y te avisa cuando hace falta una persona.` },
      { title: $localize`Automatización con IA`, body: $localize`Correos clasificados, respuestas sugeridas y tareas que se ponen en marcha solas cuando llega algo nuevo.` },
      { title: $localize`Correos y documentos`, body: $localize`Sacar los datos de facturas, albaranes o formularios y llevarlos a donde los necesitas.` },
      { title: $localize`Formación para tu equipo`, body: $localize`Te enseñamos a sacarle partido a la IA en el día a día, con ejemplos de tu propio negocio.` },
    ],
    faqs: [
      {
        q: $localize`¿Qué pasa con mis datos y los de mis clientes?`,
        a: $localize`Usamos solo los datos que hacen falta para cada tarea y te explicamos por escrito qué servicio los trata y dónde. Si algún dato no debe salir de tu empresa, la solución se diseña para que no salga.`,
      },
      {
        q: $localize`¿Y si la IA se equivoca?`,
        a: $localize`Puede pasar, y por eso la usamos en tareas acotadas, con tu información y con una persona revisando lo importante. Antes de ponerla en marcha la probamos con casos reales de tu negocio.`,
      },
      ...faqs(3, 2),
    ],
    closing: $localize`hablemos de tu idea.`,
    bespoke: true,
    seoTitle: $localize`Inteligencia artificial para empresas en Alicante — MakeWeb`,
    seoDescription:
      $localize`Soluciones de inteligencia artificial para negocios de Alicante y toda España: asistentes para tu web, automatización de correos y documentos, y formación.`,
  },
  {
    slug: 'mantenimiento-web',
    service: service('cuidado'),
    name: $localize`Mantenimiento`,
    title: [$localize`No te dejamos `, $localize`con la web `, $localize`y adiós.`],
    lead: $localize`Actualizaciones, copias de seguridad y un informe mensual en castellano donde se entiende qué ha pasado. Opcional, y se cancela con un mes de aviso.`,
    stats: [
      { value: $localize`Diarias`, title: $localize`Copias de seguridad`, body: $localize`Si algo se rompe, la web vuelve a como estaba el día anterior.` },
      { value: $localize`Mensual`, title: $localize`Informe en castellano`, body: $localize`Visitas, contactos y velocidad, explicados sin jerga.` },
      { value: $localize`1 mes`, title: $localize`De aviso para cancelar`, body: $localize`Sin permanencia: el mantenimiento es opcional.` },
    ],
    offersTitle: [$localize`Lo que `, $localize`cuidamos `, $localize`cada mes.`],
    offers: [
      { title: $localize`Copias diarias`, body: $localize`Copias de seguridad automáticas de toda la web.`, monthly: $localize`desde 50 €/mes` },
      { title: $localize`Cambios mensuales`, body: $localize`Textos, precios, horarios o fotos que quieras cambiar, hechos por nosotros.`, monthly: $localize`desde 30 €/mes` },
      { title: $localize`Informe de resultados`, body: $localize`Qué ha pasado en tu web este mes, en un informe que se entiende.`, monthly: $localize`desde 20 €/mes` },
    ],
    faqs: faqs(5, 7, 2),
    closing: $localize`hablemos de tu web.`,
    seoTitle: $localize`Mantenimiento web en Alicante, sin permanencia — MakeWeb`,
    seoDescription:
      $localize`Mantenimiento web opcional: copias de seguridad diarias, cambios mensuales e informe de resultados en castellano. Se cancela con un mes de aviso.`,
  },
];

export const servicePage = (slug: string): ServicePage | undefined =>
  SERVICE_PAGES.find((p) => p.slug === slug);

/** La página de un servicio de la portada, por su `id`. */
export const pageForService = (serviceId: string): ServicePage | undefined =>
  SERVICE_PAGES.find((p) => p.service.id === serviceId);
