import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { MDB_CHIP_PARENT } from './chip-delete.directive';

export interface MdbChipEditedEvent {
  chip: MdbChipComponent;
  value: string;
}

@Component({
  selector: 'mdb-chip',
  templateUrl: './chip.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: MDB_CHIP_PARENT, useExisting: MdbChipComponent }],
})
export class MdbChipComponent {
  @ViewChild('chipContainer', { static: true }) private _chipContainer: ElementRef;

  @Input() customClass = '';

  @Input()
  get editable(): boolean {
    return this._editable;
  }
  set editable(value: boolean) {
    this._editable = coerceBooleanProperty(value);
  }
  private _editable = false;

  @Output() edited: EventEmitter<MdbChipEditedEvent> = new EventEmitter();
  @Output() deleted: EventEmitter<void> = new EventEmitter();

  @HostListener('dblclick')
  handleDoubleClick() {
    if (this.editable && !this.editing) {
      this.activateEditMode();
    }
  }

  @HostListener('keydown', ['$event'])
  handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' && this.editing) {
      this.cancelEditMode();
    }
  }

  @HostListener('focusout')
  handleBlur() {
    if (this.editing) {
      this.cancelEditMode();
    }
  }

  protected editing = false;

  constructor(private _elementRef: ElementRef) {}

  activateEditMode() {
    this.editing = true;
    setTimeout(() => {
      this._chipContainer.nativeElement.focus();
    }, 0);
  }

  cancelEditMode() {
    const text = this._elementRef.nativeElement.querySelector('.text-chip').textContent;

    this.emitEditedEvent(text);
    this.editing = false;
  }

  emitEditedEvent(value: string) {
    const event = {
      chip: this,
      value: value,
    };

    this.edited.emit(event);
  }

  delete() {
    this.deleted.emit();
  }

  static ngAcceptInputType_editable: BooleanInput;
}
