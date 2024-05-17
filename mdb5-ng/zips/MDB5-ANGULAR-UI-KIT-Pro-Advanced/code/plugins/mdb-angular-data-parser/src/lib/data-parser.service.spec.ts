import { TestBed } from '@angular/core/testing';
import { MdbDataParserFormat } from './data-parser-types';

import { MdbDataParserService } from './data-parser.service';
import { dataCSV, dataJSON } from './data-parser-defaults';

describe('MdbDataParserService', () => {
  let service: MdbDataParserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MdbDataParserService],
    });
    service = TestBed.inject(MdbDataParserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('datatables', () => {
    describe('CSV', () => {
      const format: MdbDataParserFormat = 'csv';
      const data = dataCSV;

      it('should parse all data to required format (without header)', () => {
        const parser = service.useDatatableParser(format);

        const { rows, columns } = parser.parse(data);

        expect(rows.length).toBe(6);
        expect(columns).toBeFalsy();

        expect(rows[0][0]).toEqual('Country');
        expect(rows[1][0]).toEqual('Aruba');
      });

      it('should return rows between selected indexes', () => {
        const parser = service.useDatatableParser(format, {
          rows: { start: 2, end: 4 },
          headerIndex: 0,
        });

        const { rows } = parser.parse(data);

        expect(rows.length).toBe(2);

        expect(rows[0][0]).toEqual('Afghanistan');
        expect(rows[1][0]).toEqual('Angola');
      });

      it('should return rows with selected indexes', () => {
        const parser = service.useDatatableParser(format, {
          rows: { indexes: [2, 5] },
          headerIndex: 0,
        });

        const { rows } = parser.parse(data);

        expect(rows.length).toBe(2);

        expect(rows[0][0]).toEqual('Afghanistan');
        expect(rows[1][0]).toEqual('Andorra');
      });

      it('should return columns between selected indexes', () => {
        const parser = service.useDatatableParser(format, {
          columns: { start: 2, end: 4 },
          rows: { start: 1 },
          headerIndex: 0,
        });

        const { columns, rows } = parser.parse(data);

        expect(columns.length).toBe(2);
        expect(columns[0]).toEqual('Year_1960');
        expect(columns[1]).toEqual('Year_1961');

        expect(rows.length).toBe(5);

        const [firstRow] = rows;

        expect(firstRow[0]).toEqual(54211);
        expect(firstRow[1]).toEqual(55438);
      });

      it('should return columns at selected indexes', () => {
        const parser = service.useDatatableParser(format, {
          columns: { indexes: [1, 3] },
          rows: { start: 1 },
          headerIndex: 0,
        });

        const { columns, rows } = parser.parse(data);

        expect(columns.length).toBe(2);
        expect(columns[0]).toEqual('Country_Code');
        expect(columns[1]).toEqual('Year_1961');

        expect(rows.length).toBe(5);

        const [firstRow] = rows;

        expect(firstRow[0]).toEqual('ABW');
        expect(firstRow[1]).toEqual(55438);
      });

      it('should return correct min and max values from fourth data column', () => {
        const parser = service.useDatatableParser(format);
        const { min, max } = parser.getValueExtrema(data, 3);
        expect(min).toEqual(14375);
        expect(max).toEqual(9166764);
      });
    });
    describe('JSON', () => {
      const format: MdbDataParserFormat = 'json';
      const data = dataJSON;

      it('should parse all data to required format', () => {
        const parser = service.useDatatableParser(format);

        const { rows, columns } = parser.parse(data);

        expect(rows.length).toBe(5);
        expect(columns.length).toBe(59);

        expect(rows[0].Country).toEqual('Aruba');
        expect(columns[0]).toEqual('Country');
      });

      it('should return rows between selected indexes', () => {
        const parser = service.useDatatableParser(format, { rows: { start: 1, end: 3 } });

        const { rows } = parser.parse(data);

        expect(rows.length).toBe(2);

        expect(rows[0].Country).toEqual('Afghanistan');
        expect(rows[1].Country).toEqual('Angola');
      });

      it('should return rows with selected indexes', () => {
        const parser = service.useDatatableParser(format, { rows: { indexes: [1, 4] } });

        const { rows } = parser.parse(data);

        expect(rows.length).toBe(2);

        expect(rows[0].Country).toEqual('Afghanistan');
        expect(rows[1].Country).toEqual('Andorra');
      });

      it('should return columns with selected keys', () => {
        const parser = service.useDatatableParser(format, { keys: ['Year_1960', 'Year_1961'] });

        const { columns, rows } = parser.parse(data);

        expect(columns.length).toBe(2);

        const [firstRow] = rows;
        expect(Object.keys(firstRow).length).toBe(2);

        expect(firstRow['Year_1960']).toEqual(54211);
        expect(firstRow['Year_1961']).toEqual(55438);
      });

      it('should return correct min and max values from given field', () => {
        const parser = service.useDatatableParser(format);
        const { min, max } = parser.getValueExtrema(data, 'Year_1980');
        expect(min).toEqual(36067);
        expect(max).toEqual(13248370);
      });
    });
  });

  describe('vector maps', () => {
    describe('CSV', () => {
      const format = 'csv';
      const data = dataCSV;

      it('should get an alpha 2 code based on countryIdentifier (alpha3) field (or null when not found)', () => {
        const parser = service.useVectorMapParser(format, {
          countryIdentifier: 1,
          rows: { start: 1 },
        });

        const codes = parser.getIdentifiers(data);

        expect(codes[0]).toEqual('AW');
        expect(codes[1]).toEqual('AF');
      });

      it('should get an alpha 2 code based on countryIdentifier (name) field (or null when not found)', () => {
        const parser = service.useVectorMapParser(format, {
          countryIdentifier: 0,
          rows: { start: 1 },
        });

        const codes = parser.getIdentifiers(data);

        expect(codes[0]).toEqual('AW');
        expect(codes[1]).toEqual('AF');
      });

      it('should create a color map based on values in a specific field', () => {
        const parser = service.useVectorMapParser(format, {
          field: 2,
          color: 'red',
          countryIdentifier: 1,
          rows: { start: 1 },
        });

        const { colorMap } = parser.parse(data);

        expect(colorMap[0].regions.length).toBe(2);
        expect(colorMap[1].regions.length).toBe(1);
        expect(colorMap[2].regions.length).toBe(0);
        expect(colorMap[3].regions.length).toBe(0);
        expect(colorMap[4].regions.length).toBe(0);
        expect(colorMap[5].regions.length).toBe(0);
        expect(colorMap[6].regions.length).toBe(1);
        expect(colorMap[7].regions.length).toBe(0);
        expect(colorMap[8].regions.length).toBe(0);
        expect(colorMap[9].regions.length).toBe(1);
      });

      it('should use a custom color map', () => {
        const parser = service.useVectorMapParser(format, {
          field: 2,
          color: ['red', 'blue', 'green'],
          countryIdentifier: 1,
          rows: { start: 1 },
        });

        const { colorMap } = parser.parse(data);

        const [color1, color2, color3] = colorMap;

        expect(colorMap.length).toBe(3);

        expect(color1.fill).toEqual('red');
        expect(color1.regions.length).toBe(3);

        expect(color2.fill).toEqual('blue');
        expect(color2.regions.length).toBe(1);

        expect(color3.fill).toEqual('green');
        expect(color3.regions.length).toBe(1);
      });

      it('should color only selected regions (start - end interval)', () => {
        const parser = service.useVectorMapParser(format, {
          field: 2,
          countryIdentifier: 1,
          rows: { start: 2, end: 4 },
        });

        const { colorMap } = parser.parse(data);

        expect(colorMap[0].regions.length).toBe(1);
        expect(colorMap[1].regions.length).toBe(0);
        expect(colorMap[2].regions.length).toBe(0);
        expect(colorMap[3].regions.length).toBe(0);
        expect(colorMap[4].regions.length).toBe(0);
        expect(colorMap[5].regions.length).toBe(0);
        expect(colorMap[6].regions.length).toBe(0);
        expect(colorMap[7].regions.length).toBe(0);
        expect(colorMap[8].regions.length).toBe(0);
        expect(colorMap[9].regions.length).toBe(1);
      });

      it('should color only selected regions (indexes)', () => {
        const parser = service.useVectorMapParser(format, {
          field: 2,
          countryIdentifier: 1,
          rows: { indexes: [2, 3, 4] },
        });

        const { colorMap } = parser.parse(data);

        expect(colorMap[0].regions.length).toBe(1);
        expect(colorMap[1].regions.length).toBe(0);
        expect(colorMap[2].regions.length).toBe(0);
        expect(colorMap[3].regions.length).toBe(0);
        expect(colorMap[4].regions.length).toBe(0);
        expect(colorMap[5].regions.length).toBe(1);
        expect(colorMap[6].regions.length).toBe(0);
        expect(colorMap[7].regions.length).toBe(0);
        expect(colorMap[8].regions.length).toBe(0);
        expect(colorMap[9].regions.length).toBe(1);
      });

      it('should color only selected regions (array of identifiers)', () => {
        const parser = service.useVectorMapParser(format, {
          field: 2,
          countryIdentifier: 1,
          countries: ['ABW', 'AGO'],
        });

        const { colorMap } = parser.parse(data);

        expect(colorMap[0].regions.length).toBe(1);
        expect(colorMap[0].regions[0].id).toEqual('AW');
        expect(colorMap[1].regions.length).toBe(0);
        expect(colorMap[2].regions.length).toBe(0);
        expect(colorMap[3].regions.length).toBe(0);
        expect(colorMap[4].regions.length).toBe(0);
        expect(colorMap[5].regions.length).toBe(0);
        expect(colorMap[6].regions.length).toBe(0);
        expect(colorMap[7].regions.length).toBe(0);
        expect(colorMap[8].regions.length).toBe(0);
        expect(colorMap[9].regions.length).toBe(1);
        expect(colorMap[9].regions[0].id).toEqual('AO');
      });

      it('should return a legend with dynamically calculated intervals', () => {
        const parser = service.useVectorMapParser(format, {
          field: 2,
          countryIdentifier: 1,
          rows: { start: 1 },
        });

        const { legend } = parser.parse(data);

        const { min, max } = parser.getValueExtrema(data, 2);

        const step = (max - min) / 10;

        expect(legend[0].min).toEqual(min);
        expect(legend[0].max).toEqual(min + step);

        expect(legend[1].min).toEqual(min + step);
        expect(legend[1].max).toEqual(min + step * 2);

        expect(legend[2].min).toEqual(min + step * 2);
        expect(legend[2].max).toEqual(min + step * 3);

        expect(legend[3].min).toEqual(min + step * 3);
        expect(legend[3].max).toEqual(min + step * 4);

        expect(legend[4].min).toEqual(min + step * 4);
        expect(legend[4].max).toEqual(min + step * 5);

        expect(legend[5].min).toEqual(min + step * 5);
        expect(legend[5].max).toEqual(min + step * 6);

        expect(legend[6].min).toEqual(min + step * 6);
        expect(legend[6].max).toEqual(min + step * 7);

        expect(legend[7].min).toEqual(min + step * 7);
        expect(legend[7].max).toEqual(min + step * 8);

        expect(legend[8].min).toEqual(min + step * 8);
        expect(legend[8].max).toEqual(min + step * 9);

        expect(legend[9].min).toEqual(min + step * 9);
        expect(legend[9].max).toEqual(max);
      });

      it('should use a fixed step for creating intervals', () => {
        const parser = service.useVectorMapParser(format, {
          field: 2,
          countryIdentifier: 1,
          rows: { start: 1 },
          step: 1000,
        });

        const { legend } = parser.parse(data);

        const { min, max } = parser.getValueExtrema(data, 2);

        const step = 1000;

        expect(legend[0].min).toEqual(min);
        expect(legend[0].max).toEqual(min + step);

        expect(legend[1].min).toEqual(min + step);
        expect(legend[1].max).toEqual(min + step * 2);

        expect(legend[2].min).toEqual(min + step * 2);
        expect(legend[2].max).toEqual(min + step * 3);

        expect(legend[3].min).toEqual(min + step * 3);
        expect(legend[3].max).toEqual(min + step * 4);

        expect(legend[4].min).toEqual(min + step * 4);
        expect(legend[4].max).toEqual(min + step * 5);

        expect(legend[5].min).toEqual(min + step * 5);
        expect(legend[5].max).toEqual(min + step * 6);

        expect(legend[6].min).toEqual(min + step * 6);
        expect(legend[6].max).toEqual(min + step * 7);

        expect(legend[7].min).toEqual(min + step * 7);
        expect(legend[7].max).toEqual(min + step * 8);

        expect(legend[8].min).toEqual(min + step * 8);
        expect(legend[8].max).toEqual(min + step * 9);

        expect(legend[9].min).toEqual(min + step * 9);
        expect(legend[9].max).toEqual(max);
      });

      it('should create custom tooltips', () => {
        const parser = service.useVectorMapParser(format, {
          field: 2,
          countryIdentifier: 1,
          rows: { start: 1, end: 4 },
          color: ['red', 'green'],
          tooltips: (value) => `Value: ${value}`,
        });

        const { colorMap } = parser.parse(data);

        const [{ regions: regions1 }, { regions: regions2 }] = colorMap;

        expect(regions1[0].id).toEqual('AW');
        expect(regions1[0].tooltip).toEqual('Value: 54211');

        expect(regions2[0].id).toEqual('AF');
        expect(regions2[0].tooltip).toEqual('Value: 8996351');

        expect(regions2[1].id).toEqual('AO');
        expect(regions2[1].tooltip).toEqual('Value: 5643182');
      });
    });

    describe('JSON', () => {
      const format = 'json';
      const data = dataJSON;

      it('should get an alpha 2 code based on countryIdentifier (alpha3) field (or null when not found)', () => {
        const parser = service.useVectorMapParser(format, {
          countryIdentifier: 'Country_Code',
        });

        const codes = parser.getIdentifiers(data);

        expect(codes[0]).toEqual('AW');
        expect(codes[1]).toEqual('AF');
      });

      it('should get an alpha 2 code based on countryIdentifier (name) field (or null when not found)', () => {
        const parser = service.useVectorMapParser(format, {
          countryIdentifier: 'Country',
        });

        const codes = parser.getIdentifiers(data);

        expect(codes[0]).toEqual('AW');
        expect(codes[1]).toEqual('AF');
      });

      it('should create a color map based on values in a specific field', () => {
        const parser = service.useVectorMapParser(format, {
          field: 'Year_1960',
          color: 'red',
          countryIdentifier: 'Country_Code',
        });

        const { colorMap } = parser.parse(data);

        expect(colorMap[0].regions.length).toBe(2);
        expect(colorMap[1].regions.length).toBe(1);
        expect(colorMap[2].regions.length).toBe(0);
        expect(colorMap[3].regions.length).toBe(0);
        expect(colorMap[4].regions.length).toBe(0);
        expect(colorMap[5].regions.length).toBe(0);
        expect(colorMap[6].regions.length).toBe(1);
        expect(colorMap[7].regions.length).toBe(0);
        expect(colorMap[8].regions.length).toBe(0);
        expect(colorMap[9].regions.length).toBe(1);
      });

      it('should use a custom color map', () => {
        const parser = service.useVectorMapParser(format, {
          field: 'Year_1960',
          color: ['red', 'blue', 'green'],
          countryIdentifier: 'Country_Code',
        });

        const { colorMap } = parser.parse(data);

        const [color1, color2, color3] = colorMap;

        expect(colorMap.length).toBe(3);

        expect(color1.fill).toEqual('red');
        expect(color1.regions.length).toBe(3);

        expect(color2.fill).toEqual('blue');
        expect(color2.regions.length).toBe(1);

        expect(color3.fill).toEqual('green');
        expect(color3.regions.length).toBe(1);
      });

      it('should color only selected regions (start - end interval)', () => {
        const parser = service.useVectorMapParser(format, {
          field: 'Year_1960',
          countryIdentifier: 'Country_Code',
          rows: { start: 1, end: 3 },
        });

        const { colorMap } = parser.parse(data);

        expect(colorMap[0].regions.length).toBe(1);
        expect(colorMap[1].regions.length).toBe(0);
        expect(colorMap[2].regions.length).toBe(0);
        expect(colorMap[3].regions.length).toBe(0);
        expect(colorMap[4].regions.length).toBe(0);
        expect(colorMap[5].regions.length).toBe(0);
        expect(colorMap[6].regions.length).toBe(0);
        expect(colorMap[7].regions.length).toBe(0);
        expect(colorMap[8].regions.length).toBe(0);
        expect(colorMap[9].regions.length).toBe(1);
      });

      it('should color only selected regions (indexes)', () => {
        const parser = service.useVectorMapParser(format, {
          field: 'Year_1960',
          countryIdentifier: 'Country_Code',
          rows: { indexes: [1, 2, 3] },
        });

        const { colorMap } = parser.parse(data);

        expect(colorMap[0].regions.length).toBe(1);
        expect(colorMap[1].regions.length).toBe(0);
        expect(colorMap[2].regions.length).toBe(0);
        expect(colorMap[3].regions.length).toBe(0);
        expect(colorMap[4].regions.length).toBe(0);
        expect(colorMap[5].regions.length).toBe(1);
        expect(colorMap[6].regions.length).toBe(0);
        expect(colorMap[7].regions.length).toBe(0);
        expect(colorMap[8].regions.length).toBe(0);
        expect(colorMap[9].regions.length).toBe(1);
      });

      it('should color only selected regions (array of identifiers)', () => {
        const parser = service.useVectorMapParser(format, {
          field: 'Year_1960',
          countryIdentifier: 'Country_Code',
          countries: ['ABW', 'AGO'],
        });

        const { colorMap } = parser.parse(data);

        expect(colorMap[0].regions.length).toBe(1);
        expect(colorMap[0].regions[0].id).toEqual('AW');
        expect(colorMap[1].regions.length).toBe(0);
        expect(colorMap[2].regions.length).toBe(0);
        expect(colorMap[3].regions.length).toBe(0);
        expect(colorMap[4].regions.length).toBe(0);
        expect(colorMap[5].regions.length).toBe(0);
        expect(colorMap[6].regions.length).toBe(0);
        expect(colorMap[7].regions.length).toBe(0);
        expect(colorMap[8].regions.length).toBe(0);
        expect(colorMap[9].regions.length).toBe(1);
        expect(colorMap[9].regions[0].id).toEqual('AO');
      });

      it('should return a legend with dynamically calculated intervals', () => {
        const parser = service.useVectorMapParser(format, {
          field: 'Year_1960',
          countryIdentifier: 'Country_Code',
        });

        const { legend } = parser.parse(data);

        const { min, max } = parser.getValueExtrema(data, 'Year_1960');

        const step = (max - min) / 10;

        expect(legend[0].min).toEqual(min);
        expect(legend[0].max).toEqual(min + step);

        expect(legend[1].min).toEqual(min + step);
        expect(legend[1].max).toEqual(min + step * 2);

        expect(legend[2].min).toEqual(min + step * 2);
        expect(legend[2].max).toEqual(min + step * 3);

        expect(legend[3].min).toEqual(min + step * 3);
        expect(legend[3].max).toEqual(min + step * 4);

        expect(legend[4].min).toEqual(min + step * 4);
        expect(legend[4].max).toEqual(min + step * 5);

        expect(legend[5].min).toEqual(min + step * 5);
        expect(legend[5].max).toEqual(min + step * 6);

        expect(legend[6].min).toEqual(min + step * 6);
        expect(legend[6].max).toEqual(min + step * 7);

        expect(legend[7].min).toEqual(min + step * 7);
        expect(legend[7].max).toEqual(min + step * 8);

        expect(legend[8].min).toEqual(min + step * 8);
        expect(legend[8].max).toEqual(min + step * 9);

        expect(legend[9].min).toEqual(min + step * 9);
        expect(legend[9].max).toEqual(max);
      });

      it('should use a fixed step for creating intervals', () => {
        const parser = service.useVectorMapParser(format, {
          field: 'Year_1960',
          countryIdentifier: 'Country_Code',
          step: 1000,
        });

        const { legend } = parser.parse(data);

        const { min, max } = parser.getValueExtrema(data, 'Year_1960');

        const step = 1000;

        expect(legend[0].min).toEqual(min);
        expect(legend[0].max).toEqual(min + step);

        expect(legend[1].min).toEqual(min + step);
        expect(legend[1].max).toEqual(min + step * 2);

        expect(legend[2].min).toEqual(min + step * 2);
        expect(legend[2].max).toEqual(min + step * 3);

        expect(legend[3].min).toEqual(min + step * 3);
        expect(legend[3].max).toEqual(min + step * 4);

        expect(legend[4].min).toEqual(min + step * 4);
        expect(legend[4].max).toEqual(min + step * 5);

        expect(legend[5].min).toEqual(min + step * 5);
        expect(legend[5].max).toEqual(min + step * 6);

        expect(legend[6].min).toEqual(min + step * 6);
        expect(legend[6].max).toEqual(min + step * 7);

        expect(legend[7].min).toEqual(min + step * 7);
        expect(legend[7].max).toEqual(min + step * 8);

        expect(legend[8].min).toEqual(min + step * 8);
        expect(legend[8].max).toEqual(min + step * 9);

        expect(legend[9].min).toEqual(min + step * 9);
        expect(legend[9].max).toEqual(max);
      });

      it('should create custom tooltips', () => {
        const parser = service.useVectorMapParser(format, {
          field: 'Year_1960',
          countryIdentifier: 'Country_Code',
          rows: { start: 0, end: 3 },
          color: ['red', 'green'],
          tooltips: (value) => `Value: ${value}`,
        });

        const { colorMap } = parser.parse(data);

        const [{ regions: regions1 }, { regions: regions2 }] = colorMap;

        expect(regions1[0].id).toEqual('AW');
        expect(regions1[0].tooltip).toEqual('Value: 54211');

        expect(regions2[0].id).toEqual('AF');
        expect(regions2[0].tooltip).toEqual('Value: 8996351');

        expect(regions2[1].id).toEqual('AO');
        expect(regions2[1].tooltip).toEqual('Value: 5643182');
      });
    });

    describe('coordinates', () => {
      const referencePoints = [
        {
          x: 475,
          y: 294,
          title: 'London',
          latitude: 51.5002,
          longitude: -0.1262,
        },
        {
          x: 510,
          y: 275,
          title: 'Copenhagen',
          latitude: 55.6763,
          longitude: 12.5681,
        },
        {
          x: 487,
          y: 297,
          title: 'Brussels',
          latitude: 50.8371,
          longitude: 4.3676,
        },
        {
          x: 481,
          y: 306,
          title: 'Paris',
          latitude: 48.8567,
          longitude: 2.351,
        },
        {
          x: 414,
          y: 227,
          title: 'Reykjavik',
          latitude: 64.1353,
          longitude: -21.8952,
        },
        {
          x: 580,
          y: 275,
          title: 'Moscow',
          latitude: 55.7558,
          longitude: 37.6176,
        },
        {
          x: 465,
          y: 340,
          title: 'Madrid',
          latitude: 40.4167,
          longitude: -3.7033,
        },
        {
          x: 690,
          y: 380,
          title: 'New Delhi',
          latitude: 28.6353,
          longitude: 77.225,
        },
        {
          x: 867,
          y: 356,
          r: 0.2,
          title: 'Tokyo',
          latitude: 35.6785,
          longitude: 139.6823,
        },
        {
          x: 259,
          y: 345,
          title: 'Washington',
          latitude: 38.8921,
          longitude: -77.0241,
        },
        {
          x: 881.5,
          y: 577,
          title: 'Melbourne',
          latitude: -37.813629,
          longitude: 144.963058,
        },
      ];

      it('should parse longitude & latidute to x & y values', () => {
        const parser = service.useVectorMapParser('json');

        const isValueCorrect = (value, reference, margin = 2) => {
          return value >= reference - margin && value <= reference + margin;
        };
        referencePoints
          .map((point) => parser.getMapCoordinates(point.latitude, point.longitude))
          .forEach((point, i) => {
            expect(isValueCorrect(point.x, referencePoints[i].x)).toBe(true);
            expect(isValueCorrect(point.y, referencePoints[i].y)).toBe(true);
          });
      });
    });
  });

  describe('charts', () => {
    describe('JSON', () => {
      const format = 'json';
      const data = dataJSON;

      it('should return datasets & labels based on a data (selected keys excluded)', () => {
        const parser = service.useChartParser(format, {
          datasetLabel: 'Country',
          ignoreKeys: ['Country', 'Country_Code'],
        });

        const { datasets, labels } = parser.parse(data);

        expect(labels.length).toBe(57);
        expect(labels[0]).toEqual('Year_1960');
        expect(labels[1]).toEqual('Year_1961');
        expect(labels[2]).toEqual('Year_1962');
        expect(labels[3]).toEqual('Year_1963');
        expect(labels[56]).toEqual('Year_2016');

        expect(datasets.length).toBe(5);

        const [dataset] = datasets;

        expect(dataset.label).toEqual('Aruba');
        expect(dataset.data[0]).toEqual(54211);
        expect(dataset.data[1]).toEqual(55438);
        expect(dataset.data[2]).toEqual(56225);
        expect(dataset.data[3]).toEqual(56695);
        expect(dataset.data[56]).toEqual(104822);
      });

      it('should return datasets & labels based on a data (row intervals & selected keys)', () => {
        const parser = service.useChartParser(format, {
          datasetLabel: 'Country',
          rows: { start: 1, end: 3 },
          keys: ['Year_1968', 'Year_1969'],
        });

        const { datasets, labels } = parser.parse(data);

        expect(labels.length).toBe(2);
        expect(labels[0]).toEqual('Year_1968');
        expect(labels[1]).toEqual('Year_1969');

        expect(datasets.length).toBe(2);

        const [firstDataset, secondDataset] = datasets;

        expect(firstDataset.label).toEqual('Afghanistan');
        expect(firstDataset.data[0]).toEqual(10604346);
        expect(firstDataset.data[1]).toEqual(10854428);

        expect(secondDataset.label).toEqual('Angola');
        expect(secondDataset.data[0]).toEqual(6523791);
        expect(secondDataset.data[1]).toEqual(6642632);
      });

      it('should return datasets & labels based on a data (row indexes and selected keys)', () => {
        const parser = service.useChartParser(format, {
          datasetLabel: 'Country',
          rows: { indexes: [1, 2] },
          keys: ['Year_1968', 'Year_1969'],
        });

        const { datasets, labels } = parser.parse(data);

        expect(labels.length).toBe(2);
        expect(labels[0]).toEqual('Year_1968');
        expect(labels[1]).toEqual('Year_1969');

        expect(datasets.length).toBe(2);

        const [firstDataset, secondDataset] = datasets;

        expect(firstDataset.label).toEqual('Afghanistan');
        expect(firstDataset.data[0]).toEqual(10604346);
        expect(firstDataset.data[1]).toEqual(10854428);

        expect(secondDataset.label).toEqual('Angola');
        expect(secondDataset.data[0]).toEqual(6523791);
        expect(secondDataset.data[1]).toEqual(6642632);
      });

      it('should assign colors to datasets', () => {
        const parser = service.useChartParser(format, {
          datasetLabel: 'Country',
          rows: { indexes: [1, 2] },
          keys: ['Year_1968', 'Year_1969'],
          color: 100,
        });

        const { datasets } = parser.parse(data);

        const [firstDataset, secondDataset] = datasets;

        expect(firstDataset.color).toEqual('#FFCDD2');

        expect(secondDataset.color).toEqual('#F8BBD0');
      });

      it('should create dataset based on two values (bubble chart, scatter chart)', () => {
        const data = [
          {
            value1: 12,
            value2: 13,
            label: 'Point 1',
          },
          {
            value1: 10,
            value2: 14,
            label: 'Point 2',
          },
        ];

        const parser = service.useChartParser(format, {
          datasetLabel: 'label',
          getCoordinates: ({ value1, value2 }) => {
            return {
              x: value1,
              y: value2,
              r: (value1 + value2) / 2,
            };
          },
        });

        const { datasets } = parser.parse(data);

        expect(datasets.length).toBe(2);

        const [firstDataset, secondDataset] = datasets;

        expect(firstDataset.label).toEqual('Point 1');
        expect(firstDataset.data[0].x).toEqual(12);
        expect(firstDataset.data[0].y).toEqual(13);
        expect(firstDataset.data[0].r).toEqual(12.5);

        expect(secondDataset.label).toEqual('Point 2');
        expect(secondDataset.data[0].x).toEqual(10);
        expect(secondDataset.data[0].y).toEqual(14);
        expect(secondDataset.data[0].r).toEqual(12);
      });

      it('should return correct min and max values from given field', () => {
        const parser = service.useDatatableParser(format);
        const { min, max } = parser.getValueExtrema(data, 'Year_1990');
        expect(min).toEqual(54509);
        expect(max).toEqual(12249114);
      });
    });

    describe('CSV', () => {
      const format = 'csv';
      const data = dataCSV;

      it('should return datasets & labels based on a data (header at 0 index)', () => {
        const parser = service.useChartParser(format, {
          datasetLabel: 0,
          labelsIndex: 0,
          rows: { start: 1 },
          columns: { start: 2 },
        });

        const { datasets, labels } = parser.parse(data);

        expect(labels.length).toBe(57);
        expect(labels[0]).toEqual('Year_1960');
        expect(labels[1]).toEqual('Year_1961');
        expect(labels[2]).toEqual('Year_1962');
        expect(labels[3]).toEqual('Year_1963');
        expect(labels[56]).toEqual('Year_2016');

        expect(datasets.length).toBe(5);

        const [firstDataset] = datasets;

        expect(firstDataset.label).toEqual('Aruba');
        expect(firstDataset.data[0]).toEqual(54211);
        expect(firstDataset.data[1]).toEqual(55438);
        expect(firstDataset.data[2]).toEqual(56225);
        expect(firstDataset.data[3]).toEqual(56695);
        expect(firstDataset.data[56]).toEqual(104822);
      });

      it('should return datasets & labels based on a data (rows & columns intervals)', () => {
        const parser = service.useChartParser(format, {
          datasetLabel: 0,
          labelsIndex: 0,
          rows: { start: 2, end: 4 },
          columns: { start: 10, end: 12 },
        });

        const { datasets, labels } = parser.parse(data);

        expect(labels.length).toBe(2);
        expect(labels[0]).toEqual('Year_1968');
        expect(labels[1]).toEqual('Year_1969');

        expect(datasets.length).toBe(2);

        const [firstDataset, secondDataset] = datasets;

        expect(firstDataset.label).toEqual('Afghanistan');
        expect(firstDataset.data[0]).toEqual(10604346);
        expect(firstDataset.data[1]).toEqual(10854428);

        expect(secondDataset.label).toEqual('Angola');
        expect(secondDataset.data[0]).toEqual(6523791);
        expect(secondDataset.data[1]).toEqual(6642632);
      });

      it('should return datasets & labels based on a data (rows & columns indexes)', () => {
        const parser = service.useChartParser(format, {
          datasetLabel: 0,
          labelsIndex: 0,
          rows: { indexes: [2, 3] },
          columns: { indexes: [10, 11] },
        });

        const { datasets, labels } = parser.parse(data);

        expect(labels.length).toBe(2);
        expect(labels[0]).toEqual('Year_1968');
        expect(labels[1]).toEqual('Year_1969');

        expect(datasets.length).toBe(2);

        const [firstDataset, secondDataset] = datasets;

        expect(firstDataset.label).toEqual('Afghanistan');
        expect(firstDataset.data[0]).toEqual(10604346);
        expect(firstDataset.data[1]).toEqual(10854428);

        expect(secondDataset.label).toEqual('Angola');
        expect(secondDataset.data[0]).toEqual(6523791);
        expect(secondDataset.data[1]).toEqual(6642632);
      });

      it('should assign colors to datasets', () => {
        const parser = service.useChartParser(format, {
          datasetLabel: 0,
          labelsIndex: 0,
          rows: { indexes: [1, 2] },
          keys: ['Year_1968', 'Year_1969'],
          color: 200,
        });

        const { datasets } = parser.parse(data);

        const [firstDataset, secondDataset] = datasets;

        expect(firstDataset.color).toEqual('#EF9A9A');

        expect(secondDataset.color).toEqual('#F48FB1');
      });

      it('should create dataset based on two values (bubble chart, scatter chart)', () => {
        const data = `value1,value2,label
          12,13,Point 1
          10,14,Point 2`;

        const parser = service.useChartParser(format, {
          datasetLabel: 2,
          labelsIndex: 0,
          rows: {
            start: 1,
          },
          getCoordinates: (entry) => {
            return {
              x: entry[0],
              y: entry[1],
              r: (entry[0] + entry[1]) / 2,
            };
          },
        });

        const { datasets } = parser.parse(data);

        expect(datasets.length).toBe(2);

        const [firstDataset, secondDataset] = datasets;

        expect(firstDataset.label).toEqual('Point 1');
        expect(firstDataset.data[0].x).toEqual(12);
        expect(firstDataset.data[0].y).toEqual(13);
        expect(firstDataset.data[0].r).toEqual(12.5);

        expect(secondDataset.label).toEqual('Point 2');
        expect(secondDataset.data[0].x).toEqual(10);
        expect(secondDataset.data[0].y).toEqual(14);
        expect(secondDataset.data[0].r).toEqual(12);
      });

      it('should return correct min and max values from third column', () => {
        const parser = service.useDatatableParser(format);
        const { min, max } = parser.getValueExtrema(data, 2);
        expect(min).toEqual(13411);
        expect(max).toEqual(8996351);
      });
    });
  });

  describe('treeview', () => {
    describe('JSON', () => {
      const data = [
        { text: 'One' },
        { text: 'Two' },
        {
          text: 'Three',
          isShown: true,
          arrow: '<i class="fas fa-angle-double-right"></i>',
          nextLevel: [{ text: 'Second-one', isDisabled: true }, { text: 'Second-two' }],
        },
      ];

      it('should properly parse data', () => {
        const parser = service.useTreeviewParser({
          name: 'text',
          show: (el) => (el['isShown'] ? el['isShown'] : false),
          children: 'nextLevel',
          icon: (el) => (el['arrow'] ? el['arrow'] : null),
          disabled: (el) => (el['isDisabled'] ? el['isDisabled'] : false),
        });

        const [firstNode, secondNode, thirdNode] = parser.parse(data);

        expect(firstNode.name).toEqual('One');
        expect(secondNode.name).toEqual('Two');
        expect(thirdNode.name).toEqual('Three');
        expect(thirdNode.icon).toEqual('<i class="fas fa-angle-double-right"></i>');
        expect(thirdNode.show).toEqual(true);
        expect(thirdNode.children.length).toBe(2);
      });
    });
  });

  describe('utils', () => {
    describe('array methods', () => {
      it('should return flatten array', () => {
        const array1 = [1, [2, [3, [4]], 5]];
        const array2 = [1, 2, 3, 4, 5];
        const array3 = ['one', 'two', 'three', 'four', 'five'];
        const array4 = ['one', ['two', 'three', ['four', ['five']]]];

        expect(service.flattenDeep(array1)).toEqual([1, 2, 3, 4, 5]);
        expect(service.flattenDeep(array2)).toEqual([1, 2, 3, 4, 5]);
        expect(service.flattenDeep(array3)).toEqual(['one', 'two', 'three', 'four', 'five']);
        expect(service.flattenDeep(array4)).toEqual(['one', 'two', 'three', 'four', 'five']);
      });

      it('should remove particular items from the array', () => {
        const array1 = ['a', 'b', 'c', 'a', 'b', 'c'];
        const array2 = [1, 2, 1, 3, 5, 2, 1];

        expect(service.pullAll(array1, ['a', 'c'])).toEqual(['b', 'b']);
        expect(service.pullAll(array1, [])).toEqual(array1);
        expect(service.pullAll(array2, [])).toEqual(array2);
        expect(service.pullAll(array2, [1])).toEqual([2, 3, 5, 2]);
      });

      it('should return particular amount of items from the start of an array', () => {
        const array1 = [1, [2, [3, [4]], 5]];
        const array2 = [1, 2, 3, 4, 5];

        expect(service.take(array1)).toEqual([1]);
        expect(service.take(array1, 2)).toEqual(array1);
        expect(service.take(array1, 10)).toEqual(array1);
        expect(service.take(array2, 3)).toEqual([1, 2, 3]);
      });

      it('should return particular amount of items from the end of an array', () => {
        const array1 = [1, [2, [3, [4]], 5]];
        const array2 = [1, 2, 3, 4, 5];

        expect(service.takeRight(array1)).toEqual([[2, [3, [4]], 5]]);
        expect(service.takeRight(array1, 2)).toEqual(array1);
        expect(service.takeRight(array1, 10)).toEqual(array1);
        expect(service.takeRight(array2, 3)).toEqual([3, 4, 5]);
      });

      it('should join many arrays into one', () => {
        const arr1 = [1, 2];
        const arr2 = [3, ['four', [5]]];
        const arr3 = 'six';

        expect(service.union(arr1, arr2, arr3)).toEqual([1, 2, 3, 'four', 5, 'six']);
      });

      it('should join many arrays using additional criterium', () => {
        const arr1 = [2.1];
        const arr2 = [1.2, 2.3];
        const arr3 = [{ x: 1 }];
        const arr4 = [{ x: 2 }, { x: 1 }];

        expect(service.unionBy(Math.floor, arr1, arr2)).toEqual([2.1, 1.2]);
        expect(service.unionBy('x', arr3, arr4)).toEqual([{ x: 1 }, { x: 2 }]);
      });

      it('should remove duplicates from an array', () => {
        const arr1 = [1, 2, 1, 3];
        const arr2 = ['one', 'two', 'one'];

        expect(service.uniq(arr1)).toEqual([1, 2, 3]);
        expect(service.uniq(arr2)).toEqual(['one', 'two']);
      });

      it('should remove duplicates from an array using additional criterium', () => {
        const arr1 = [2.1, 1.2, 2.3];
        const arr2 = [{ x: 1 }, { x: 2 }, { x: 1 }];

        expect(service.uniqBy(Math.floor, arr1)).toEqual([2.1, 1.2]);
        expect(service.uniqBy('x', arr2)).toEqual([{ x: 1 }, { x: 2 }]);
      });

      it('should zip arrays making array of first elements, array of second elements etc', () => {
        const arr1 = ['a', 'b'];
        const arr2 = [1, 2];
        const arr3 = [true, false];
        const arr4 = ['one', 'two', 'three'];

        expect(service.zip(arr1, arr2, arr3)).toEqual([
          ['a', 1, true],
          ['b', 2, false],
        ]);
        expect(service.zip(arr1, arr2, arr3, arr4)).toEqual([
          ['a', 1, true, 'one'],
          ['b', 2, false, 'two'],
          [undefined, undefined, undefined, 'three'],
        ]);
      });

      it('should zip arrays into object using first array values as a key and second one as a values', () => {
        const arr1 = ['a', 'b'];
        const arr2 = [1, 2];

        expect(service.zipObject(arr1, arr2)).toEqual({ a: 1, b: 2 });
      });
    });

    describe('collection methods', () => {
      it('should take result of value parameter made on every element, use it as a key and count amount of items with the same result', () => {
        const arr1 = [6.1, 4.2, 6.3];
        const arr2 = ['one', 'two', 'three'];
        const arr3 = { x: 1.2, y: 2.1, z: 1.4 };
        const arr4 = { x: 'one', y: 'two', z: 'three', a: 'one' };

        expect(service.countBy(arr1, Math.floor)).toEqual({ 6: 2, 4: 1 });
        expect(service.countBy(arr2, 'length')).toEqual({ 3: 2, 5: 1 });
        expect(service.countBy(arr3, Math.floor)).toEqual({ 1: 2, 2: 1 });
        expect(service.countBy(arr4, 'length')).toEqual({ 3: 3, 5: 1 });
      });

      it('should take result of value parameter made on every element, use it as a key and set an array with elements of the same result as a value', () => {
        const arr1 = [6.1, 4.2, 6.3];
        const arr2 = ['one', 'two', 'three'];
        const arr3 = { x: 1.2, y: 2.1, z: 1.4 };
        const arr4 = { x: 'one', y: 'two', z: 'three', a: 'one' };

        expect(service.groupBy(arr1, Math.floor)).toEqual({ 6: [6.1, 6.3], 4: [4.2] });
        expect(service.groupBy(arr2, 'length')).toEqual({ 3: ['one', 'two'], 5: ['three'] });
        expect(service.groupBy(arr3, Math.floor)).toEqual({ 1: [1.2, 1.4], 2: [2.1] });
        expect(service.groupBy(arr4, 'length')).toEqual({
          3: ['one', 'two', 'one'],
          5: ['three'],
        });
      });

      it('should sort objects and arrays by values passed to the function', () => {
        const users = [
          { user: 'fred', age: 48, num: 1 },
          { user: 'barney', age: 36, num: 2 },
          { user: 'fred', age: 40, num: 5 },
          { user: 'barney', age: 34, num: 4 },
        ];

        const nums = [3, 5, 6, 2, 3, 1];
        const words = ['one', 'two', 'three', 'four'];

        const numsObj = {
          a: 3,
          b: 5,
          c: 2,
          d: 1,
          e: 7,
        };

        var wordsObj = {
          f: 'one',
          g: 'two',
          h: 'three',
          i: 'four',
          j: 'five',
        };

        expect(service.sortBy(users, ['user', 'age'])).toEqual([
          { user: 'barney', age: 34, num: 4 },
          { user: 'barney', age: 36, num: 2 },
          { user: 'fred', age: 40, num: 5 },
          { user: 'fred', age: 48, num: 1 },
        ]);

        expect(service.sortBy(users, ['user'])).toEqual([
          { user: 'barney', age: 34, num: 4 },
          { user: 'barney', age: 36, num: 2 },
          { user: 'fred', age: 40, num: 5 },
          { user: 'fred', age: 48, num: 1 },
        ]);

        expect(service.sortBy(users, (o) => o.age)).toEqual([
          { user: 'barney', age: 34, num: 4 },
          { user: 'barney', age: 36, num: 2 },
          { user: 'fred', age: 40, num: 5 },
          { user: 'fred', age: 48, num: 1 },
        ]);

        expect(service.sortBy(words)).toEqual(['four', 'one', 'three', 'two']);

        expect(service.sortBy(nums)).toEqual([1, 2, 3, 3, 5, 6]);

        expect(service.sortBy(numsObj)).toEqual([1, 2, 3, 5, 7]);

        expect(service.sortBy(wordsObj)).toEqual(['five', 'four', 'one', 'three', 'two']);
      });

      it('should sort array or object elements with provided order', () => {
        const users = [
          { user: 'fred', age: 48, num: 1 },
          { user: 'barney', age: 36, num: 2 },
          { user: 'fred', age: 40, num: 5 },
          { user: 'barney', age: 34, num: 4 },
        ];

        const nums = [3, 5, 6, 2, 3, 1];
        const words = ['one', 'two', 'three', 'four'];

        const numsObj = {
          a: 3,
          b: 5,
          c: 2,
          d: 1,
          e: 7,
        };

        var wordsObj = {
          f: 'one',
          g: 'two',
          h: 'three',
          i: 'four',
          j: 'five',
        };

        expect(service.orderBy(users, ['user', 'age'], ['asc', 'asc'])).toEqual([
          { user: 'barney', age: 34, num: 4 },
          { user: 'barney', age: 36, num: 2 },
          { user: 'fred', age: 40, num: 5 },
          { user: 'fred', age: 48, num: 1 },
        ]);

        expect(service.orderBy(users, ['user', 'age'])).toEqual([
          { user: 'barney', age: 34, num: 4 },
          { user: 'barney', age: 36, num: 2 },
          { user: 'fred', age: 40, num: 5 },
          { user: 'fred', age: 48, num: 1 },
        ]);

        expect(service.orderBy(users, ['user', 'age'], ['asc', 'desc'])).toEqual([
          { user: 'barney', age: 36, num: 2 },
          { user: 'barney', age: 34, num: 4 },
          { user: 'fred', age: 48, num: 1 },
          { user: 'fred', age: 40, num: 5 },
        ]);

        expect(service.orderBy(words, 'desc')).toEqual(['two', 'three', 'one', 'four']);
        expect(service.orderBy(words, ['desc'])).toEqual(['two', 'three', 'one', 'four']);

        expect(service.orderBy(nums, 'desc')).toEqual([6, 5, 3, 3, 2, 1]);

        expect(service.orderBy(numsObj, 'desc')).toEqual([7, 5, 3, 2, 1]);

        expect(service.orderBy(wordsObj, 'desc')).toEqual(['two', 'three', 'one', 'four', 'five']);
      });
    });

    describe('object methods', () => {
      it('should invert object keys with values and skip duplicates', () => {
        const object = { a: 1, b: 2, c: 3 };
        const object2 = { a: 1, b: 2, c: 1 };
        const object3 = { a: 1, b: 1, c: 1 };
        const object4 = { 1: 'a', 2: 'b', 3: 'a' };

        expect(service.invert(object)).toEqual({ '1': 'a', '2': 'b', '3': 'c' });
        expect(service.invert(object2)).toEqual({ '1': 'c', '2': 'b' });
        expect(service.invert(object3)).toEqual({ '1': 'c' });
        expect(service.invert(object4)).toEqual({ a: '3', b: '2' });
      });

      it('should invert object keys with values and push values to the array if value already exists', () => {
        const object = { a: 1, b: 2, c: 3 };
        const object2 = { a: 1, b: 2, c: 1 };
        const object3 = { a: 1, b: 1, c: 1 };
        const object4 = { 1: 'a', 2: 'b', 3: 'a' };

        expect(service.invertBy(object)).toEqual({ '1': ['a'], '2': ['b'], '3': ['c'] });
        expect(service.invertBy(object2)).toEqual({ '1': ['a', 'c'], '2': ['b'] });
        expect(service.invertBy(object3)).toEqual({ '1': ['a', 'b', 'c'] });
        expect(service.invertBy(object4)).toEqual({ a: ['1', '3'], b: ['2'] });
        expect(service.invertBy(object2, (value) => `group${value}`)).toEqual({
          group1: ['a', 'c'],
          group2: ['b'],
        });
      });

      it('should return object without particular elements', () => {
        const object = { a: 1, b: '2', c: 3 };

        expect(service.omit(object, ['a', 'c'])).toEqual({ b: '2' });
        expect(service.omit(object, ['a'])).toEqual({ b: '2', c: 3 });
        expect(service.omit(object, 'a')).toEqual({ b: '2', c: 3 });
      });

      it('should return object without ones that doesnt match the function result', () => {
        const object = { a: 1, b: '2', c: 3 };

        expect(service.omitBy(object, (item) => typeof item !== 'number')).toEqual({
          a: 1,
          c: 3,
        });
        expect(service.omitBy(object, (item) => typeof item === 'number')).toEqual({ b: '2' });
      });

      it('should pick particular elements from object', () => {
        const object = { a: 1, b: '2', c: 3 };

        expect(service.pick(object, ['a', 'c'])).toEqual({ a: 1, c: 3 });
        expect(service.pick(object, ['a'])).toEqual({ a: 1 });
        expect(service.pick(object, 'a')).toEqual({ a: 1 });
      });

      it('should pick elements from object that match the function result', () => {
        const object = { a: 1, b: '2', c: 3 };

        expect(service.pickBy(object, (item) => typeof item !== 'number')).toEqual({ b: '2' });
        expect(service.pickBy(object, (item) => typeof item === 'number')).toEqual({
          a: 1,
          c: 3,
        });
      });

      it('should transform object', () => {
        const object = { a: 1, b: 2, c: 1 };

        expect(
          service.transform(
            { a: 1, b: 2, c: 1 },
            function (result, value, key) {
              (result[value] || (result[value] = [])).push(key);
            },
            {}
          )
        ).toEqual({ '1': ['a', 'c'], '2': ['b'] });

        expect(
          service.transform(
            { a: 1, b: 2, c: 1 },
            (result, value, key) => {
              result[value] = key;
            },
            {}
          )
        ).toEqual({ '1': 'c', '2': 'b' });
      });
    });
  });
});
