import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MdbColorPickerComponent } from './color-picker.component';
import { MdbColorPickerModule } from './color-picker.module';
import { AnyToHEX } from './color-picker.utils';

const template = `
<mdb-color-picker [colorSwatches]="colorSwatches" [colorSwatchesHeight]="colorSwatchesHeight" [defaultColor]="defaultColor" [disabled]="disabled"></mdb-color-picker>
`;

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'mdb-color-picker-test',
  template,
})
class TestColorPickerComponent {
  colorSwatches = [];
  colorSwatchesHeight = null;
  defaultColor = '';
  disabled = false;
}

describe('MDB Color Picker', () => {
  let fixture: ComponentFixture<TestColorPickerComponent>;
  let element: any;
  let component: any;
  let colorPicker: MdbColorPickerComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestColorPickerComponent],
      imports: [MdbColorPickerModule],
      teardown: { destroyAfterEach: false },
    });
    fixture = TestBed.createComponent(TestColorPickerComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    colorPicker = component.instance;
  });

  describe('Color palette preview dot and interactives', () => {
    it('should change palette preview dot color when hex form control is changed', () => {
      const hexInput = element.querySelector('#colorHex');
      const dotPalette = element.querySelector('.color-picker-color-dot');
      expect(dotPalette.style.backgroundColor).toBe('rgba(255, 0, 0, 1)');
      expect(hexInput.value).toBe('#FF0000FF');

      hexInput.value = '#FFAABBFF';
      hexInput.dispatchEvent(new Event('input'));
      hexInput.dispatchEvent(new Event('blur'));

      fixture.detectChanges();
      expect(dotPalette.style.backgroundColor).toBe('rgba(255, 170, 187, 1)');
    });

    it('should change formats to next properly and render inputs', () => {
      const nextFormatBtn = element.querySelector('#next-format');

      nextFormatBtn.click();
      fixture.detectChanges();

      const rgbRInput = element.querySelector('#rgbr');
      const rgbGInput = element.querySelector('#rgbg');
      const rgbBInput = element.querySelector('#rgbb');
      const rgbAInput = element.querySelector('#rgba');

      expect(rgbRInput).toBeTruthy();
      expect(rgbGInput).toBeTruthy();
      expect(rgbBInput).toBeTruthy();
      expect(rgbAInput).toBeTruthy();

      nextFormatBtn.click();
      fixture.detectChanges();

      const cmykcInput = element.querySelector('#cmykc');
      const cmykmInput = element.querySelector('#cmykm');
      const cmykyInput = element.querySelector('#cmyky');
      const cmykkInput = element.querySelector('#cmykk');

      expect(cmykcInput).toBeTruthy();
      expect(cmykmInput).toBeTruthy();
      expect(cmykyInput).toBeTruthy();
      expect(cmykkInput).toBeTruthy();

      nextFormatBtn.click();
      fixture.detectChanges();

      const hslhInput = element.querySelector('#hslh');
      const hslsInput = element.querySelector('#hsls');
      const hsllInput = element.querySelector('#hsll');
      const hslaInput = element.querySelector('#hsla');

      expect(hslhInput).toBeTruthy();
      expect(hslsInput).toBeTruthy();
      expect(hsllInput).toBeTruthy();
      expect(hslaInput).toBeTruthy();

      nextFormatBtn.click();
      fixture.detectChanges();

      const hsvhInput = element.querySelector('#hsvh');
      const hsvsGInput = element.querySelector('#hsvs');
      const hsvvBInput = element.querySelector('#hsvv');
      const hsvaInput = element.querySelector('#hsva');

      expect(hsvhInput).toBeTruthy();
      expect(hsvsGInput).toBeTruthy();
      expect(hsvvBInput).toBeTruthy();
      expect(hsvaInput).toBeTruthy();

      nextFormatBtn.click();
      fixture.detectChanges();

      const hexInput = element.querySelector('#colorHex');
      expect(hexInput).toBeTruthy();
    });

    it('should copy each format properly', () => {
      Object.assign(navigator, {
        clipboard: {
          writeText: () => {},
        },
      });

      jest.spyOn(navigator.clipboard, 'writeText');

      const nextFormatBtn = element.querySelector('#next-format');
      const copyCodeBtn = element.querySelector('#copy-code');

      copyCodeBtn.click();
      fixture.detectChanges();

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('#FF0000FF');

      nextFormatBtn.click();
      fixture.detectChanges();

      copyCodeBtn.click();
      fixture.detectChanges();

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('rgba(255,0,0,1)');

      nextFormatBtn.click();
      fixture.detectChanges();

      copyCodeBtn.click();
      fixture.detectChanges();

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('cmyk(0,100,100,0)');

      nextFormatBtn.click();
      fixture.detectChanges();

      copyCodeBtn.click();
      fixture.detectChanges();

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('hsla(0,1,0.5,1)');

      nextFormatBtn.click();
      fixture.detectChanges();

      copyCodeBtn.click();
      fixture.detectChanges();

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('hsva(0,1,1,1)');
    });
  });

  describe('Form controls', () => {
    it('should change form controls when rgb form control is changed', () => {
      const nextFormatBtn = element.querySelector('#next-format');
      const prevFormatBtn = element.querySelector('#previous-format');
      const dotPalette = element.querySelector('.color-picker-color-dot');
      nextFormatBtn.click();
      fixture.detectChanges();

      const rgbRInput = element.querySelector('#rgbr');
      const rgbGInput = element.querySelector('#rgbg');
      const rgbBInput = element.querySelector('#rgbb');
      const rgbAInput = element.querySelector('#rgba');

      expect(rgbRInput.value).toBe('255');
      expect(rgbGInput.value).toBe('0');
      expect(rgbBInput.value).toBe('0');
      expect(rgbAInput.value).toBe('1');
      expect(dotPalette.style.backgroundColor).toBe('rgba(255, 0, 0, 1)');

      rgbRInput.value = 69;
      rgbRInput.dispatchEvent(new Event('input'));
      rgbGInput.value = 50;
      rgbGInput.dispatchEvent(new Event('input'));
      rgbBInput.value = 199;
      rgbBInput.dispatchEvent(new Event('input'));
      rgbAInput.value = 1;
      rgbAInput.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      prevFormatBtn.click();

      fixture.detectChanges();

      const hexInput = element.querySelector('#colorHex');
      expect(hexInput.value).toBe('#4532C7FF');

      prevFormatBtn.click();

      fixture.detectChanges();

      const hsvhInput = element.querySelector('#hsvh');
      const hsvsGInput = element.querySelector('#hsvs');
      const hsvvBInput = element.querySelector('#hsvv');
      const hsvaInput = element.querySelector('#hsva');

      expect(hsvhInput.value).toBe('248');
      expect(hsvsGInput.value).toBe('0.75');
      expect(hsvvBInput.value).toBe('0.78');
      expect(hsvaInput.value).toBe('1');

      prevFormatBtn.click();

      fixture.detectChanges();

      const hslhInput = element.querySelector('#hslh');
      const hslsInput = element.querySelector('#hsls');
      const hsllInput = element.querySelector('#hsll');
      const hslaInput = element.querySelector('#hsla');

      expect(hslhInput.value).toBe('248');
      expect(hslsInput.value).toBe('0.6');
      expect(hsllInput.value).toBe('0.49');
      expect(hslaInput.value).toBe('1');

      prevFormatBtn.click();

      fixture.detectChanges();

      const cmykcInput = element.querySelector('#cmykc');
      const cmykmInput = element.querySelector('#cmykm');
      const cmykyInput = element.querySelector('#cmyky');
      const cmykkInput = element.querySelector('#cmykk');

      expect(cmykcInput.value).toBe('65');
      expect(cmykmInput.value).toBe('74');
      expect(cmykyInput.value).toBe('0');
      expect(cmykkInput.value).toBe('21');
    });

    it('should change form controls when hsla form control is changed', () => {
      const nextFormatBtn = element.querySelector('#next-format');
      const prevFormatBtn = element.querySelector('#previous-format');
      const dotPalette = element.querySelector('.color-picker-color-dot');
      nextFormatBtn.click();
      fixture.detectChanges();

      const rgbRInput = element.querySelector('#rgbr');
      const rgbGInput = element.querySelector('#rgbg');
      const rgbBInput = element.querySelector('#rgbb');
      const rgbAInput = element.querySelector('#rgba');

      expect(rgbRInput.value).toBe('255');
      expect(rgbGInput.value).toBe('0');
      expect(rgbBInput.value).toBe('0');
      expect(rgbAInput.value).toBe('1');
      expect(dotPalette.style.backgroundColor).toBe('rgba(255, 0, 0, 1)');

      rgbRInput.value = 69;
      rgbRInput.dispatchEvent(new Event('input'));
      rgbGInput.value = 50;
      rgbGInput.dispatchEvent(new Event('input'));
      rgbBInput.value = 199;
      rgbBInput.dispatchEvent(new Event('input'));
      rgbAInput.value = 1;
      rgbAInput.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      prevFormatBtn.click();

      fixture.detectChanges();

      const hexInput = element.querySelector('#colorHex');
      expect(hexInput.value).toBe('#4532C7FF');

      prevFormatBtn.click();

      fixture.detectChanges();

      const hsvhInput = element.querySelector('#hsvh');
      const hsvsGInput = element.querySelector('#hsvs');
      const hsvvBInput = element.querySelector('#hsvv');
      const hsvaInput = element.querySelector('#hsva');

      expect(hsvhInput.value).toBe('248');
      expect(hsvsGInput.value).toBe('0.75');
      expect(hsvvBInput.value).toBe('0.78');
      expect(hsvaInput.value).toBe('1');

      prevFormatBtn.click();

      fixture.detectChanges();

      const hslhInput = element.querySelector('#hslh');
      const hslsInput = element.querySelector('#hsls');
      const hsllInput = element.querySelector('#hsll');
      const hslaInput = element.querySelector('#hsla');

      expect(hslhInput.value).toBe('248');
      expect(hslsInput.value).toBe('0.6');
      expect(hsllInput.value).toBe('0.49');
      expect(hslaInput.value).toBe('1');

      prevFormatBtn.click();

      fixture.detectChanges();

      const cmykcInput = element.querySelector('#cmykc');
      const cmykmInput = element.querySelector('#cmykm');
      const cmykyInput = element.querySelector('#cmyky');
      const cmykkInput = element.querySelector('#cmykk');

      expect(cmykcInput.value).toBe('65');
      expect(cmykmInput.value).toBe('74');
      expect(cmykyInput.value).toBe('0');
      expect(cmykkInput.value).toBe('21');
    });

    it('should move sliders and update form controls', () => {
      const dispatchDrag = (clientX, thumb) => {
        const event = new MouseEvent('mousemove', {
          view: window,
          bubbles: true,
          cancelable: true,
          clientX: clientX,
          clientY: 0,
        });
        thumb.dispatchEvent(event);
      };

      const sliderThumbEl = document.querySelector('#hueRange');
      dispatchDrag(170, sliderThumbEl);
      fixture.detectChanges();

      const hexInput = element.querySelector('#colorHex');
      expect(hexInput.value).toBe('#FF0000FF');
    });
  });

  describe('Inputs', () => {
    it('should render swatches', () => {
      component.colorSwatches = [];
      fixture.detectChanges();

      expect(element.querySelector('.color-picker-swatches')).toBeFalsy();

      component.colorSwatches = ['#0d6efd'];
      fixture.detectChanges();

      expect(element.querySelector('.color-picker-swatches')).toBeTruthy();
    });

    it('should set color from swatch', () => {
      component.colorSwatches = ['#0d6efd'];
      fixture.detectChanges();
      const swatch = element.querySelector('.color-picker-swatches-color');

      const hexInput = element.querySelector('#colorHex');
      expect(hexInput.value).toBe('#FF0000FF');

      swatch.click();
      fixture.detectChanges();
      expect(hexInput.value).toBe('#0D6EFD');
    });

    it('should have unset height if not specified in an input', () => {
      component.colorSwatches = ['#0d6efd'];
      component.colorSwatchesHeight = null;
      fixture.detectChanges();
      const swatch = element.querySelector('.color-picker-swatches');
      expect(swatch.style.maxHeight).toBe('unset');
    });

    it('should set certain height for swatches container if specified in an input', () => {
      component.colorSwatches = ['#0d6efd'];
      component.colorSwatchesHeight = 200;
      fixture.detectChanges();
      const swatch = element.querySelector('.color-picker-swatches');
      expect(swatch.style.maxHeight).toBe('200px');
    });

    it('should disable format changing in disabled mode', () => {
      component.disabled = true;
      fixture.detectChanges();

      const nextBtn = element.querySelector('#next-format');

      nextBtn.click();
      fixture.detectChanges();

      const hexInput = element.querySelector('#colorHex');

      expect(hexInput).toBeTruthy();
    });

    // TO DO: defaultColor should set the initial color, but NOT change the color after short amount of time after the element has been rendered
    // it('should initialize with default color if specified', () => {
    //   component.defaultColor = '#FFAABBFF';
    //   fixture.detectChanges();

    //   expect(element.querySelector('#colorHex').value).toBe('#FFAABBFF');

    //   const nextFormatBtn = element.querySelector('#next-format');
    //   nextFormatBtn.click();

    //   fixture.detectChanges();

    //   const rgbRInput = element.querySelector('#rgbr');
    //   const rgbGInput = element.querySelector('#rgbg');
    //   const rgbBInput = element.querySelector('#rgbb');
    //   const rgbAInput = element.querySelector('#rgba');

    //   expect(rgbRInput.value).toBe('15');
    //   expect(rgbGInput.value).toBe('219');
    //   expect(rgbBInput.value).toBe('104');
    //   expect(rgbAInput.value).toBe('1');
    // })
  });
});
