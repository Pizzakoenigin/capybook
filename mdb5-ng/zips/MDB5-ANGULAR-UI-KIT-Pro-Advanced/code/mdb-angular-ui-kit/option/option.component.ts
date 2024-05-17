import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  Component,
  ElementRef,
  Input,
  HostListener,
  InjectionToken,
  Optional,
  Inject,
  OnInit,
  HostBinding,
  ChangeDetectorRef,
  EventEmitter,
  Output,
  AfterViewChecked,
  OnDestroy,
} from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { MdbOptionGroupComponent } from './option-group.component';

export interface MdbOptionParent {
  optionHeight: number;
  visibleOptions: number;
  multiple: boolean;
}

export interface MdbOptionGroup {
  disabled?: boolean;
}

export const MDB_OPTION_PARENT = new InjectionToken<MdbOptionParent>('MDB_OPTION_PARENT');

export const MDB_OPTION_GROUP = new InjectionToken<MdbOptionGroupComponent>('MDB_OPTION_GROUP');

@Component({
  selector: 'mdb-option',
  templateUrl: 'option.component.html',
})
export class MdbOptionComponent implements OnInit, AfterViewChecked, OnDestroy {
  @Input() value: any;

  hidden = false;

  @Input()
  get label(): string {
    return this._label || this._el.nativeElement.textContent;
  }
  set label(newValue: string) {
    this._label = newValue;
  }
  private _label: string;

  @HostBinding('class.hidden')
  get isHidden(): boolean {
    return this.hidden;
  }

  @HostBinding('class.disabled')
  @Input()
  get disabled(): boolean {
    return this._disabled || (this.group && this.group.disabled);
  }
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
  }
  private _disabled = false;

  @Output() readonly selectionChange = new EventEmitter<MdbOptionComponent>();

  _optionHeight: number;

  private _selected = false;
  private _active = false;
  private _previousLabelValue = '';
  _multiple = false;

  clicked = false;

  readonly _labelChange = new Subject<void>();
  clickSource: Subject<MdbOptionComponent> = new Subject<MdbOptionComponent>();
  click$: Observable<MdbOptionComponent> = this.clickSource.asObservable();

  constructor(
    private _el: ElementRef,
    private _cdRef: ChangeDetectorRef,
    @Optional() @Inject(MDB_OPTION_PARENT) public _parent: MdbOptionParent,
    @Optional() @Inject(MDB_OPTION_GROUP) public group: MdbOptionGroup
  ) {
    this.clicked = false;
  }

  @HostBinding('class.option')
  option = true;

  @HostBinding('class.active')
  get active(): boolean {
    return this._active;
  }

  @HostBinding('class.selected')
  get selected(): boolean {
    return this._selected;
  }

  @HostBinding('style.height.px')
  get optionHeight(): number {
    return this._optionHeight;
  }

  @HostBinding('attr.role')
  get role(): string {
    return 'option';
  }

  @HostBinding('attr.aria-disabled')
  get isDisabled(): boolean {
    return this.disabled ? true : false;
  }

  @HostBinding('attr.aria-selected')
  get isSelected(): boolean {
    return this.selected;
  }

  @HostListener('click')
  onClick(): void {
    this.clickSource.next(this);
  }

  getLabel(): string {
    return this._el.nativeElement.textContent;
  }

  get offsetHeight(): number {
    return this._el.nativeElement.offsetHeight;
  }

  ngOnInit(): void {
    if (this._parent && this._parent.optionHeight) {
      this._optionHeight = this._parent.optionHeight;
    }

    if (this._parent && this._parent.multiple) {
      this._multiple = true;
    }
  }

  ngAfterViewChecked(): void {
    // We need to let parent component know about dynamic label changes, so it can trigger
    // change detection and update value displayed in input. We only need to do that for
    // selected options, because other options will be hidden inside the dropdown, and their
    // labels will be updated automatically when dropdown is opened.
    if (this._selected) {
      const label = this.getLabel();

      if (label !== this._previousLabelValue) {
        this._previousLabelValue = label;
        this._labelChange.next();
      }
    }
  }

  ngOnDestroy(): void {
    this._labelChange.complete();
  }

  select(): void {
    if (!this._selected) {
      this._selected = this._multiple ? !this._selected : true;
      this.selectionChange.emit(this);
      this._cdRef.markForCheck();
    }
  }

  deselect(): void {
    if (this._selected) {
      this._selected = false;
      this.selectionChange.emit(this);
      this._cdRef.markForCheck();
    }
  }

  setActiveStyles(): void {
    if (!this._active) {
      this._active = true;
      this._cdRef.markForCheck();
    }
  }

  setInactiveStyles(): void {
    if (this._active) {
      this._active = false;
      this._cdRef.markForCheck();
    }
  }

  static ngAcceptInputType_disabled: BooleanInput;
}
