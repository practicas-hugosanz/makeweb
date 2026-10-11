/**
 * La página de diseño web en Alicante.
 *
 * Es la página que compite por «diseño web Alicante» y sus variantes, así que
 * tiene contenido propio y no es la portada con otro nombre: dónde está el
 * estudio, cómo se busca un negocio local, en qué zonas se trabaja y las
 * preguntas de quien busca un estudio cerca.
 *
 * Misma regla que `content.ts`: nada que no se pueda demostrar. Ni clientes de
 * la zona, ni años, ni posiciones en Google prometidas. Los plazos y precios
 * son los que ya están publicados, y lo de verse en persona es lo que ya dice
 * la pregunta del trabajo en remoto.
 */
import { Faq } from './content';

export interface LocalStat {
  value: string;
  title: string;
  body: string;
}

export const LOCAL_STATS: readonly LocalStat[] = [
  {
    value: 'Mutxamel',
    title: $localize`Estamos aquí`,
    body: $localize`A un paso de Alicante. Si tu negocio está en la provincia, la primera reunión puede ser en persona.`,
  },
  {
    value: $localize`7 días`,
    title: $localize`Hasta publicarla`,
    body: $localize`De la primera llamada a la web en marcha, con el avance a la vista cada día.`,
  },
  {
    value: $localize`desde 350 €`,
    title: $localize`Precio cerrado`,
    body: $localize`Más IVA, y por escrito antes de empezar: el presupuesto que firmas es el que pagas.`,
  },
];

/**
 * Las zonas donde se trabaja: es el área de servicio, no una lista de clientes.
 * Nombres propios, sin traducir.
 */
export const LOCAL_AREAS: readonly string[] = [
  'Alicante',
  'San Vicente del Raspeig',
  "Sant Joan d'Alacant",
  'Mutxamel',
  'El Campello',
  'San Juan Playa',
  'Elche',
  'Santa Pola',
  'Benidorm',
  'Villajoyosa',
];

export const LOCAL_FAQS: readonly Faq[] = [
  {
    q: $localize`¿Hacéis páginas web solo para negocios de Alicante?`,
    a: $localize`No. Estamos en Mutxamel, junto a Alicante, y hacemos webs para negocios de toda la provincia y del resto de España. El proceso es el mismo para todos: una semana, un presupuesto cerrado y el avance a la vista cada día.`,
  },
  {
    q: $localize`¿Podemos vernos en persona?`,
    a: $localize`Si tu negocio está en la provincia de Alicante, sí: la primera reunión puede ser en persona. El resto del trabajo va por videollamada y con un documento compartido donde ves cómo avanza tu web.`,
  },
  {
    q: $localize`¿Cuánto cuesta una página web en Alicante?`,
    a: $localize`Con nosotros, lo mismo que en cualquier otro sitio: desde 350 € una web estática, desde 450 € con animaciones y desde 1.000 € con citas o encargos. El precio se cierra por escrito antes de empezar.`,
  },
  {
    q: $localize`¿Me ayudáis a salir en Google Maps?`,
    a: $localize`Sí. Con el SEO local dejamos tu ficha de empresa de Google completa y enlazada con la web, y añadimos los datos que Google usa para entender qué haces y dónde. Subir en el mapa depende también de tus reseñas y del tiempo, así que no prometemos posiciones: te explicamos qué hacemos y qué depende de ti.`,
  },
];
