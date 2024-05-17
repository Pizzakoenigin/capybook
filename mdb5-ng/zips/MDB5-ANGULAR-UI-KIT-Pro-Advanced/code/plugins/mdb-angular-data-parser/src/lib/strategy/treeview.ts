import { FUNCTION_KEYS, REFERENCE_KEYS, TREEVIEW_KEYS } from '../data-parser-defaults';
import { MdbDataParserTreeviewOptions } from '../data-parser-types';

export class MdbDataParserTreeviewStrategy {
  private _functionKeys: string[] = FUNCTION_KEYS.filter(
    (key) => typeof this._options[key] === 'function'
  );
  private _referenceKeys: string[] = REFERENCE_KEYS.filter((key) => typeof key === 'string');

  constructor(private readonly _options: MdbDataParserTreeviewOptions) {}

  public parse(data: any): any[] {
    return this._parseStructure(data);
  }

  private _parseStructure(structure: any[]): any[] {
    return structure.map((el) => this._parseNode(el));
  }

  private _parseNode(el: any): any {
    const output: any = {};

    TREEVIEW_KEYS.forEach((key) => {
      if (this._functionKeys.includes(key)) {
        output[key] = this._options[key](el);
      } else if (this._referenceKeys.includes(key)) {
        if (!el[this._options[key]]) {
          return;
        }

        if (key === 'children') {
          output.children = this._parseStructure(el[this._options[key]]);
        } else {
          output[key] = el[this._options[key]];
        }
      } else {
        output[key] = this._options[key];
      }
    });

    return output;
  }
}
