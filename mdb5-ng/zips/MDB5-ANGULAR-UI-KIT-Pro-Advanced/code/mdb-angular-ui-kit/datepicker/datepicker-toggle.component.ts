import {
  ViewEncapsulation,
  ChangeDetectionStrategy,
  Component,
  Input,
  HostListener,
  OnInit,
  ElementRef,
  ViewChild,
  ContentChild,
  TemplateRef,
  ViewContainerRef,
  AfterContentInit,
} from '@angular/core';
import { MdbDatepickerComponent } from './datepicker.component';
import { MDB_DATEPICKER_TOGGLE_ICON } from './datepicker-toggle-icon.directive';
import { TemplatePortal } from '@angular/cdk/portal';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';

@Component({
  selector: 'mdb-datepicker-toggle',
  templateUrl: './datepicker-toggle.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdbDatepickerToggleComponent implements OnInit, AfterContentInit {
  @ViewChild('button', { static: true }) button: ElementRef<HTMLElement>;
  @ContentChild(MDB_DATEPICKER_TOGGLE_ICON, { read: TemplateRef, static: true })
  _iconRef: TemplateRef<any>;

  @Input()
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
  }
  private _disabled = false;

  @Input() icon = 'far fa-calendar';
  @Input() mdbDatepicker: MdbDatepickerComponent;

  get iconRef(): TemplatePortal | null {
    return this._iconPortal;
  }
  private _iconPortal: TemplatePortal | null = null;

  constructor(private _vcr: ViewContainerRef) {}

  @HostListener('click')
  onClick(): void {
    if (this.disabled) {
      return;
    }

    this.toggle();
  }

  ngOnInit(): void {
    this.mdbDatepicker._toggle = this;
  }

  ngAfterContentInit(): void {
    if (this._iconRef) {
      this._createIconPortal();
    }
  }

  open(): void {
    this.mdbDatepicker.open();
  }

  close(): void {
    this.mdbDatepicker.close();
  }

  toggle(): void {
    this.mdbDatepicker.toggle();
  }

  private _createIconPortal(): void {
    this._iconPortal = new TemplatePortal(this._iconRef, this._vcr);
  }

  static ngAcceptInputType_disabled: BooleanInput;
}
