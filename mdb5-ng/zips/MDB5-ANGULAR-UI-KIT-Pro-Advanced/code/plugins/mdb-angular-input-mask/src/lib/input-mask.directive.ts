import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { MdbAbstractFormControl, MdbInputDirective } from 'mdb-angular-ui-kit/forms';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'input[mdbInputMask]',
  exportAs: 'mdbInputMask',
  providers: [
    { provide: MdbAbstractFormControl, useExisting: MdbInputMaskDirective },
    [MdbInputDirective],
  ],
})
// tslint:disable-next-line:component-class-suffix
export class MdbInputMaskDirective
  implements MdbAbstractFormControl<any>, AfterViewInit, OnDestroy
{
  @Input()
  get mdbInputMask(): string {
    return this._mdbInputMask;
  }
  set mdbInputMask(newValue: string) {
    if (this._mdbInputMask !== newValue) {
      this._mdbInputMask = newValue;

      if (this._isLoaded) {
        this._updateAndResetMaskInput(this.mdbInputMask);
      }
    }
  }
  private _mdbInputMask = '';

  @Input() charPlaceholder = '_';
  @Input() maskPlaceholder = false;
  @Input() inputPlaceholder = true;
  @Input() clearIncomplete = true;
  @Input() customMask = '';
  @Input() customValidator = '';

  @Output() readonly inputMaskInput: EventEmitter<any> = new EventEmitter();
  @Output() readonly inputMaskComplete: EventEmitter<any> = new EventEmitter();

  readonly stateChanges: Subject<void> = new Subject<void>();

  get input(): HTMLInputElement {
    return this._elementRef.nativeElement;
  }

  get labelActive(): boolean {
    return true;
  }

  private readonly _destroy$: Subject<void> = new Subject<void>();
  private _isLoaded = false;
  private _customMasks = {};
  private _inputPlaceholder = '';
  private _previousValue = '';
  private _isCompleted = false;
  private _isEmpty = false;
  private _masks = {
    9: {
      validator: /\d/,
      symbol: '9',
    },
    a: {
      validator: /[a-zżźąćśńółę]/i,
      symbol: 'a',
    },
    '*': {
      validator: /[a-zżźąćśńółę0-9]/i,
      symbol: '*',
    },
  };
  private _futureCaretPosition: number;

  constructor(private _host: ElementRef, private _elementRef: ElementRef) {}

  private _getMaskRegex(maskChar: string): RegExp {
    if (!this._masks[maskChar]) {
      return;
    }

    const validator = this._masks[maskChar].validator;

    return this.customMask && this.customMask[maskChar] !== undefined
      ? new RegExp(validator)
      : validator;
  }

  private _calculateCaretJump(text: string): number {
    // if while deleting there is 'hardcoded' char into mask e.g. ('/','-'), function won't allow to delete it (because it will be overwritten by placeholderRest)
    // so we have to 'jump' over those hardcoded chars until we find propr char to be deleted

    const charIndex = text.length - 1;
    let caretJump = 0;

    for (let i = charIndex; i >= 0; i--) {
      const maskRegExp = this._getMaskRegex(this.mdbInputMask.charAt(i));

      if (text.charAt(i) && !maskRegExp) {
        caretJump++;
      } else {
        i = -1;
      }
    }

    // in situation in which we are deleting characters but few first characters are hardcoded from placeholder
    // they won't be deleted and condition for text.length === 0 will be never met
    // to avoid that we check if caretJump > charIndex, meaning we jumped to the 0 index of the value and typed input value is empty
    if (caretJump > charIndex) {
      this._isEmpty = true;
    }

    return caretJump;
  }

  private _handleComplete(value: string): void {
    this._isCompleted = true;

    this.inputMaskComplete.emit(value), { value };
  }

  private _getInputPlaceholderChar(i): string {
    if (this.charPlaceholder.length === 1) {
      return this.charPlaceholder;
    }
    return this.charPlaceholder[i];
  }

  private _calculatePositionAndDirection(value): {
    isFirstWithMask: boolean;
    isFirstWithoutMask: boolean;
    isDeleting: boolean;
  } {
    const inputLength = value.length;
    const previousValueLength = this._previousValue.length;
    const placeholderLength = this._inputPlaceholder.length;
    const addedCharsLength = inputLength - placeholderLength;
    const caretPosition = this._host.nativeElement.selectionEnd;
    const isFirstWithMask = this.maskPlaceholder && addedCharsLength === 1 && caretPosition === 1;
    const isFirstWithoutMask = !this.maskPlaceholder && inputLength === 1;
    const isDeleting = inputLength - previousValueLength < 0;

    return {
      isFirstWithMask,
      isFirstWithoutMask,
      isDeleting,
    };
  }

  private _isValidMaskChar(maskChar): boolean {
    if (this._masks[maskChar] !== undefined) {
      return true;
    }

    return false;
  }

  private _calculatePlaceholderRest(text: string, maskLength: number): string {
    let placeholderRest = '';

    if (this.maskPlaceholder) {
      for (let i = text.length; i < maskLength; i++) {
        if (this._inputPlaceholder[i] === this._getInputPlaceholderChar(i)) {
          placeholderRest += this._getInputPlaceholderChar(i);
        } else {
          placeholderRest += this._inputPlaceholder[i];
        }
      }
    }

    return placeholderRest;
  }

  private _validateInputWithMask(value: string): string {
    this._isCompleted = false;
    this._isEmpty = false;

    if (!this.mdbInputMask) return value;

    let maskStartRegExp = new RegExp(`^([^${Object.keys(this._masks).join('')}]+)`);

    const { isDeleting, isFirstWithMask, isFirstWithoutMask } =
      this._calculatePositionAndDirection(value);

    if (
      !isDeleting &&
      (isFirstWithMask || isFirstWithoutMask) &&
      maskStartRegExp.test(this.mdbInputMask)
    ) {
      value = maskStartRegExp.exec(this.mdbInputMask)[0] + value;
    }

    const maskLength = this.mdbInputMask.length;

    let text = '';

    for (let i = 0, x = 1; x && i < maskLength; ++i) {
      const inputChar = value.charAt(i);
      const maskChar = this.mdbInputMask.charAt(i);

      if (this._isValidMaskChar(maskChar)) {
        const maskRegExp = this._getMaskRegex(maskChar);

        if (maskRegExp.test(inputChar)) {
          text += inputChar;
        } else {
          x = 0;
        }
      } else {
        text += maskChar;

        if (inputChar && inputChar !== maskChar) {
          value = `${value}`;
        }
      }
    }

    this._futureCaretPosition = isDeleting
      ? text.length - this._calculateCaretJump(text)
      : text.length;

    if (text.length === maskLength) {
      this._handleComplete(text);
    }

    if (text.length === 0) {
      this._isEmpty = true;
    }

    this.inputMaskInput.emit(text);

    text += this._calculatePlaceholderRest(text, maskLength);

    return text;
  }

  private _setCaretPosition = (position, event = 'focus') => {
    if (event === 'focus') {
      setTimeout(() => {
        this._host.nativeElement.setSelectionRange(position, position, 'none');
      }, 0);
    } else {
      this._host.nativeElement.setSelectionRange(position, position, 'none');
    }
  };

  private _handleInput(): void {
    let value = this._host.nativeElement.value;

    if (value && value !== this._previousValue && value.length !== this._previousValue.length) {
      value =
        value.length < this._previousValue.length && !this.maskPlaceholder
          ? value
          : this._validateInputWithMask(value);
    }

    this._host.nativeElement.value = value;
    this._previousValue = value;

    this._setCaretPosition(this._futureCaretPosition);
    this.stateChanges.next();
  }

  private _isArray(value): boolean {
    return (Array.isArray && Array.isArray(value)) || value instanceof Array;
  }

  private _getCustomMasks(masks: string, validators: string): {} {
    let customMasks = {};
    let masksArray = masks.split(',');
    let validatorsArray = validators.split(',');

    if (this._isArray(masksArray) && this._isArray(validatorsArray)) {
      masksArray.forEach((mask, i) => {
        customMasks = {
          ...customMasks,
          [mask]: {
            validator: new RegExp(validatorsArray[i]),
            mask,
          },
        };
      });
    } else {
      customMasks = {
        ...customMasks,
        [masks]: {
          validator: validatorsArray,
          mask: masksArray,
        },
      };
    }

    return customMasks;
  }

  private _uncoverPlaceholder(): void {
    const hostElement = this._host.nativeElement;
    hostElement.value = '';
    hostElement.placeholder = this.mdbInputMask;
  }

  private _handleBlur(): void {
    if (
      (this.clearIncomplete && !this._isCompleted) ||
      (this.inputPlaceholder && (this._isEmpty || this._host.nativeElement.value.length === 0))
    ) {
      this._previousValue = '';
      this._uncoverPlaceholder();
      this.stateChanges.next();
    }
  }

  private _setInputPlaceholderFromMask(value): void {
    this._host.nativeElement.value = value;
    this._inputPlaceholder = value;
  }

  private _createInputPlaceholderFromMask(): {} {
    return this.mdbInputMask
      .split('')
      .map((char, i) => {
        return this._isValidMaskChar(char) ? this._getInputPlaceholderChar(i) : char;
      })
      .join('');
  }

  private _handleFocus(): void {
    if (this._previousValue) {
      this._host.nativeElement.value = this._previousValue;

      this._setCaretPosition(this._futureCaretPosition, 'focus');
    } else if (this.maskPlaceholder) {
      const maskPlaceholder = this._createInputPlaceholderFromMask();

      this._setInputPlaceholderFromMask(maskPlaceholder);

      this._setCaretPosition(0, 'focus');
      this.stateChanges.next();
    }
  }

  private _setCustomMasks(): void {
    if (!(this.customMask && this.customValidator)) {
      return;
    }

    const customMasks = this._getCustomMasks(this.customMask, this.customValidator);
    this._customMasks = customMasks;
  }

  private _updateAndResetMaskInput(maskValue: string) {
    const inputEl = this._host.nativeElement;
    this._previousValue = '';
    inputEl.value = '';
    inputEl.placeholder = maskValue;
  }

  ngAfterViewInit() {
    this._setCustomMasks();

    this._masks = {
      ...this._masks,
      ...this._customMasks,
    };
    this._isLoaded = true;
    this._uncoverPlaceholder();

    fromEvent(this._host.nativeElement, 'input')
      .pipe(takeUntil(this._destroy$))
      .subscribe(() => {
        this._handleInput();
      });

    fromEvent(this._host.nativeElement, 'blur')
      .pipe(takeUntil(this._destroy$))
      .subscribe(() => {
        this._handleBlur();
      });

    fromEvent(this._host.nativeElement, 'focus')
      .pipe(takeUntil(this._destroy$))
      .subscribe(() => {
        this._handleFocus();
      });
  }

  ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
