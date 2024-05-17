import { COLOR_GENERATOR, COLOR_MAP } from './data-parser-defaults';
import { MdbDataParserColorGenerator, MdbDataParserColorMap } from './data-parser-types';

export function getCSVDataArray(data: string, delimiter: string = ','): any[][] {
  return data.split('\n').map((row) => row.split(delimiter).map((value) => normalize(value)));
}

export function getSelectedEntries(array: any[], a: number | number[], b: number): any[] {
  if (typeof a === 'number') {
    return array.slice(a, b);
  }

  return array.filter((_, i) => a.indexOf(i) !== -1);
}

export function normalize(value: any): string | number | boolean {
  // Booleans
  if (value === 'true' || value === true) {
    return true;
  }
  if (value === 'false' || value === false) {
    return false;
  }

  // eslint-disable-next-line
  if (!isNaN(Number(value))) {
    return parseFloat(value);
  }

  return value;
}

export function getColumnsFromRows(rows: any[]): string[] {
  const [row] = rows;

  if (!row) {
    return [];
  }

  return Object.keys(row);
}

export function* colorGenerator(
  colors: string[] | MdbDataParserColorGenerator | MdbDataParserColorMap,
  i: number
): Generator<string, void, unknown> {
  const colorLibrary = {
    ...COLOR_MAP,
    ...COLOR_GENERATOR,
  };

  const colorPalette = Array.isArray(colors) ? colors : colorLibrary[colors];

  while (true) {
    yield colorPalette[i];

    i++;

    if (i > colorPalette.length - 1) {
      i = 0;
    }
  }
}

export function getFieldValues(data: string[], field: string | number): any[] {
  return data.map((entry) => entry[field]);
}

export function getBoundryValues(array: any): { max: number; min: number } {
  const values = array.filter(isNumber);
  return {
    max: Math.max(...values),
    min: Math.min(...values),
  };
}

export function isNumber(x: any): boolean {
  return typeof x === 'number' && !isNaN(x);
}
