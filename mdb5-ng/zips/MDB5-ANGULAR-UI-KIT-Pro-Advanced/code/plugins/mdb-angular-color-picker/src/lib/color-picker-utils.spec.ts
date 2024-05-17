import { TestBed } from '@angular/core/testing';
import { MdbColorPickerModule } from './color-picker.module';
import {
  AnyToHEX,
  getValuesArray,
  HSLAToHEX,
  HSLToRGB,
  HSVAToHEX,
  RGBAToHEX,
} from './color-picker.utils';

describe('MDB Color Picker Utils', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [MdbColorPickerModule],
      teardown: { destroyAfterEach: false },
    });
  });

  describe('Utils', () => {
    it('should translate any format to hex with AnyToHEX', () => {
      const rgba = 'rgba(255,170,187,1)';
      const hsva = 'hsva(348,0.33,1,1)';
      const hsla = 'hsla(348,1,0.83,1)';
      const cmyk = 'cmyk(0,33,26,0)';

      expect(AnyToHEX(rgba)).toEqual('#FFAABBFF');
      expect(AnyToHEX(hsva)).toEqual('#FFABBCFF');
      expect(AnyToHEX(hsla)).toEqual('#FFA8BAFF');
      expect(AnyToHEX(cmyk)).toEqual('#FFABBDFF');
    });

    it('should translate RGBA to HEX', () => {
      const rgba = 'rgba(255,170,187,1)';
      const rgbaArray = getValuesArray(rgba);
      expect(RGBAToHEX(rgbaArray[0], rgbaArray[1], rgbaArray[2], rgbaArray[3]).toUpperCase()).toBe(
        '#FFAABBFF'
      );
    });

    it('should translate HSLA to HEX', () => {
      const hsla = 'hsla(348,1,0.83,1)';
      const hslaArray = getValuesArray(hsla);
      expect(HSLAToHEX(hslaArray[0], hslaArray[1], hslaArray[2], hslaArray[3]).toUpperCase()).toBe(
        '#FFA8BAFF'
      );
    });

    it('should translate HSL to RGB', () => {
      const hsl = 'hsla(13,1,0.11)';
      const hslArray = getValuesArray(hsl);
      expect(HSLToRGB(hslArray[0], hslArray[1], hslArray[2])).toBe('rgb(56, 12, 0)');
    });

    it('should translate HSVA to HEX', () => {
      const hsv = 'hsva(348,0.33,1,1)';
      const hsvArray = getValuesArray(hsv);
      expect(HSVAToHEX(hsvArray[0], hsvArray[1], hsvArray[2], hsvArray[3])).toBe('#FFABBCFF');
    });
  });
});
