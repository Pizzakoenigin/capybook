export interface MdbDataParserDatatableOptions {
  delimiter?: string;
  keys?: string[];
  headerIndex?: number;
  columns?: {
    indexes?: number | number[];
    start?: number;
    end?: number;
  };
  rows?: {
    indexes?: number | number[];
    start?: number;
    end?: number;
  };
}

export interface MdbDataParserVectorMapOptions {
  field?: number | string;
  color?: string | any[];
  countries?: any[];
  countryIdentifier?: number | string;
  headerIndex?: number;
  delimiter?: string;
  step?: number;
  tooltips?: Function;
  rows?: {
    indexes?: number | number[];
    start?: number;
    end?: number;
  };
}

export interface MdbDataParserChartOptions {
  datasetLabel?: string | number;
  labelsIndex?: number;
  delimiter?: string;
  keys?: any[];
  ignoreKeys?: any[];
  formatLabel?: (label: string) => void;
  getCoordinates?: Function;
  color?: string | number;
  columns?: {
    indexes?: number | number[];
    start?: number;
    end?: number;
  };
  rows?: {
    indexes?: number | number[];
    start?: number;
    end?: number;
  };
}

export class MdbDataParserTreeviewOptions {
  name?: string | Function;
  children?: string;
  icon?: string | Function;
  show?: boolean | Function;
  disabled?: boolean | Function;
  id?: string | number;
}

export type MdbDataParserFormat = 'json' | 'csv';

export type MdbDataParserColorGenerator =
  | 50
  | 100
  | 200
  | 300
  | 400
  | 500
  | 600
  | 700
  | 800
  | 900
  | 'mdb';

export type MdbDataParserColorMap =
  | 'red'
  | 'pink'
  | 'purple'
  | 'deepPurple'
  | 'indigo'
  | 'blue'
  | 'lightBlue'
  | 'cyan'
  | 'teal'
  | 'green'
  | 'lightGreen'
  | 'lime'
  | 'yellow'
  | 'amber'
  | 'orange'
  | 'deepOrange'
  | 'brown'
  | 'gray'
  | 'blueGray';
