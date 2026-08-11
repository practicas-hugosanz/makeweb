import { createActionGroup, emptyProps, props } from '@ngrx/store';

/** Desde dónde se abrió el selector de líneas de WhatsApp. */
export type WhatsappAnchor = 'fab' | 'footer';

export const UiActions = createActionGroup({
  source: 'UI',
  events: {
    'Boot Completed': emptyProps(),
    'Menu Toggled': emptyProps(),
    'Menu Closed': emptyProps(),
    'Section Entered': props<{ id: string }>(),
    // El selector de WhatsApp se abre desde dos sitios, y el estado guarda desde
    // cuál: cada uno lo ancla junto a sí mismo, y así solo puede haber uno
    // abierto sin que aparezca donde nadie ha pulsado.
    'Whatsapp Toggled': props<{ anchor: WhatsappAnchor }>(),
    'Whatsapp Closed': emptyProps(),
  },
});
