import { Directive, InjectionToken, TemplateRef } from '@angular/core';

export const MDB_TIMEPICKER_TOGGLE_ICON = new InjectionToken<MdbTimepickerToggleIconDirective>(
  'MdbTimepickerToggleIconDirective'
);

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[mdbTimepickerToggleIcon]',
  providers: [
    { provide: MDB_TIMEPICKER_TOGGLE_ICON, useExisting: MdbTimepickerToggleIconDirective },
  ],
})
export class MdbTimepickerToggleIconDirective {
  constructor(public template: TemplateRef<any>) {}
}
