import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { fromEvent, merge, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  AnyToHEX,
  getAlphaFromHex,
  getChangedGroupFromEvent,
  getChangedGroupFromString,
  HEXToCMYK,
  HEXToHSLA,
  HEXToHSVA,
  HEXToRGBA,
  HSLAToHEX,
  HSLToRGB,
} from './color-picker.utils';

interface RGBA {
  rgbR: number;
  rgbG: number;
  rgbB: number;
  alpha: number;
}
interface Hex {
  hex: string;
}
interface HSLA {
  hslH: number;
  hslS: number;
  hslL: number;
  alpha: number;
}
interface HSVA {
  hsvH: number;
  hsvS: number;
  hsvV: number;
  alpha: number;
}
interface CMYK {
  cmykC: number;
  cmykM: number;
  cmykY: number;
  cmykK: number;
}
interface Sliders {
  sliderHue: number;
  sliderAlpha: number;
}
export type mergedColors = Partial<RGBA | Hex | HSLA | HSVA | CMYK | Sliders>;

interface colorsRGBGroup {
  rgbR: FormControl<number>;
  rgbG: FormControl<number>;
  rgbB: FormControl<number>;
  alpha: FormControl<number>;
}

interface colorsHSLGroup {
  hslH: FormControl<number>;
  hslS: FormControl<number>;
  hslL: FormControl<number>;
  alpha: FormControl<number>;
}
interface colorsHSVGroup {
  hsvH: FormControl<number>;
  hsvS: FormControl<number>;
  hsvV: FormControl<number>;
  alpha: FormControl<number>;
}
interface colorsCMYKGroup {
  cmykC: FormControl<number>;
  cmykM: FormControl<number>;
  cmykY: FormControl<number>;
  cmykK: FormControl<number>;
}

interface colorHEXGroup {
  hex: FormControl<string>;
}

interface colorSlidersGroup {
  sliderAlpha: FormControl<number>;
  sliderHue: FormControl<number>;
}
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'mdb-color-picker',
  templateUrl: './color-picker.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdbColorPickerComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas') canvas: ElementRef;
  @ViewChild('dot') dot: ElementRef;

  constructor(private _ngZone: NgZone, private _cdRef: ChangeDetectorRef) {}

  @Input() set color(value: string) {
    this._color = AnyToHEX(value);
    this._patchValues(value);

    if (this.colorPalette) {
      this._setCanvasColor();
    }

    const colorGroupChanged: string = getChangedGroupFromString(value);

    if (
      colorGroupChanged !== 'dot' &&
      colorGroupChanged !== 'slider' &&
      this.canvas &&
      this.colorPalette
    ) {
      this._setDotPosition();
    }

    this._setHueInRgb();
    this._cdRef.markForCheck();
  }
  get color(): string {
    return this._color;
  }

  hueSliderInRGB = 'rgb(255, 0, 0)';

  @Input() colorSwatches: string[] = [];
  @Input() colorSwatchesHeight: null | number = null;
  @Input() defaultColor = '';
  @Input() disabled = false;
  @Input() colorPalette = true;
  @Input() colorInputs = true;
  @Input() changeFormatBtn = true;
  @Input() copyIcon = true;
  @Input() disabledHue = false;
  @Input() disabledAlpha = false;

  @Output() readonly colorChange: EventEmitter<string> = new EventEmitter();

  private _destroy$: Subject<void> = new Subject<void>();
  private _color: string = '#FF0000FF';

  dotPickerCoordinates: { currentX: number; currentY: number; initialX: number; initialY: number } =
    { currentX: 0, currentY: 0, initialX: 0, initialY: 0 };

  colorsRGBGroup = new FormGroup<colorsRGBGroup>({
    rgbR: new FormControl(HEXToRGBA(this.color, 'r'), { nonNullable: true }),
    rgbG: new FormControl(HEXToRGBA(this.color, 'g'), { nonNullable: true }),
    rgbB: new FormControl(HEXToRGBA(this.color, 'b'), { nonNullable: true }),
    alpha: new FormControl(1, { nonNullable: true }),
  });

  colorsHSLGroup = new FormGroup<colorsHSLGroup>({
    hslH: new FormControl(HEXToHSLA(this.color, 'h'), { nonNullable: true }),
    hslS: new FormControl(HEXToHSLA(this.color, 's'), { nonNullable: true }),
    hslL: new FormControl(HEXToHSLA(this.color, 'l'), { nonNullable: true }),
    alpha: new FormControl(1, { nonNullable: true }),
  });

  colorsHSVGroup = new FormGroup<colorsHSVGroup>({
    hsvH: new FormControl(HEXToHSVA(this.color, 'h'), { nonNullable: true }),
    hsvS: new FormControl(HEXToHSVA(this.color, 's'), { nonNullable: true }),
    hsvV: new FormControl(HEXToHSVA(this.color, 'v'), { nonNullable: true }),
    alpha: new FormControl(1, { nonNullable: true }),
  });

  colorsCMYKGroup = new FormGroup<colorsCMYKGroup>({
    cmykC: new FormControl(HEXToCMYK(this.color, 'c'), { nonNullable: true }),
    cmykM: new FormControl(HEXToCMYK(this.color, 'm'), { nonNullable: true }),
    cmykY: new FormControl(HEXToCMYK(this.color, 'y'), { nonNullable: true }),
    cmykK: new FormControl(HEXToCMYK(this.color, 'k'), { nonNullable: true }),
  });

  colorHEXGroup = new FormGroup<colorHEXGroup>({
    hex: new FormControl<string>(this.color, { nonNullable: true, updateOn: 'blur' }),
  });

  colorSlidersGroup = new FormGroup<colorSlidersGroup>({
    sliderHue: new FormControl(HEXToHSLA(this.color, 'h'), { nonNullable: true }),
    sliderAlpha: new FormControl(HEXToRGBA(this.color, 'a'), { nonNullable: true }),
  });

  private readonly _formats: string[] = ['hex', 'rgba', 'cmyk', 'hsla', 'hsva'];
  readonly CANVAS_WIDTH = 350;
  readonly CANVAS_HEIGHT = 350;
  readonly DOT_WIDTH = 16;
  readonly DOT_HEIGHT = 16;

  actualFormat = this._formats[0];

  private _setDotPosition(): void {
    const x = HEXToHSVA(this.color, 's') * this.CANVAS_WIDTH;
    const y = (1 - HEXToHSVA(this.color, 'v')) * this.CANVAS_HEIGHT;

    this.dot.nativeElement.style.top = `${y - this.DOT_HEIGHT / 2}px`;
    this.dot.nativeElement.style.left = `${x - this.DOT_WIDTH / 2}px`;
  }

  private _patchValues(value?: string): void {
    const valueToPatch = value ? value : this.color;
    const colorGroupChanged = getChangedGroupFromString(valueToPatch);

    if (colorGroupChanged !== 'dot' && colorGroupChanged !== 'slider') {
      this.colorSlidersGroup.patchValue(
        {
          sliderHue: HEXToHSVA(this.color, 'h'),
        },
        { onlySelf: true, emitEvent: false }
      );
    }

    this.colorSlidersGroup.patchValue(
      {
        sliderAlpha: getAlphaFromHex(this.color),
      },
      { onlySelf: true, emitEvent: false }
    );

    if (colorGroupChanged !== '#') {
      this.colorHEXGroup.patchValue(
        {
          hex: this.color,
        },
        { onlySelf: true, emitEvent: false }
      );
    }

    if (colorGroupChanged !== 'rgb') {
      this.colorsRGBGroup.patchValue(
        {
          rgbR: HEXToRGBA(this.color, 'r'),
          rgbG: HEXToRGBA(this.color, 'g'),
          rgbB: HEXToRGBA(this.color, 'b'),
          alpha: getAlphaFromHex(this.color),
        },
        { onlySelf: true, emitEvent: false }
      );
    }

    if (colorGroupChanged !== 'hsl') {
      this.colorsHSLGroup.patchValue(
        {
          hslH: this.colorSlidersGroup.controls.sliderHue.value,
          hslS: HEXToHSLA(this.color, 's'),
          hslL: HEXToHSLA(this.color, 'l'),
          alpha: getAlphaFromHex(this.color),
        },
        { onlySelf: true, emitEvent: false }
      );
    }
    if (colorGroupChanged !== 'hsv') {
      this.colorsHSVGroup.patchValue(
        {
          hsvH: this.colorSlidersGroup.controls.sliderHue.value,
          hsvS: HEXToHSVA(this.color, 's'),
          hsvV: HEXToHSVA(this.color, 'v'),
          alpha: getAlphaFromHex(this.color),
        },
        { onlySelf: true, emitEvent: false }
      );
    }

    if (colorGroupChanged !== 'cmyk') {
      this.colorsCMYKGroup.patchValue(
        {
          cmykC: HEXToCMYK(this.color, 'c'),
          cmykM: HEXToCMYK(this.color, 'm'),
          cmykY: HEXToCMYK(this.color, 'y'),
          cmykK: HEXToCMYK(this.color, 'k'),
        },
        { onlySelf: true, emitEvent: false }
      );
    }
  }

  private _setHueInRgb(): void {
    this.hueSliderInRGB = HSLToRGB(this.colorSlidersGroup.controls.sliderHue.value, 1, 0.5);
  }

  setNextFormat(): void {
    const actualFormatIndex = this._formats.indexOf(this.actualFormat);
    if (actualFormatIndex == this._formats.length - 1) {
      this.actualFormat = this._formats[0];
      return;
    }

    this.actualFormat = this._formats[actualFormatIndex + 1];
  }

  setPrevFormat(): void {
    const actualFormatIndex = this._formats.indexOf(this.actualFormat);
    if (actualFormatIndex == 0) {
      this.actualFormat = this._formats[this._formats.length - 1];
      return;
    }

    this.actualFormat = this._formats[actualFormatIndex - 1];
  }

  copyColor(): void {
    const colorGroups = {
      hex: this.colorHEXGroup,
      rgba: this.colorsRGBGroup,
      cmyk: this.colorsCMYKGroup,
      hsla: this.colorsHSLGroup,
      hsva: this.colorsHSVGroup,
    };

    const colorKeys = Object.keys(colorGroups[this.actualFormat].controls);
    const colorsArray = colorKeys.map((key) => {
      return colorGroups[this.actualFormat].controls[key].value;
    });

    if (this.actualFormat === 'hex') {
      navigator.clipboard.writeText(colorsArray[0]);
      return;
    }

    const colors = `${this.actualFormat}(${colorsArray.join(',')})`;
    navigator.clipboard.writeText(colors);
  }

  private _setCanvasColor(): void {
    const ctx = this.canvas.nativeElement.getContext('2d');
    const width = this.canvas.nativeElement.width;
    const height = this.canvas.nativeElement.height;
    const grdBlack = ctx.createLinearGradient(0, 0, 0, height);
    const grdWhite = ctx.createLinearGradient(0, 0, width, 0);
    const canvasStyle = HSLAToHEX(this.colorSlidersGroup.controls.sliderHue.value, 1, 0.5, 1);

    grdWhite.addColorStop(0, `rgba(255,255,255,1)`);
    grdWhite.addColorStop(1, 'rgba(255,255,255,0)');
    grdBlack.addColorStop(0, 'rgba(0,0,0,0)');
    grdBlack.addColorStop(1, `rgba(0,0,0,1)`);

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = canvasStyle;
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = grdWhite;
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = grdBlack;
    ctx.fillRect(0, 0, width, height);
  }

  private _setColorFromDot(): void {
    const canvas = this.canvas.nativeElement;
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(
      parseInt(this.dot.nativeElement.style.left) + this.DOT_WIDTH / 2,
      parseInt(this.dot.nativeElement.style.top) + this.DOT_HEIGHT / 2,
      1,
      1
    ).data;

    const r = imageData[0];
    const g = imageData[1];
    const b = imageData[2];

    this.color = `dot(${r}, ${g}, ${b}, ${this.colorsHSLGroup.controls['alpha'].value})`;
    this._emitColorChange();
  }

  private _initDrag(): void {
    this._ngZone.runOutsideAngular(() => {
      const pointerStart$ = merge(
        fromEvent<MouseEvent>(this.canvas.nativeElement, 'mousedown'),
        fromEvent<TouchEvent>(this.canvas.nativeElement, 'touchstart')
      );

      const pointerEnd$ = merge(
        fromEvent<MouseEvent>(document.body, 'mouseup'),
        fromEvent<TouchEvent>(document.body, 'touchend')
      );

      const pointerDrag$ = merge(
        fromEvent<MouseEvent>(document.body, 'mousemove'),
        fromEvent<TouchEvent>(document.body, 'touchmove')
      );

      pointerStart$.pipe(takeUntil(this._destroy$)).subscribe((event: MouseEvent | TouchEvent) => {
        event.preventDefault();

        pointerDrag$.pipe(takeUntil(pointerEnd$)).subscribe((event: MouseEvent | TouchEvent) => {
          this._ngZone.run(() => {
            event.preventDefault();
            let clientX = 0;
            let clientY = 0;

            if (typeof TouchEvent !== 'undefined' && event instanceof TouchEvent) {
              clientX =
                event.touches[0].clientX -
                this.canvas.nativeElement.getBoundingClientRect().left -
                this.DOT_WIDTH / 2;
              clientY =
                event.touches[0].clientY -
                this.canvas.nativeElement.getBoundingClientRect().top -
                this.DOT_WIDTH / 2;
            } else if (event instanceof MouseEvent) {
              clientX =
                event.clientX -
                this.canvas.nativeElement.getBoundingClientRect().left -
                this.DOT_WIDTH / 2;
              clientY =
                event.clientY -
                this.canvas.nativeElement.getBoundingClientRect().top -
                this.DOT_HEIGHT / 2;
            }

            if (clientX > this.CANVAS_WIDTH - this.DOT_WIDTH / 2) {
              /** clientX should stop one pixel before the boundary so it doesn't fall out of range **/
              clientX = this.CANVAS_WIDTH - this.DOT_WIDTH / 2 - 1;
            }

            if (clientY > this.CANVAS_HEIGHT - this.DOT_HEIGHT / 2) {
              clientY = this.CANVAS_HEIGHT - this.DOT_HEIGHT / 2;
            }

            if (clientX < -(this.DOT_WIDTH / 2)) {
              clientX = -(this.DOT_WIDTH / 2);
            }

            if (clientY < -(this.DOT_HEIGHT / 2)) {
              clientY = -(this.DOT_HEIGHT / 2);
            }
            if (!this.disabled) {
              this.dotPickerCoordinates.currentY = clientY;
              this.dotPickerCoordinates.currentX = clientX;

              this._setColorFromDot();
            }
          });
        });
      });
    });
  }

  private _handleValueChange(event: mergedColors): void {
    const changedGroup = getChangedGroupFromEvent(event);

    if (changedGroup == '') {
      return;
    }

    if (changedGroup == 'hex') {
      this.color = event['hex'];
      this._emitColorChange();
      return;
    }

    const valuesArray = Array.isArray(event) ? event : Object.keys(event).map((key) => event[key]);

    if (changedGroup == 'slider') {
      this.color = `${changedGroup}(${valuesArray[0]}, ${this.colorsHSVGroup.controls['hsvS'].value}, ${this.colorsHSVGroup.controls['hsvV'].value}, ${valuesArray[1]})`;
      this._emitColorChange();
      return;
    }

    let alpha = null;

    if (changedGroup == 'rgb' || 'hsl' || 'hsv') {
      alpha = valuesArray[3];
    }

    this.color = `${changedGroup}(${valuesArray[0]}, ${valuesArray[1]}, ${valuesArray[2]}, ${
      alpha === null ? getAlphaFromHex(this.color) : alpha
    })`;

    this._emitColorChange();
  }

  private _emitColorChange() {
    const colorGroups = {
      hex: this.colorHEXGroup,
      rgba: this.colorsRGBGroup,
      cmyk: this.colorsCMYKGroup,
      hsla: this.colorsHSLGroup,
      hsva: this.colorsHSVGroup,
    };

    const colorKeys = Object.keys(colorGroups[this.actualFormat].controls);
    const colorsArray = colorKeys.map((key) => {
      return colorGroups[this.actualFormat].controls[key].value;
    });

    const valueToEmit =
      this.actualFormat === 'hex'
        ? colorsArray[0]
        : `${this.actualFormat}(${colorsArray.join(',')})`;

    this.colorChange.emit(valueToEmit);
  }

  ngOnInit() {
    if (this.disabled) {
      this.colorHEXGroup.disable();
      this.colorsRGBGroup.disable();
      this.colorsHSLGroup.disable();
      this.colorsHSVGroup.disable();
      this.colorsCMYKGroup.disable();
      this.colorSlidersGroup.disable();
      return;
    }

    if (this.disabledHue) {
      this.colorSlidersGroup.controls.sliderHue.disable();
    }

    if (this.disabledAlpha) {
      this.colorSlidersGroup.controls.sliderAlpha.disable();
    }
  }
  ngAfterViewInit() {
    merge(
      this.colorHEXGroup.valueChanges,
      this.colorsRGBGroup.valueChanges,
      this.colorsHSLGroup.valueChanges,
      this.colorsHSVGroup.valueChanges,
      this.colorsCMYKGroup.valueChanges,
      this.colorSlidersGroup.valueChanges
    )
      .pipe(takeUntil(this._destroy$))
      .subscribe((event: mergedColors) => {
        this._handleValueChange(event);
      });

    if (this.defaultColor) {
      setTimeout(() => {
        this.color = this.defaultColor;
        this.colorsRGBGroup.patchValue(
          {
            rgbR: HEXToRGBA(this.color, 'r'),
            rgbG: HEXToRGBA(this.color, 'g'),
            rgbB: HEXToRGBA(this.color, 'b'),
            alpha: getAlphaFromHex(this.color),
          },
          { onlySelf: true, emitEvent: false }
        );
      }, 0);
    }

    if (this.colorPalette) {
      this._setCanvasColor();
      this._initDrag();
      this._setDotPosition();
    }
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
