import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const UiActions = createActionGroup({
  source: 'UI',
  events: {
    'Boot Completed': emptyProps(),
    'Menu Toggled': emptyProps(),
    'Menu Closed': emptyProps(),
    'Section Entered': props<{ id: string }>(),
    // El selector de WhatsApp se abre desde dos sitios —el botón flotante y el
    // pie—, así que quién está abierto no puede vivir dentro de un componente.
    'Whatsapp Toggled': emptyProps(),
    'Whatsapp Closed': emptyProps(),
  },
});
