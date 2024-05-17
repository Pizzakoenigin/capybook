import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, inject, TestBed } from '@angular/core/testing';
import { MdbTableModule } from './table.module';
import { MdbCheckboxModule } from 'mdb-angular-ui-kit/checkbox';
import { MdbTableDirective } from './table.directive';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { FormsModule } from '@angular/forms';

import { By } from '@angular/platform-browser';
import { MdbTablePaginationComponent } from './table-pagination.component';
import { MdbTableSortDirective } from './table-sort.directive';
import { MdbTableSortHeaderDirective } from './table-sort-header.component';
import { OverlayContainer } from '@angular/cdk/overlay';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

export interface Person {
  name: string;
  position: string;
  office: string;
  age: number;
  startDate: string;
  salary: string;
}
@Component({
  selector: 'mdb-table-test',
  template: `
    <mdb-form-control>
      <input
        mdbInput
        type="text"
        id="form1"
        class="form-control"
        [(ngModel)]="searchText"
        id="search-input"
      />
      <label mdbLabel class="form-label" for="form1">Search</label>
    </mdb-form-control>
    <div class="datatable mt-4">
      <table
        class="table datatable-table"
        mdbTable
        mdbTableSort
        #table="mdbTable"
        #sort="mdbTableSort"
        [dataSource]="dataSource"
        [pagination]="pagination"
        [sort]="sort"
      >
        <thead class="datatable-header">
          <tr>
            <th
              *ngFor="let header of headers"
              [mdbTableSortHeader]="header.field"
              [disableSort]="header.disableSort"
              scope="col"
            >
              {{ header.label | titlecase }}
            </th>
          </tr>
        </thead>
        <tbody class="datatable-body">
          <tr *ngFor="let data of table.data" scope="row">
            <td>
              {{ data.name }}
            </td>
            <td>
              {{ data.position }}
            </td>
            <td>
              {{ data.office }}
            </td>
            <td>
              {{ data.age }}
            </td>
            <td>
              {{ data.startDate }}
            </td>
            <td>
              {{ data.salary }}
            </td>
          </tr>
        </tbody>
      </table>
      <mdb-table-pagination #pagination></mdb-table-pagination>
    </div>
  `,
})
class TestTableComponent {
  @ViewChild(MdbTableDirective) table: MdbTableDirective<any>;
  @ViewChild(MdbTablePaginationComponent) pagination: MdbTablePaginationComponent;

  headers = [
    { label: 'Name', field: 'name', disableSort: false },
    { label: 'Position', field: 'position', disableSort: false },
    { label: 'Office', field: 'office', disableSort: false },
    { label: 'Age', field: 'age', disableSort: false },
    { label: 'Start Date', field: 'startDate', disableSort: false },
    { label: 'Salary', field: 'salary', disableSort: false },
  ];

  dataSource: Person[] = [
    {
      name: 'Tiger Nixon',
      position: 'System Architect',
      office: 'Edinburgh',
      age: 61,
      startDate: '2011/04/25',
      salary: '$320,800',
    },
    {
      name: 'Sonya Frost',
      position: 'Software Engineer',
      office: 'Edinburgh',
      age: 23,
      startDate: '2008/12/13',
      salary: '$103,600',
    },
    {
      name: 'Jena Gaines',
      position: 'Office Manager',
      office: 'London',
      age: 30,
      startDate: '2008/12/19',
      salary: '$90,560',
    },
    {
      name: 'Quinn Flynn',
      position: 'Support Lead',
      office: 'Edinburgh',
      age: 22,
      startDate: '2013/03/03',
      salary: '$342,000',
    },
    {
      name: 'Charde Marshall',
      position: 'Regional Director',
      office: 'San Francisco',
      age: 36,
      startDate: '2008/10/16',
      salary: '$470,600',
    },
    {
      name: 'Haley Kennedy',
      position: 'Senior Marketing Designer',
      office: 'London',
      age: 43,
      startDate: '2012/12/18',
      salary: '$313,500',
    },
    {
      name: 'Tatyana Fitzpatrick',
      position: 'Regional Director',
      office: 'London',
      age: 19,
      startDate: '2010/03/17',
      salary: '$385,750',
    },
    {
      name: 'Michael Silva',
      position: 'Marketing Designer',
      office: 'London',
      age: 66,
      startDate: '2012/11/27',
      salary: '$198,500',
    },
    {
      name: 'Paul Byrd',
      position: 'Chief Financial Officer (CFO)',
      office: 'New York',
      age: 64,
      startDate: '2010/06/09',
      salary: '$725,000',
    },
    {
      name: 'Gloria Little',
      position: 'Systems Administrator',
      office: 'New York',
      age: 59,
      startDate: '2009/04/10',
      salary: '$237,500',
    },
    {
      name: 'Garrett Winters',
      position: 'Accountant',
      office: 'Tokyo',
      age: 63,
      startDate: '2011/07/25',
      salary: '$170,750',
    },
    {
      name: 'Ashton Cox',
      position: 'Junior Technical Author',
      office: 'San Francisco',
      age: 66,
      startDate: '2009/01/12',
      salary: '$86,000',
    },
    {
      name: 'Cedric Kelly',
      position: 'Senior Javascript Developer',
      office: 'Edinburgh',
      age: 22,
      startDate: '2012/03/29',
      salary: '$433,060',
    },
    {
      name: 'Airi Satou',
      position: 'Accountant',
      office: 'Tokyo',
      age: 33,
      startDate: '2008/11/28',
      salary: '$162,700',
    },
    {
      name: 'Brielle Williamson',
      position: 'Integration Specialist',
      office: 'New York',
      age: 61,
      startDate: '2012/12/02',
      salary: '$372,000',
    },
  ];

  searchText = '';
}

describe('MDB Table', () => {
  let fixture: ComponentFixture<TestTableComponent>;
  let component: TestTableComponent;
  let table: HTMLTableElement;
  let overlayContainer: OverlayContainer;
  let overlayContainerElement: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestTableComponent],
      imports: [
        MdbTableModule,
        MdbCheckboxModule,
        MdbFormsModule,
        FormsModule,
        NoopAnimationsModule,
      ],
      teardown: { destroyAfterEach: false },
    });
    inject([OverlayContainer], (container: OverlayContainer) => {
      overlayContainer = container;
      overlayContainerElement = container.getContainerElement();
    })();

    fixture = TestBed.createComponent(TestTableComponent);
    table = fixture.nativeElement.querySelector('table');
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should generate table', fakeAsync(() => {
    fixture.detectChanges();
    // expect(mdbTable.nativeElement.querySelectorAll('td')).toBe(false);
  }));

  it('pagination should be disabled if disabled input is set to true', () => {
    fixture.detectChanges();

    const selectInputEl = document.querySelector('.select-input.form-control') as HTMLInputElement;
    const leftButton = document.querySelector('.datatable-pagination-left') as HTMLButtonElement;
    const rightButton = document.querySelector('.datatable-pagination-right') as HTMLButtonElement;

    expect(selectInputEl.hasAttribute('disabled')).toBe(false);
    expect(rightButton.classList.contains('disabled')).toBe(false);

    component.pagination.disabled = true;
    fixture.detectChanges();

    expect(selectInputEl.hasAttribute('disabled')).toBe(true);
    expect(leftButton.classList.contains('disabled')).toBe(true);
    expect(rightButton.classList.contains('disabled')).toBe(true);
  });

  it('sorting should be disabled if disableSort input is set to true', () => {
    component.headers[2].disableSort = true;
    fixture.detectChanges();

    const tableSortDirective: MdbTableSortDirective = component.table.sort;
    jest.spyOn(tableSortDirective.sortChange, 'emit');
    const headersElements = fixture.debugElement.queryAll(By.css('.datatable-header th'));
    const thirdHeaderElement = headersElements[2].nativeElement;
    const sortIconElement = thirdHeaderElement.querySelector('.datatable-sort-icon');
    expect(sortIconElement).not.toBeTruthy();

    const thirdHeaderElementStyle = getComputedStyle(thirdHeaderElement);
    expect(thirdHeaderElementStyle.cursor).not.toEqual('pointer');

    thirdHeaderElement.click();
    fixture.detectChanges();
    expect(tableSortDirective.sortChange.emit).not.toHaveBeenCalled();
  });

  it('sorting should toggle only between ascending and descending sorting if forceSort input is set to true', () => {
    fixture.detectChanges();
    const headersElements = fixture.debugElement.queryAll(By.css('.datatable-header th'));
    const secondHeaderElement = headersElements[1].nativeElement as HTMLTableCellElement;
    const secondSortHeaderDirective: MdbTableSortHeaderDirective =
      component.table.sort.headers.get('position');

    // Standard sorting, forceSort = false

    expect(secondSortHeaderDirective.forceSort).toBe(false);
    expect(secondSortHeaderDirective.direction).toBe('none');

    secondHeaderElement.click();
    fixture.detectChanges();

    expect(secondSortHeaderDirective.forceSort).toBe(false);
    expect(secondSortHeaderDirective.direction).toBe('asc');

    secondHeaderElement.click();
    fixture.detectChanges();

    expect(secondSortHeaderDirective.forceSort).toBe(false);
    expect(secondSortHeaderDirective.direction).toBe('desc');

    secondHeaderElement.click();
    fixture.detectChanges();

    expect(secondSortHeaderDirective.forceSort).toBe(false);
    expect(secondSortHeaderDirective.direction).toBe('none');

    // ascending/descending sorting only, forceSort = true

    secondSortHeaderDirective.forceSort = true;
    fixture.detectChanges();

    expect(secondSortHeaderDirective.forceSort).toBe(true);
    expect(secondSortHeaderDirective.direction).toBe('none');

    secondHeaderElement.click();
    fixture.detectChanges();

    expect(secondSortHeaderDirective.forceSort).toBe(true);
    expect(secondSortHeaderDirective.direction).toBe('asc');

    secondHeaderElement.click();
    fixture.detectChanges();

    expect(secondSortHeaderDirective.forceSort).toBe(true);
    expect(secondSortHeaderDirective.direction).toBe('desc');

    secondHeaderElement.click();
    fixture.detectChanges();

    expect(secondSortHeaderDirective.forceSort).toBe(true);
    expect(secondSortHeaderDirective.direction).toBe('asc');
  });
  it('should show all table data when clicked on "ALL" option', fakeAsync(() => {
    component.pagination.showAllEntries = true;
    fixture.detectChanges();

    const paginationSelect = document.querySelector('.select-input') as HTMLInputElement;
    paginationSelect.click();

    fixture.detectChanges();
    flush();

    const options = overlayContainerElement.querySelectorAll(
      'mdb-option'
    ) as NodeListOf<HTMLElement>;
    const lastOptionText = options[4].firstChild.textContent;
    expect(lastOptionText).toBe('All');

    options[4].click();
    fixture.detectChanges();
    flush();

    const tableBody = table.querySelector('tbody') as HTMLTableSectionElement;
    const tableRows = tableBody.querySelectorAll('tr');
    expect(tableRows.length).toBe(15);
  }));
  it('should change "All" option text if allText input is used', fakeAsync(() => {
    component.pagination.showAllEntries = true;
    component.pagination.allText = 'Alles';
    fixture.detectChanges();

    const paginationSelect = document.querySelector('.select-input') as HTMLInputElement;
    paginationSelect.click();

    fixture.detectChanges();
    flush();

    const options = overlayContainerElement.querySelectorAll(
      'mdb-option'
    ) as NodeListOf<HTMLElement>;
    const lastOptionText = options[4].firstChild.textContent;
    expect(lastOptionText).toBe('Alles');
  }));
});
