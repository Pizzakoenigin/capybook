import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  OnDestroy,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MdbMultiRangeThumbDirective } from './multi-range-thumb.directive';
import { fadeInAnimation } from './multi-range-thumb.animations';
import {
  BooleanInput,
  coerceBooleanProperty,
  coerceNumberProperty,
  NumberInput,
} from '@angular/cdk/coercion';
import { merge, Subject, fromEvent } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export type mdbMultiRangeValues = number[];
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'mdb-multi-range',
  templateUrl: `./multi-range.component.html`,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MdbMultiRangeComponent),
      multi: true,
    },
  ],
  styles: [],
  animations: [fadeInAnimation()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdbMultiRangeComponent implements ControlValueAccessor, AfterViewInit, OnDestroy {
  @ViewChildren('rangeThumb') rangeThumbs: QueryList<MdbMultiRangeThumbDirective>;

  @Input()
  get numberOfRanges(): number {
    return this._numberOfRanges;
  }
  set numberOfRanges(value: NumberInput) {
    this._numberOfRanges = coerceNumberProperty(value);
  }
  private _numberOfRanges = 2;

  @Input()
  get step(): number {
    return this._step;
  }
  set step(value: NumberInput) {
    this._step = coerceNumberProperty(value);
  }
  private _step = 0;

  @Input()
  get min(): number {
    return this._min;
  }
  set min(value: NumberInput) {
    this._min = coerceNumberProperty(value);
  }
  private _min = 0;

  @Input()
  get max(): number {
    return this._max;
  }
  set max(value: NumberInput) {
    this._max = coerceNumberProperty(value);
  }
  private _max = 100;

  @Input()
  get tooltip(): boolean {
    return this._tooltip;
  }
  set tooltip(value: BooleanInput) {
    this._tooltip = coerceBooleanProperty(value);
  }
  private _tooltip = false;

  @Input() startValues: number[] = [0, 100];

  @Output() readonly startDrag = new EventEmitter<void>();
  @Output() readonly endDrag = new EventEmitter<void>();
  @Output() readonly changeValue = new EventEmitter<void>();
  private readonly _destroy$: Subject<void> = new Subject<void>();

  host = this._host;

  constructor(private _host: ElementRef, private _cdRef: ChangeDetectorRef) {}

  _onChange: any = (_: any) => {};
  _onTouched: any = () => {};
  val: number[] = [this.startValues[0], this.startValues[1]];
  showTooltip = false;
  readonly THUMB_WIDTH = 16;

  set value(val: mdbMultiRangeValues) {
    this.val = val;
    this._cdRef.markForCheck();
  }

  private _getCurrentValues(): number[] {
    const currentValues: number[] = [];
    const numberOfAvailableValues = this.max - this.min > 0 ? this.max - this.min : 1;

    this.rangeThumbs.forEach((thumb, index) => {
      const styleLeft = Number(thumb.host.style.left.split('px')[0]);

      let currentValue =
        Math.round(
          styleLeft /
            ((this._host.nativeElement.offsetWidth - this.THUMB_WIDTH) / numberOfAvailableValues)
        ) + this._min;

      if (currentValue < this._min) {
        currentValue = this._min;
      }

      if (currentValue > this._max) {
        currentValue = this._max;
      }

      currentValues[index] = currentValue;
    });

    return currentValues;
  }

  writeValue(value: mdbMultiRangeValues) {
    this.value = value;
  }

  registerOnChange(fn: any) {
    this._onChange = fn;
  }

  registerOnTouched(fn: any) {
    this._onTouched = fn;
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this._onChange(this._getCurrentValues());
      this.rangeThumbs.forEach((thumb) => {
        fromEvent(thumb.host, 'blur')
          .pipe(takeUntil(this._destroy$))
          .subscribe(() => {
            this._onTouched();
          });
      });
    }, 0);

    merge(...this.rangeThumbs.map((thumb) => thumb.changeValue))
      .pipe(takeUntil(this._destroy$))
      .subscribe(() => {
        this._onChange(this._getCurrentValues());
        this.value = this._getCurrentValues();
        this.changeValue.emit();
        this.endDrag.emit();
      });

    merge(...this.rangeThumbs.map((thumb) => thumb.startDrag))
      .pipe(takeUntil(this._destroy$))
      .subscribe(() => {
        this._onChange(this._getCurrentValues());
        this.value = this._getCurrentValues();
        this.startDrag.emit();
      });

    merge(...this.rangeThumbs.map((thumb) => thumb.pointerMove))
      .pipe(takeUntil(this._destroy$))
      .subscribe(() => {
        if (JSON.stringify(this._getCurrentValues()) === JSON.stringify(this.val)) {
          return;
        }
        this._onChange(this._getCurrentValues());
        this.value = this._getCurrentValues();
      });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
