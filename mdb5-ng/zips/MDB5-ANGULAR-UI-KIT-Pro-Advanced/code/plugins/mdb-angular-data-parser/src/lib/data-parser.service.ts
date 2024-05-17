import { Injectable } from '@angular/core';
import {
  defaultChartOptions,
  defaultDatatableOptions,
  defaultTreeviewOptions,
  defaultVectorMapOptions,
} from './data-parser-defaults';
import {
  MdbDataParserChartOptions,
  MdbDataParserColorGenerator,
  MdbDataParserColorMap,
  MdbDataParserDatatableOptions,
  MdbDataParserTreeviewOptions,
  MdbDataParserVectorMapOptions,
  MdbDataParserFormat,
} from './data-parser-types';
import { colorGenerator, getCSVDataArray } from './data-parser-utils';
import { MdbDataParserChartStrategy } from './strategy/chart';
import { MdbDataParserDatatableStrategy } from './strategy/datatable';
import { MdbDataParserTreeviewStrategy } from './strategy/treeview';
import { MdbDataParserVectorMapStrategy } from './strategy/vector-map';

@Injectable({
  providedIn: 'root',
})
export class MdbDataParserService {
  constructor() {}

  public useDatatableParser(
    format: MdbDataParserFormat = 'json',
    options?: MdbDataParserDatatableOptions
  ): MdbDataParserDatatableStrategy {
    const config = { ...defaultDatatableOptions, ...options };

    return new MdbDataParserDatatableStrategy(format, config);
  }
  public useVectorMapParser(
    format: MdbDataParserFormat = 'json',
    options?: MdbDataParserVectorMapOptions
  ): MdbDataParserVectorMapStrategy {
    const config = { ...defaultVectorMapOptions, ...options };

    return new MdbDataParserVectorMapStrategy(format, config);
  }
  public useChartParser(
    format: MdbDataParserFormat = 'json',
    options?: MdbDataParserChartOptions
  ): MdbDataParserChartStrategy {
    const config = { ...defaultChartOptions, ...options };

    return new MdbDataParserChartStrategy(format, config);
  }
  public useTreeviewParser(options?: MdbDataParserTreeviewOptions): MdbDataParserTreeviewStrategy {
    const config = { ...defaultTreeviewOptions, ...options };

    return new MdbDataParserTreeviewStrategy(config);
  }

  // UTIL PUBLIC FUNCTIONS

  // Array

  public flattenDeep(array: any[] = []): any[] {
    return array.reduce(
      (acc, val) => (Array.isArray(val) ? acc.concat(this.flattenDeep(val)) : acc.concat(val)),
      []
    );
  }

  public pullAll(array: any[] = [], items: any[] = []): any[] {
    items.forEach((item) => {
      for (let i = 0; i < array.length; i++) {
        if (array[i] === item) {
          array.splice(i, 1);
        } else {
          continue;
        }
      }
    });

    return array;
  }

  public take(array: any[] = [], items: number = 1): any[] {
    if (array.length < items) {
      return array;
    }

    const output = array.slice(0, items);

    return output;
  }

  public takeRight(array: any[] = [], items: number = 1): any[] {
    if (array.length < items) {
      return array;
    }

    const output = array.slice(array.length - items, array.length);

    return output;
  }

  public union(...args: any[]): any[] {
    const output = [];

    args.forEach((arg) => {
      const value = Array.isArray(arg) ? arg : new Array(arg);

      output.push(value);
    });

    return this.uniq(this.flattenDeep(output));
  }

  public unionBy(value: Function | string, ...args: any[]): any[] {
    const array = this.flattenDeep(new Array(...args));

    return this.uniqBy(value, array);
  }

  public uniq(array: any[] = []): any[] {
    return [...new Set(array)];
  }

  public uniqBy(value: Function | string, array: any[] = []): any[] {
    const flattenArray = this.flattenDeep(array);
    const values = [];
    const output = [];

    if (typeof value === 'function') {
      for (let i = 0; i < flattenArray.length; i++) {
        if (values.includes(value(flattenArray[i]))) {
          continue;
        }

        values.push(value(flattenArray[i]));
        output.push(flattenArray[i]);
      }
    } else if (typeof value === 'string') {
      for (let i = 0; i < flattenArray.length; i++) {
        if (values.includes(flattenArray[i][value])) {
          continue;
        }

        values.push(flattenArray[i][value]);
        output.push(flattenArray[i]);
      }
    } else {
      throw new Error('Invalid iteratee parameter type');
    }

    return output;
  }

  public zip(...args: any[]): any[] {
    const output = [];

    const lengths = args.map((item) => item.length);

    const maxLength = lengths.reduce((a, b) => Math.max(a, b));

    for (let i = 0; i < maxLength; i++) {
      output[i] = [];
      args.forEach((array) => {
        output[i].push(array[i]);
      });
    }

    return output;
  }

  public zipObject(keys: any[] = [], values: any[] = []): { [key: string]: any } {
    const output = {};

    keys.forEach((key, index) => {
      output[key] = values[index];
    });

    return output;
  }

  // Collections

  public countBy(collection: any[] | object = [], value: ((item: any) => any) | string): object {
    const collectionType = Array.isArray(collection);
    const output: { [key: string]: number } = {};

    if (collectionType) {
      let keys: any[];
      if (typeof value === 'function') {
        keys = collection.map((item) => value(item));
      } else {
        keys = collection.map((item) => item[value]);
      }

      [...new Set(keys)].forEach((key) => {
        output[key] = 0;

        keys.forEach((item) => {
          if (key === item) {
            output[key]++;
          }

          return;
        });
      });
    } else {
      let keys: any[];
      if (typeof value === 'function') {
        keys = Object.keys(collection).map((item) => value(collection[item]));
      } else {
        keys = Object.keys(collection).map((item) => collection[item][value]);
      }

      [...new Set(keys)].forEach((key) => {
        output[key] = 0;

        keys.forEach((item) => {
          if (key === item) {
            output[key]++;
          }

          return;
        });
      });
    }

    return output;
  }

  public groupBy(collection: object | any[], value: ((item: any) => any) | string): object {
    const collectionType = Array.isArray(collection);
    const output: { [key: string]: any[] } = {};

    if (collectionType) {
      let keys: any[];
      if (typeof value === 'function') {
        keys = collection.map((item) => value(item));
      } else {
        keys = collection.map((item) => item[value as string]);
      }

      [...new Set(keys)].forEach((key) => {
        output[key] = [];

        keys.forEach((item, index) => {
          if (key === item) {
            output[key].push(collection[index]);
          }

          return;
        });
      });
    } else {
      const objKeys = Object.keys(collection);
      let keys: any[];
      if (typeof value === 'function') {
        keys = objKeys.map((item) => value(collection[item]));
      } else {
        keys = objKeys.map((item) => collection[item][value as string]);
      }

      [...new Set(keys)].forEach((key) => {
        output[key] = [];

        keys.forEach((item, index) => {
          if (key === item) {
            output[key].push(collection[objKeys[index]]);
          }

          return;
        });
      });
    }

    return output;
  }

  public orderBy(collection: {} | any[] = [], values: any, order: any = []): any[] {
    let output = [];

    if (order.length < values.length) {
      for (let i = order.length; i < values.length; i++) {
        order[i] = 'asc';
      }
    }

    const valuesType = Array.isArray(values);

    const length = valuesType ? values.length : 1;

    const collectionType = Array.isArray(collection);

    if (collectionType) {
      if (typeof collection[0] === 'object') {
        output = collection.sort((a, b) => {
          for (let i = 0; i < length; i++) {
            const aValue = valuesType ? a[values[i]] : values(a);
            const bValue = valuesType ? b[values[i]] : values(b);

            if (order[i] === 'desc') {
              if (aValue < bValue) {
                return 1;
              }

              if (aValue > bValue) {
                return -1;
              }

              continue;
            }

            if (aValue > bValue) {
              return 1;
            }

            if (aValue < bValue) {
              return -1;
            }

            continue;
          }
        });
      } else {
        output = collection.sort();

        if ((values as unknown as string) === 'desc' || values[0] === 'desc') {
          output.reverse();
        }
      }
    } else {
      const keys = Object.keys(collection);

      const valuesToSort = keys.map((key) => collection[key]);

      output = valuesToSort.sort();

      if ((values as unknown as string) === 'desc' || values[0] === 'desc') {
        output.reverse();
      }
    }

    return output;
  }

  public sortBy(collection: any[] | {} = [], values: any = []): any[] {
    let output: any[] = [];

    const valuesType = Array.isArray(values);

    const length = valuesType ? values.length : 1;

    const collectionType = Array.isArray(collection);

    if (collectionType) {
      if (typeof collection[0] === 'object') {
        output = collection.sort((a: any, b: any) => {
          for (let i = 0; i < length; i++) {
            const aValue = valuesType ? a[values[i]] : values(a);
            const bValue = valuesType ? b[values[i]] : values(b);

            if (aValue > bValue) {
              return 1;
            }

            if (aValue < bValue) {
              return -1;
            }

            continue;
          }
        });
      } else {
        output = collection.sort();
      }
    } else {
      const keys = Object.keys(collection);

      const valuesToSort = keys.map((key) => collection[key]);

      output = valuesToSort.sort();
    }

    return output;
  }

  // Objects

  public invert(object: { [key: string]: any } = {}): { [key: string]: any } {
    const keys = Object.keys(object);

    const output: { [key: string]: any } = {};

    keys.forEach((key) => {
      output[object[key]] = key;
    });

    return output;
  }

  public invertBy(
    object: { [key: string]: any } = {},
    func: (key: any) => any = (key) => key
  ): { [key: string]: string[] } {
    const keys = Object.keys(object);

    const output: { [key: string]: string[] } = {};

    keys.map((key) => {
      const newKey = func(object[key]);

      if (!Array.isArray(output[newKey])) {
        output[newKey] = [];
      }

      return output[newKey].push(key);
    });

    return output;
  }

  public omit(
    object: { [key: string]: any } = {},
    keys: string[] | string = []
  ): { [key: string]: any } {
    const objectKeys = Object.keys(object);
    const output = {};

    objectKeys
      .filter((key) => {
        return !keys.includes(key);
      })
      .forEach((key) => {
        output[key] = object[key];
      });

    return output;
  }

  public omitBy(
    object: { [key: string]: any } = {},
    func: (value: any) => boolean = () => false
  ): { [key: string]: any } {
    const objectKeys = Object.keys(object);
    const output = {};

    objectKeys
      .filter((key) => {
        return !func(object[key]);
      })
      .forEach((key) => {
        output[key] = object[key];
      });

    return output;
  }

  public pick(
    object: { [key: string]: any } = {},
    keys: string[] | string = []
  ): { [key: string]: any } {
    const objectKeys = Object.keys(object);
    const output = {};

    objectKeys
      .filter((key) => {
        return keys.includes(key);
      })
      .forEach((key) => {
        output[key] = object[key];
      });

    return output;
  }

  public pickBy(
    object: { [key: string]: any } = {},
    func: (value: any) => boolean = () => false
  ): { [key: string]: any } {
    const objectKeys = Object.keys(object);
    const output = {};

    objectKeys
      .filter((key) => {
        return func(object[key]);
      })
      .forEach((key) => {
        output[key] = object[key];
      });

    return output;
  }

  public transform(
    object: { [key: string]: any } = {},
    func: (accumulator: { [key: string]: any }, value: any, key: string) => any,
    accumulator: { [key: string]: any } = {}
  ): { [key: string]: any } {
    return Object.keys(object).reduce((a, b) => {
      const result = func(a, object[b], b);

      if (result !== undefined) {
        return result;
      }

      return accumulator;
    }, accumulator);
  }

  public colorGenerator(
    colors: string[] | MdbDataParserColorMap | MdbDataParserColorGenerator,
    i: number
  ) {
    return colorGenerator(colors, i);
  }

  public getCSVDataArray(data: string, delimiter: string = ',') {
    return getCSVDataArray(data, delimiter);
  }
}
