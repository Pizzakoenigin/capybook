import { Directive, InjectionToken, TemplateRef } from '@angular/core';

export const MDB_DATEPICKER_HEADER = new InjectionToken<MdbDatepickerHeaderDirective>(
  'MdbDatepickerHeaderDirective'
);

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[mdbDatepickerHeader]',
  providers: [{ provide: MDB_DATEPICKER_HEADER, useExisting: MdbDatepickerHeaderDirective }],
})
export class MdbDatepickerHeaderDirective {
  constructor(public template: TemplateRef<any>) {}
}
