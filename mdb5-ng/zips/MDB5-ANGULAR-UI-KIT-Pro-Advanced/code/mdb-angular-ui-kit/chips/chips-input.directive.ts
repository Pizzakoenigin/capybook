import {
  ChangeDetectorRef,
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Output,
} from '@angular/core';
import { MdbAbstractFormControl } from 'mdb-angular-ui-kit/forms';
import { Subject } from 'rxjs';

export interface MdbChipAddEvent {
  value: string;
  input: MdbChipsInputDirective;
}

@Directive({
  selector: '[mdbChipsInput]',
  providers: [{ provide: MdbAbstractFormControl, useExisting: MdbChipsInputDirective }],
})
export class MdbChipsInputDirective implements MdbAbstractFormControl<any> {
  @Output() chipAdd: EventEmitter<MdbChipAddEvent> = new EventEmitter();

  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {
    if (this._isConfirmKey(event)) {
      this._emitChipAddEvent();
    }

    if (this._isDeleteKey(event) && !this.input.value) {
      this.deleteChip.next();
    }
  }

  @HostListener('blur')
  onFocusOut(): void {
    if (this.input.value) {
      this._emitChipAddEvent();
    }
  }

  get input(): HTMLInputElement {
    return this._elementRef.nativeElement;
  }

  get hasValue(): boolean {
    return !!this.input.value;
  }

  get labelActive(): boolean {
    return this.hasValue || this._hasItems;
  }

  readonly stateChanges: Subject<void> = new Subject<void>();

  readonly deleteChip: Subject<void> = new Subject<void>();

  private _confirmKeys = ['Enter'];

  private _removeKeys = ['Backspace', 'Delete'];

  _hasItems = false;

  constructor(private _elementRef: ElementRef, public _cdRef: ChangeDetectorRef) {}

  private _isConfirmKey(event: KeyboardEvent) {
    return this._confirmKeys.includes(event.key);
  }

  private _isDeleteKey(event: KeyboardEvent) {
    return this._removeKeys.includes(event.key);
  }

  private _emitChipAddEvent() {
    const event: MdbChipAddEvent = {
      value: this.input.value,
      input: this,
    };

    this.chipAdd.emit(event);
  }

  clear() {
    this.input.value = '';
  }

  _updateLabelState(value: boolean) {
    this._hasItems = value;
    this.stateChanges.next();
  }
}
