import { Directive, HostBinding, HostListener, Inject, InjectionToken } from '@angular/core';

export interface MdbChipParent {
  editing: boolean;
  delete(): void;
}

export const MDB_CHIP_PARENT = new InjectionToken<MdbChipParent>('MDB_CHIP_PARENT');

@Directive({
  selector: '[mdbChipDelete]',
})
export class MdbChipDeleteDirective {
  constructor(@Inject(MDB_CHIP_PARENT) protected _chipParent: MdbChipParent) {}

  @HostListener('click')
  handleClick() {
    this._chipParent.delete();
  }

  @HostBinding('class.d-none')
  get display() {
    return this._chipParent.editing;
  }
}
