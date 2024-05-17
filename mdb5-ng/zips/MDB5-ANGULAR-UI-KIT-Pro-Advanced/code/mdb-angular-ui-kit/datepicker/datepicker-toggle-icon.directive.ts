import { Directive, InjectionToken, TemplateRef } from '@angular/core';

export const MDB_DATEPICKER_TOGGLE_ICON = new InjectionToken<MdbDatepickerToggleIconDirective>(
  'MdbDatepickerToggleIconDirective'
);

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[mdbDatepickerToggleIcon]',
  providers: [
    { provide: MDB_DATEPICKER_TOGGLE_ICON, useExisting: MdbDatepickerToggleIconDirective },
  ],
})
export class MdbDatepickerToggleIconDirective {
  constructor(public template: TemplateRef<any>) {}
}
