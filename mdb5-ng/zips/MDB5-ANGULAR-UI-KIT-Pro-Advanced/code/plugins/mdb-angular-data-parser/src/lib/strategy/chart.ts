import { COLOR_GENERATOR } from '../data-parser-defaults';
import { MdbDataParserChartOptions, MdbDataParserFormat } from '../data-parser-types';
import {
  colorGenerator,
  getBoundryValues,
  getColumnsFromRows,
  getCSVDataArray,
  getFieldValues,
  getSelectedEntries,
  normalize,
} from '../data-parser-utils';

export class MdbDataParserChartStrategy {
  constructor(
    private readonly _format: MdbDataParserFormat,
    private readonly _options: MdbDataParserChartOptions
  ) {}

  public parse(data: any): any {
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

  private _parseCSV(data: string): any {
    const {
      delimiter,
      columns,
      rows,
      labelsIndex,
      datasetLabel,
      formatLabel,
      color,
      getCoordinates,
    } = this._options;

    const dataArr = getCSVDataArray(data, delimiter);

    const header = dataArr[labelsIndex];

    const computedRows = getSelectedEntries(dataArr, rows.indexes || rows.start, rows.end);

    if (!header) return { rows: computedRows };

    const labels = getSelectedEntries(header, columns.indexes || columns.start, columns.end);

    const colorIterator = colorGenerator(COLOR_GENERATOR[color], 0);

    const datasets = (computedRows as []).map((row) => {
      const getData = () => {
        const computedEntry = getSelectedEntries(
          row,
          columns.indexes || columns.start,
          columns.end
        );

        if (getCoordinates) {
          return [getCoordinates(computedEntry)];
        }
        return computedEntry;
      };

      const label = row[datasetLabel] || '';
      const color = colorIterator.next().value;
      const data = getData();

      return {
        label,
        data,
        color,
      };
    });

    return {
      datasets,
      labels: (labels as []).map((label) => formatLabel(label)),
    };
  }

  private _parseJSON(data: any): any {
    const { rows, keys, ignoreKeys, datasetLabel, formatLabel, color, getCoordinates } =
      this._options;

    const computedEntries = (
      getSelectedEntries(data, rows.indexes || rows.start, rows.end) as []
    ).map((entry) => {
      const output = {};

      Object.keys(entry).forEach((key) => {
        output[key] = normalize(entry[key]);
      });

      return output;
    });

    const labels =
      keys ||
      getColumnsFromRows(computedEntries).filter((label) => ignoreKeys.indexOf(label) === -1);

    const colorIterator = colorGenerator(COLOR_GENERATOR[color], 0);

    const datasets = computedEntries.map((entry) => {
      const getData = () => {
        if (getCoordinates) {
          return [getCoordinates(entry)];
        }

        return labels.map((label) => {
          return entry[label] || 0;
        });
      };

      const data = getData();
      const label = entry[datasetLabel] || '';
      const color = colorIterator.next().value;

      return {
        data,
        label,
        color,
      };
    });

    return {
      labels: labels.map((label) => formatLabel(label)),
      datasets,
    };
  }
}
