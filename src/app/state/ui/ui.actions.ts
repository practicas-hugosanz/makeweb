import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const UiActions = createActionGroup({
  source: 'UI',
  events: {
    'Boot Completed': emptyProps(),
    'Menu Toggled': emptyProps(),
    'Menu Closed': emptyProps(),
    'Section Entered': props<{ id: string }>(),
  },
});
