import {
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  OnInit,
  Input,
  HostListener,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
  ContentChild,
  TemplateRef,
  ViewContainerRef,
  AfterContentInit,
} from '@angular/core';
import { MdbTimepickerComponent } from './timepicker.component';
import { MDB_TIMEPICKER_TOGGLE_ICON } from './timepicker-toggle-icon.directive';
import { TemplatePortal } from '@angular/cdk/portal';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';

@Component({
  templateUrl: './timepicker-toggle.component.html',

  selector: 'mdb-timepicker-toggle',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdbTimepickerToggleComponent implements OnInit, AfterContentInit {
  @ViewChild('button', { static: true }) button: ElementRef<HTMLElement>;
  @ContentChild(MDB_TIMEPICKER_TOGGLE_ICON, { read: TemplateRef, static: true })
  _iconRef: TemplateRef<any>;

  @Input() mdbTimepickerToggle: MdbTimepickerComponent;
  @Input() icon = 'far fa-clock';
  @Input()
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
  }
  private _disabled = false;

  @HostListener('click')
  handleClick(): void {
    if (this.disabled) {
      return;
    }

    this.mdbTimepickerToggle.open();
  }

  get iconRef(): TemplatePortal | null {
    return this._iconPortal;
  }
  private _iconPortal: TemplatePortal | null = null;

  constructor(private _cdRef: ChangeDetectorRef, private _vcr: ViewContainerRef) {}

  ngOnInit(): void {
    this.mdbTimepickerToggle.toggle = this;
  }

  ngAfterContentInit(): void {
    if (this._iconRef) {
      this._createIconPortal();
    }
  }

  private _createIconPortal(): void {
    this._iconPortal = new TemplatePortal(this._iconRef, this._vcr);
  }

  markForCheck(): void {
    this._cdRef.markForCheck();
  }

  static ngAcceptInputType_disabled: BooleanInput;
}
