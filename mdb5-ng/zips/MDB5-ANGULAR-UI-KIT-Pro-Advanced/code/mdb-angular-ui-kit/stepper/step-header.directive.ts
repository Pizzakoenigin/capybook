import { Directive, InjectionToken, TemplateRef } from '@angular/core';

export const MDB_STEP_HEADER = new InjectionToken<MdbStepHeaderDirective>('MdbStepHeaderDirective');

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[mdbStepHeader]',
  providers: [{ provide: MDB_STEP_HEADER, useExisting: MdbStepHeaderDirective }],
})
export class MdbStepHeaderDirective {
  constructor(public template: TemplateRef<any>) {}
}
