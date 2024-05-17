import { MdbDataParserDatatableOptions, MdbDataParserFormat } from '../data-parser-types';
import {
  getBoundryValues,
  getColumnsFromRows,
  getCSVDataArray,
  getFieldValues,
  getSelectedEntries,
  normalize,
} from '../data-parser-utils';

export class MdbDataParserDatatableStrategy {
  constructor(
    private readonly _format: MdbDataParserFormat,
    private readonly _options: MdbDataParserDatatableOptions
  ) {}

  public parse(data: any): { rows: any[]; columns?: string[] } {
    if (this._format === 'csv') {
      return this._parseCSV(data);
    }

    return this._parseJSON(data);
  }

  public getValueExtrema(data: any, field: string | number): { max: number; min: number } {
    const { rows } = this._options;
    const values = getFieldValues(
      getSelectedEntries(this._getDataArray(data), rows.indexes || rows.start, rows.end),
      field
    );
    return getBoundryValues(values);
  }

  private _getDataArray(data: any): any[] {
    if (this._format === 'csv') {
      const { delimiter } = this._options;

      return getCSVDataArray(data, delimiter);
    }

    return data;
  }

  private _parseCSV(data: string): { rows: any[]; columns?: string[] } {
    const { delimiter, columns, rows, headerIndex } = this._options;
    const dataArr = getCSVDataArray(data, delimiter);
    const header = dataArr[headerIndex];

    let computedRows = getSelectedEntries(dataArr, rows.indexes || rows.start, rows.end);

    if (!header) {
      return {
        rows: computedRows.map((row) =>
          getSelectedEntries(row, columns.indexes || columns.start, columns.end)
        ),
      };
    }

    const computedColumns = getSelectedEntries(
      header,
      columns.indexes || columns.start,
      columns.end
    );
    computedRows = computedRows.map((row) =>
      getSelectedEntries(row, columns.indexes || columns.start, columns.end)
    );

    return {
      rows: computedRows,
      columns: computedColumns,
    };
  }

  private _parseJSON(data: any): { rows: any[]; columns?: string[] } {
    const { rows, keys } = this._options;
    let computedRows = getSelectedEntries(data, rows.indexes || rows.start, rows.end).map(
      (entry) => {
        const output: { [key: string]: any } = {};
        Object.keys(entry).forEach((key) => (output[key] = normalize(entry[key])));
        return output;
      }
    );
    const columns = getColumnsFromRows(computedRows);

    if (!keys) {
      return { columns, rows: computedRows };
    }

    computedRows = computedRows.map((row) => {
      columns.forEach((column) => {
        if (keys.indexOf(column) === -1) {
          delete row[column];
        }
      });
      return row;
    });

    return { columns: keys, rows: computedRows };
  }
}
