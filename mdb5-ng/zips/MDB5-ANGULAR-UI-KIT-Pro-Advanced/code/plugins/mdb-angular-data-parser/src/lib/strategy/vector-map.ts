import { COLOR_MAP, COUNTRY_CODES, MARKERS } from '../data-parser-defaults';
import { MdbDataParserFormat, MdbDataParserVectorMapOptions } from '../data-parser-types';
import {
  getBoundryValues,
  getCSVDataArray,
  getFieldValues,
  getSelectedEntries,
} from '../data-parser-utils';

export class MdbDataParserVectorMapStrategy {
  private _colorMap = this._setColorMap();
  constructor(
    private readonly _format: MdbDataParserFormat,
    private readonly _options: MdbDataParserVectorMapOptions
  ) {}

  public parse(data: any): {
    colorMap: any[];
    legend: { color: string; min: number; max: number }[];
  } {
    return this._parseArrayData(this._getDataArray(data) as string);
  }

  public getIdentifiers(data: any): string[] {
    const entries = this._getEntries(this._getDataArray(data) as string);

    return entries.map((entry: string) => this._getAlpha2Code(entry));
  }

  public getValueExtrema(data: any, field: string | number): { max: number; min: number } {
    const values = getFieldValues(this._getEntries(this._getDataArray(data) as string), field);
    return getBoundryValues(values);
  }

  public getMapCoordinates(latitude: number, longitude: number): { x: number; y: number } {
    const closestYPoints = this._getClosestPoints(latitude, 'latitude');
    const closestXPoints = this._getClosestPoints(longitude, 'longitude');

    return {
      x: this._getCoordinate(closestXPoints, latitude, 'x'),
      y: this._getCoordinate(closestYPoints, longitude, 'y'),
    };
  }

  private _getClosestPoints(value: number, coordinate: string): { point1: any; point2: any } {
    const points = MARKERS.sort((a, b) => {
      const value = a[coordinate] - b[coordinate];
      if (value < 0) return -1;
      if (value > 0) return 1;
      return 0;
    });

    const result1 = points.reduce((a, b, i, markers) => {
      return i && Math.abs(markers[a][coordinate] - value) < Math.abs(b[coordinate] - value)
        ? a
        : i;
    }, -1);

    const points2 = points.filter((marker) => marker !== points[result1]);

    const result2 = points2.reduce((a, b, i, markers) => {
      return i && Math.abs(markers[a][coordinate] - value) < Math.abs(b[coordinate] - value)
        ? a
        : i;
    }, -1);

    const point1 = points[result1];
    const point2 = points2[result2];

    return {
      point1,
      point2,
    };
  }

  private _getCoordinate({ point1, point2 }, value: number, axis: string): number {
    const coordinate = axis === 'x' ? 'latitude' : 'longitude';

    const coordinateDiff1 = point1[coordinate] - value;

    const coordinateDiff2 = point2[coordinate] - value;

    const searchedValue =
      (coordinateDiff2 * point1[axis] - coordinateDiff1 * point2[axis]) /
      (coordinateDiff2 - coordinateDiff1);

    return searchedValue;
  }

  private _parseArrayData(data: string): {
    colorMap: any;
    legend: any;
  } {
    return this._generateColorCodes(this._getEntries(data));
  }

  private _getDataArray(data: string): string | any[] {
    if (this._format === 'csv') {
      const { delimiter } = this._options;

      return getCSVDataArray(data, delimiter);
    }

    return data;
  }

  private _getEntries(data: any): any {
    const { rows, countries } = this._options;

    return countries
      ? this._getSelectedCountries(data)
      : getSelectedEntries(data, rows.indexes || rows.start, rows.end);
  }

  private _getBoundryValues(array: any[]): {
    max: number;
    min: number;
  } {
    return {
      max: Math.max(...array),
      min: Math.min(...array),
    };
  }

  private _getSelectedCountries(array: any[]): any[] {
    const { countryIdentifier: identifier, countries } = this._options;

    return array.filter((entry) => {
      return countries.indexOf(entry[identifier]) !== -1;
    });
  }

  private _generateColorCodes(data: any[]): {
    colorMap: any[];
    legend: { color: string; min: number; max: number }[];
  } {
    const { field, step: fixedStep } = this._options;
    const intervals = this._colorMap.length;

    const values = data.map((entry) => entry[field]);

    const { min, max } = this._getBoundryValues(values);

    const step = fixedStep || Math.floor((max - min) / intervals);

    const legend = this._colorMap.map((color, i) => {
      const minValue = min + i * step;
      let maxValue = minValue + step;

      if (i === intervals - 1) {
        maxValue = max;
      }

      return {
        color,
        min: minValue,
        max: maxValue,
      };
    });

    const colorMap = this._colorMap.map((color) => ({
      fill: color,
      regions: [],
    }));

    values.forEach((value: number, i: number) => {
      const interval = Math.floor((value - min) / step);

      const index = interval < intervals ? interval : intervals - 1;

      const alpha2Code = this._getAlpha2Code(data[i]);

      if (!alpha2Code) return;

      colorMap[index].regions.push({
        id: alpha2Code,
        tooltip: this._options.tooltips(value),
      });
    });

    return { colorMap, legend };
  }

  private _getAlpha2Code(entry: string): string {
    const { countryIdentifier: identifier } = this._options;

    const findCountry = (value: string, key: string) => {
      return COUNTRY_CODES.find((country) => country[key].toLowerCase().match(value.toLowerCase()));
    };

    let key: string;

    switch (entry[identifier].length) {
      case 2:
        key = 'alpha2';
        break;
      case 3:
        key = 'alpha3';
        break;
      default:
        key = 'country';
    }

    const country = findCountry(entry[identifier], key);

    if (!country) {
      return null;
    }

    return country.alpha2;
  }

  private _setColorMap(): string[] {
    const { color } = this._options;

    if (Array.isArray(color)) return color;

    const colorMap = COLOR_MAP[color];

    if (!colorMap) {
      throw new Error(`Color ${color} not found.`);
    }

    return colorMap;
  }
}
