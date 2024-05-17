import {
  Directive,
  Input,
  forwardRef,
  ElementRef,
  EventEmitter,
  HostListener,
  AfterViewInit,
} from '@angular/core';
import { MdbTimepickerComponent } from './timepicker.component';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

export const MDB_TIMEPICKER_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => MdbTimepickerDirective),
  multi: true,
};

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[mdbTimepicker]',
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: { '(blur)': 'onTouched()' },
  providers: [MDB_TIMEPICKER_VALUE_ACCESSOR],
})
export class MdbTimepickerDirective implements ControlValueAccessor, AfterViewInit {
  onChange: (value: any) => void = () => {};
  onTouched = () => {};

  @Input()
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
  }
  private _disabled = false;

  @Input() mdbTimepicker: MdbTimepickerComponent;
  @Input()
  set value(value: string) {
    this._value = value;
    this._valueChange.emit(this._value);

    if (value) {
      this.el.nativeElement.value = value;
    } else {
      this.el.nativeElement.value = null;
    }
  }

  get value(): string {
    return this._value;
  }
  private _value: string;
  _valueChange = new EventEmitter<string>();

  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event'])
  handleInput(event: any): void {
    this.onChange(event.target.value);
    this._valueChange.emit(event.target.value);
  }

  ngAfterViewInit(): void {
    this.mdbTimepicker.setInput(this);

    this._valueChange.emit(this._value);

    this.mdbTimepicker._selectionChange$.subscribe((selectedValue) => {
      this.value = selectedValue;
      this.onChange(selectedValue);
    });
  }

  // Control value accessor methods
  writeValue(value: any): void {
    this.value = value;
    this.mdbTimepicker._selectionChange$.next(this._value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.mdbTimepicker.disabled = this.disabled;
  }
}
