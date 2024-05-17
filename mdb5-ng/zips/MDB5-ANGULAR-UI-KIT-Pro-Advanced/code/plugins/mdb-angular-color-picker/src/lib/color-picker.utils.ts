import { mergedColors } from './color-picker.component';

/** Checks if string is referencing any of available formats **/
export function getChangedGroupFromString(value: string): string {
  const changedGroup = ['hex', 'rgb', 'hsl', 'hsv', 'cmyk', 'slider', 'dot'].find((colorGroup) =>
    value.startsWith(colorGroup)
  );

  return changedGroup ? changedGroup : '';
}

/** Checks if event is referencing any of available formats **/
export function getChangedGroupFromEvent(event: mergedColors): string {
  const firstObjectKey = Object.keys(event)[0];
  const changedGroup = ['hex', 'rgb', 'hsl', 'hsv', 'cmyk', 'slider'].find((colorGroup) =>
    firstObjectKey.startsWith(colorGroup)
  );

  return changedGroup ? changedGroup : '';
}

/** Returns the alpha value calculated from hex **/
export function getAlphaFromHex(hex): number {
  let value = hex.substring(1, hex.length).split('');

  if (value.length >= 6) {
    return value[6] + value[7] ? Number((parseInt(value[6] + value[7], 16) / 255).toFixed(2)) : 1;
  }

  return Number((parseInt(value[3] + value[3], 16) / 255).toFixed(2));
}

/** Takes a string representing the hex value and returns the R, G, B, or A numeric value **/
export function HEXToRGBA(value: string, returnType: 'r' | 'g' | 'b' | 'a'): number {
  let hex = value.substring(1, value.length);
  hex.split('');

  let r = hex[0] + hex[0];
  let g = hex[1] + hex[1];
  let b = hex[2] + hex[2];
  let a = hex[3] + hex[3];

  if (hex.length >= 6) {
    r = hex[0] + hex[1];
    g = hex[2] + hex[3];
    b = hex[4] + hex[5];
    a = hex[6] + hex[7] ? hex[6] + hex[7] : 'FF';
  }

  const intR = parseInt(r, 16);

  if (returnType == 'r' && intR) {
    return intR;
  }

  const intG = parseInt(g, 16);

  if (returnType == 'g' && intG) {
    return intG;
  }

  const intB = parseInt(b, 16);

  if (returnType == 'b' && intB) {
    return intB;
  }
  const intA = parseInt(a, 16) / 255;

  if (returnType == 'a' && intA) {
    return Number(intA.toFixed(2));
  }

  return 0;
}

/** Takes a string representing the hex value and returns the H, S, V, or A numeric value **/
export function HEXToHSVA(value: string, returnType: 'h' | 's' | 'v' | 'a'): number {
  let hex = value.substring(1, value.length).split('');

  // It's easier to convert to rgb first
  let rgbr = hex[0] + hex[0];
  let rgbg = hex[1] + hex[1];
  let rgbb = hex[2] + hex[2];
  let rgba = hex[3] + hex[3];

  if (hex.length >= 6) {
    rgbr = hex[0] + hex[1];
    rgbg = hex[2] + hex[3];
    rgbb = hex[4] + hex[5];
    rgba = hex[6] + hex[7] ? hex[6] + hex[7] : 'FF';
  }

  const intR = parseInt(rgbr, 16);
  const intG = parseInt(rgbg, 16);
  const intB = parseInt(rgbb, 16);

  const r = intR / 255;
  const g = intG / 255;
  const b = intB / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h = 0;

  if (max !== min) {
    if (max === r) {
      h = 60 * ((g - b) / delta);
    } else if (max === g) {
      h = 60 * (2 + (b - r) / delta);
    } else if (max === b) {
      h = 60 * (4 + (r - g) / delta);
    }
  }

  if (h < 0) {
    h += 360;
  }

  let s = max === 0 ? 0 : delta / max;
  let v = max;

  h = Number(h.toFixed());

  if (returnType == 'h' && h) {
    return h;
  }

  s = Number(s.toFixed(2));

  if (returnType == 's' && s) {
    return s;
  }

  v = Number(v.toFixed(2));

  if (returnType == 'v' && v) {
    return v;
  }

  const intA = parseInt(rgba, 16) / 255;

  if (returnType == 'a' && intA) {
    return Number(intA.toFixed(2));
  }

  return 0;
}

/** Get values from rgb, hsl, hsv, cmyk, dot, or slider format in an array of numbers **/
export function getValuesArray(color: string): number[] {
  let format = ['rgb', 'hsl', 'hsv', 'cmyk', 'slider', 'dot'].find((format) =>
    color.startsWith(format)
  );

  if (!format) {
    return [];
  }

  const valuesArray = color
    .slice(color.indexOf('(') + 1, color.indexOf(')'))
    .split(',')
    .map((value) => {
      return isNaN(Number(value)) ? 0 : Number(value);
    });
  valuesArray.length < 4 ? (valuesArray[3] = 1) : '';

  return valuesArray;
}

/** Takes a string representing color in any available format and returns the HEX string value **/
export function AnyToHEX(color: string): string {
  // format should represent a string in a template: 'format(valueOne, valueTwo, valueThree, valueFour)'
  // e.g.: rgba(244, 43, 32, 0.1) so that we can properly translate it to hex later on

  let format = ['#', 'rgb', 'hsl', 'hsv', 'cmyk', 'slider', 'dot'].find((format) =>
    color.startsWith(format)
  );

  if (!format) {
    return '';
  }

  if (format === '#') {
    if (color.length == 4) {
      return `${color.toUpperCase()}FF`;
    }
    return color.toUpperCase();
  }

  const valuesArray = color
    .slice(color.indexOf('(') + 1, color.indexOf(')'))
    .split(',')
    .map((value) => {
      return isNaN(Number(value)) ? 0 : Number(value);
    });

  switch (format) {
    case 'dot':
      return RGBAToHEX(valuesArray[0], valuesArray[1], valuesArray[2], valuesArray[3]);

    case 'rgb':
      return RGBAToHEX(
        valuesArray[0],
        valuesArray[1],
        valuesArray[2],
        valuesArray[3]
      ).toUpperCase();

    case 'hsl':
      return HSLAToHEX(
        valuesArray[0],
        valuesArray[1],
        valuesArray[2],
        valuesArray[3]
      ).toUpperCase();

    case 'hsv':
      return HSVAToHEX(
        valuesArray[0],
        valuesArray[1],
        valuesArray[2],
        valuesArray[3]
      ).toUpperCase();

    case 'slider':
      return HSVAToHEX(
        valuesArray[0],
        valuesArray[1],
        valuesArray[2],
        valuesArray[3]
      ).toUpperCase();

    case 'cmyk':
      return CMYKToHEX(
        valuesArray[0],
        valuesArray[1],
        valuesArray[2],
        valuesArray[3]
      ).toUpperCase();
  }

  return '';
}

/** Simply converts HSL value to RGB value **/
export function HSLToRGB(h: number, s: number, l: number): string {
  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const rgb = [255 * f(0), 255 * f(8), 255 * f(4)];
  return `rgb(${Math.floor(rgb[0])}, ${Math.floor(rgb[1])}, ${Math.floor(rgb[2])})`;
}

/** Returns H, S, L or A numeric value in HLSA format calculated from passed HEX string value **/
export function HEXToHSLA(value: string, returnType: 'h' | 's' | 'l' | 'a'): number {
  let hex = value.substring(1, value.length).split('');

  // It's easier to convert to rgb first
  let rgbr = hex[0] + hex[0];
  let rgbg = hex[1] + hex[1];
  let rgbb = hex[2] + hex[2];
  let rgba = hex[3] + hex[3];

  if (hex.length >= 6) {
    rgbr = hex[0] + hex[1];
    rgbg = hex[2] + hex[3];
    rgbb = hex[4] + hex[5];
    rgba = hex[6] + hex[7] ? hex[6] + hex[7] : 'FF';
  }

  const intR = parseInt(rgbr, 16);
  const intG = parseInt(rgbg, 16);
  const intB = parseInt(rgbb, 16);
  const intA = parseInt(rgba, 16) / 255;

  const r = intR / 255;
  const g = intG / 255;
  const b = intB / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h = 0;

  if (max !== min) {
    if (max === r) {
      h = 60 * ((g - b) / delta);
    } else if (max === g) {
      h = 60 * (2 + (b - r) / delta);
    } else if (max === b) {
      h = 60 * (4 + (r - g) / delta);
    }
  }

  if (h < 0) {
    h += 360;
  }

  let s = max === 0 ? 0 : delta / max;
  let v = max;

  h = Number(h.toFixed());

  if (returnType == 'h' && h) {
    return h;
  }

  s = Number(s.toFixed(2));

  let l = v - (v * s) / 2;

  let sprime = l === 1 || l === 0 ? 0 : (v - l) / Math.min(l, 1 - l);

  l = Number(l.toFixed(2));

  if (returnType == 'l' && l) {
    return l;
  }
  sprime = Number(sprime.toFixed(2));

  if (returnType == 's' && s) {
    return sprime;
  }

  if (returnType == 'a' && intA) {
    return Number(intA.toFixed(2));
  }

  return 0;
}

/** Simply converts passed R, G, B and A values and returns the HEX value **/
export function RGBAToHEX(rgbaR: number, rgbaG: number, rgbaB: number, rgbaA: number): string {
  const toHex = (v) => {
    const h = Math.round(v).toString(16);
    return ('00'.substr(0, 2 - h.length) + h).toUpperCase();
  };

  const r = toHex(rgbaR);
  const g = toHex(rgbaG);
  const b = toHex(rgbaB);
  const a = toHex(Math.round(rgbaA * 255));
  return `#${r}${g}${b}${a}`;
}

/** Simply converts passed H, S, A and A values and returns the HEX value **/
export function HSLAToHEX(hslH: number, hslS: number, hslL: number, hslA: number): string {
  const toHex = (v) => {
    const h = Math.round(v).toString(16);
    return ('00'.substr(0, 2 - h.length) + h).toUpperCase();
  };

  const alpha = toHex(Math.round(hslA * 255));

  const a = hslS * Math.min(hslL, 1 - hslL);
  const f = (n) => {
    const k = (n + hslH / 30) % 12;
    const color = hslL - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}${alpha}`;
}

/** Converts passed H, S, V and A values and returns HEX value **/
export function HSVAToHEX(hsvH: number, hsvS: number, hsvV: number, hsvA: number): string {
  const f = (n) => {
    const k = (n + hsvH / 60) % 6;
    return hsvV - hsvV * hsvS * Math.max(Math.min(k, 4 - k, 1), 0);
  };

  const r = Math.round(f(5) * 255);
  const g = Math.round(f(3) * 255);
  const b = Math.round(f(1) * 255);

  return RGBAToHEX(r, g, b, hsvA);
}

/** Simply returns CMYK value converted to HEX **/
export function HEXToCMYK(value, returnType: 'c' | 'm' | 'y' | 'k'): number {
  const r = HEXToRGBA(value, 'r');
  const g = HEXToRGBA(value, 'g');
  const b = HEXToRGBA(value, 'b');

  let c = 1 - r / 255;
  let m = 1 - g / 255;
  let y = 1 - b / 255;
  let k = Math.min(c, Math.min(m, y));

  c = (c - k) / (1 - k);
  m = (m - k) / (1 - k);
  y = (y - k) / (1 - k);

  c = Math.floor(Math.round(c * 10000) / 100);
  m = Math.floor(Math.round(m * 10000) / 100);
  y = Math.floor(Math.round(y * 10000) / 100);
  k = Math.floor(Math.round(k * 10000) / 100);

  c = isNaN(c) ? 0 : c;
  m = isNaN(m) ? 0 : m;
  y = isNaN(y) ? 0 : y;
  k = isNaN(k) ? 0 : k;

  if (returnType == 'c' && c) {
    return c;
  }
  if (returnType == 'm' && m) {
    return m;
  }
  if (returnType == 'y' && y) {
    return y;
  }
  if (returnType == 'k' && k) {
    return k;
  }

  return 0;
}

/** Simply converts CMYK value converted to HEX **/
export function CMYKToHEX(cmykC: number, cmykM: number, cmykY: number, cmykK: number): string {
  const c = cmykC / 100;
  const m = cmykM / 100;
  const y = cmykY / 100;
  const k = cmykK / 100;

  const r = 1 - Math.min(1, c * (1 - k) + k);
  const g = 1 - Math.min(1, m * (1 - k) + k);
  const b = 1 - Math.min(1, y * (1 - k) + k);

  const intR = Math.round(r * 255);
  const intG = Math.round(g * 255);
  const intB = Math.round(b * 255);

  return RGBAToHEX(intR, intG, intB, 1);
}
