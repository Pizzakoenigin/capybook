import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { MdbTreeTableModule } from './treetable.module';
import { MdbTreeTableDirective } from './treetable.directive';

interface FileType {
  name: string;
  size: string;
  type: string;
  children?: FileType[];
}
@Component({
  selector: 'test-mdbTreeTable',
  template: `
    <div class="treetable d-flex w-100">
      <table
        class="table"
        mdbTreeTable
        #treeTable="mdbTreeTable"
        [dataSource]="dataSource"
        (collapse)="onRowCollapse($event)"
        (expand)="onRowExpand($event)"
      >
        <thead>
          <tr>
            <th scope="col" *ngFor="let header of headers">{{ header | titlecase }}</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let rowData of treeTable.data" scope="row" [mdbTreeTableRow]="rowData">
            <td>
              {{ rowData.name }}
            </td>
            <td>
              {{ rowData.size }}
            </td>
            <td>
              {{ rowData.type }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
})
class TestMdbTreeTableComponent {
  @ViewChild(MdbTreeTableDirective) treeTable: MdbTreeTableDirective<FileType>;

  headers = ['Name', 'Size', 'Type'];

  dataSource: FileType[] = [
    {
      name: 'Personal',
      size: '15mb',
      type: 'Folder',
      children: [
        {
          name: 'index',
          size: '5mb',
          type: 'html',
        },
        {
          name: 'index',
          size: '5mb',
          type: 'html',
        },
        {
          name: 'my-cat',
          size: '0mb',
          type: 'webp',
        },
        {
          name: 'Documents',
          size: '350mb',
          type: 'Folder',
          children: [
            {
              name: 'Bill',
              size: '200mb',
              type: 'pdf',
            },
            {
              name: 'Newspapers mentions',
              size: '50mb',
              type: 'PDF',
            },
            {
              name: 'Ebooks',
              size: '100mb',
              type: 'zip',
            },
          ],
        },
        {
          name: 'Songs',
          size: '30mb',
          type: 'Folder',
          children: [
            {
              name: 'Ode to JS',
              size: '10mb',
              type: 'mp3',
            },
            {
              name: 'One more style',
              size: '10mb',
              type: 'mp3',
            },
            {
              name: 'Bjork-Its-Oh-So-Quiet',
              size: '10mb',
              type: 'mp3',
            },
          ],
        },
      ],
    },
    {
      name: 'Images',
      size: '1,5gb',
      type: 'Folder',
      children: [
        {
          name: 'Album-cover',
          size: '5mb',
          type: 'html',
        },
        {
          name: 'Naruto-background',
          size: '500mb',
          type: 'jpeg',
        },
        {
          name: 'Sasuke-background',
          size: '500mb',
          type: 'png',
        },
      ],
    },
  ];

  onRowCollapse(rowData: FileType): void {}

  onRowExpand(rowData: FileType): void {}
}

describe('MDB Table', () => {
  let fixture: ComponentFixture<TestMdbTreeTableComponent>;
  let component: any;
  let treeTableDirective: MdbTreeTableDirective;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestMdbTreeTableComponent],
      imports: [MdbTreeTableModule],
      teardown: { destroyAfterEach: false },
    });

    fixture = TestBed.createComponent(TestMdbTreeTableComponent);
    fixture.detectChanges();

    component = fixture.componentInstance;
    treeTableDirective = component.treeTable;
  });

  it('should generate table with proper amount of rows', () => {
    fixture.detectChanges();
    const rows = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(rows.length).toBe(16);
  });

  it('should add toggle button to rows with children', () => {
    fixture.detectChanges();

    const tableRows = fixture.debugElement.queryAll(By.css('.treetable tbody tr'));

    tableRows.forEach((row, index) => {
      const rowData = treeTableDirective.data[index];
      if (rowData.children) {
        const firstCell = row.nativeElement.cells[0];
        const toggleButton = firstCell.querySelector('button');
        expect(toggleButton).toBeTruthy();
      }
    });
  });

  it('should add proper padding to td elements', () => {
    fixture.detectChanges();

    const tableRows = fixture.debugElement.queryAll(By.css('.treetable tbody tr'));
    const paddingValue = 25;

    tableRows.forEach((row, index) => {
      const rowData = treeTableDirective.data[index];
      const firstCell = row.nativeElement.cells[0] as HTMLTableCellElement;
      expect(firstCell.style.paddingLeft).toBe(`${rowData.dataDepth * paddingValue}px`);
    });
  });

  it('should wrap td content in divs', () => {
    fixture.detectChanges();

    const tableRows = fixture.debugElement.queryAll(By.css('.treetable tbody tr'));

    tableRows.forEach((row) => {
      const tdElements = row.queryAll(By.css('td'));

      tdElements.forEach((td) => {
        expect(td.nativeElement.innerHTML).toContain('<div>');
      });
    });
  });

  it('should toggle row and its children on toggle button click', () => {
    fixture.detectChanges();

    const tableRows = fixture.debugElement.queryAll(By.css('.treetable tbody tr'));
    const toggleButton = tableRows[0].query(By.css('.btn'));

    expect(tableRows[0].classes.hidden).toBeFalsy();
    expect(tableRows[1].classes.hidden).toBeFalsy();
    expect(tableRows[2].classes.hidden).toBeFalsy();
    expect(tableRows[3].classes.hidden).toBeFalsy();
    expect(tableRows[4].classes.hidden).toBeFalsy();
    expect(tableRows[5].classes.hidden).toBeFalsy();
    expect(tableRows[6].classes.hidden).toBeFalsy();
    expect(tableRows[7].classes.hidden).toBeFalsy();
    expect(tableRows[8].classes.hidden).toBeFalsy();
    expect(tableRows[9].classes.hidden).toBeFalsy();
    expect(tableRows[10].classes.hidden).toBeFalsy();
    expect(tableRows[11].classes.hidden).toBeFalsy();

    toggleButton.triggerEventHandler('click', null);

    expect(tableRows[0].classes.hidden).toBeFalsy();
    expect(tableRows[1].classes.hidden).toBeTruthy();
    expect(tableRows[2].classes.hidden).toBeTruthy();
    expect(tableRows[3].classes.hidden).toBeTruthy();
    expect(tableRows[4].classes.hidden).toBeTruthy();
    expect(tableRows[5].classes.hidden).toBeTruthy();
    expect(tableRows[6].classes.hidden).toBeTruthy();
    expect(tableRows[7].classes.hidden).toBeTruthy();
    expect(tableRows[8].classes.hidden).toBeTruthy();
    expect(tableRows[9].classes.hidden).toBeTruthy();
    expect(tableRows[10].classes.hidden).toBeTruthy();
    expect(tableRows[11].classes.hidden).toBeTruthy();
  });

  it('should collapse and expand all rows when calling collapseAll and expandAll public methods', () => {
    fixture.detectChanges();

    const tableRows = fixture.debugElement.queryAll(By.css('.treetable tbody tr'));

    expect(tableRows[0].classes.hidden).toBeFalsy();
    expect(tableRows[1].classes.hidden).toBeFalsy();
    expect(tableRows[2].classes.hidden).toBeFalsy();
    expect(tableRows[3].classes.hidden).toBeFalsy();
    expect(tableRows[4].classes.hidden).toBeFalsy();
    expect(tableRows[5].classes.hidden).toBeFalsy();
    expect(tableRows[6].classes.hidden).toBeFalsy();
    expect(tableRows[7].classes.hidden).toBeFalsy();
    expect(tableRows[8].classes.hidden).toBeFalsy();
    expect(tableRows[9].classes.hidden).toBeFalsy();
    expect(tableRows[10].classes.hidden).toBeFalsy();
    expect(tableRows[11].classes.hidden).toBeFalsy();
    expect(tableRows[12].classes.hidden).toBeFalsy();
    expect(tableRows[13].classes.hidden).toBeFalsy();
    expect(tableRows[14].classes.hidden).toBeFalsy();
    expect(tableRows[15].classes.hidden).toBeFalsy();

    treeTableDirective.collapseAll();
    fixture.detectChanges();

    expect(tableRows[0].classes.hidden).toBeFalsy();
    expect(tableRows[1].classes.hidden).toBeTruthy();
    expect(tableRows[2].classes.hidden).toBeTruthy();
    expect(tableRows[3].classes.hidden).toBeTruthy();
    expect(tableRows[4].classes.hidden).toBeTruthy();
    expect(tableRows[5].classes.hidden).toBeTruthy();
    expect(tableRows[6].classes.hidden).toBeTruthy();
    expect(tableRows[7].classes.hidden).toBeTruthy();
    expect(tableRows[8].classes.hidden).toBeTruthy();
    expect(tableRows[9].classes.hidden).toBeTruthy();
    expect(tableRows[10].classes.hidden).toBeTruthy();
    expect(tableRows[11].classes.hidden).toBeTruthy();
    expect(tableRows[12].classes.hidden).toBeFalsy();
    expect(tableRows[13].classes.hidden).toBeTruthy();
    expect(tableRows[14].classes.hidden).toBeTruthy();
    expect(tableRows[15].classes.hidden).toBeTruthy();

    treeTableDirective.expandAll();
    fixture.detectChanges();

    expect(tableRows[0].classes.hidden).toBeFalsy();
    expect(tableRows[1].classes.hidden).toBeFalsy();
    expect(tableRows[2].classes.hidden).toBeFalsy();
    expect(tableRows[3].classes.hidden).toBeFalsy();
    expect(tableRows[4].classes.hidden).toBeFalsy();
    expect(tableRows[5].classes.hidden).toBeFalsy();
    expect(tableRows[6].classes.hidden).toBeFalsy();
    expect(tableRows[7].classes.hidden).toBeFalsy();
    expect(tableRows[8].classes.hidden).toBeFalsy();
    expect(tableRows[9].classes.hidden).toBeFalsy();
    expect(tableRows[10].classes.hidden).toBeFalsy();
    expect(tableRows[11].classes.hidden).toBeFalsy();
    expect(tableRows[12].classes.hidden).toBeFalsy();
    expect(tableRows[13].classes.hidden).toBeFalsy();
    expect(tableRows[14].classes.hidden).toBeFalsy();
    expect(tableRows[15].classes.hidden).toBeFalsy();
  });

  it('should emit proper events when collapsing and expanding rows', () => {
    fixture.detectChanges();

    const spyCollapse = jest.spyOn(treeTableDirective.collapse, 'emit');
    const spyExpand = jest.spyOn(treeTableDirective.expand, 'emit');

    const toggleButtons = fixture.debugElement.queryAll(By.css('.btn.btn-link'));

    // Collapse the first row
    toggleButtons[0].nativeElement.click();
    fixture.detectChanges();

    expect(spyCollapse).toHaveBeenCalledTimes(3);
    expect(spyExpand).toHaveBeenCalledTimes(0);

    // Expand the first row
    toggleButtons[0].nativeElement.click();
    fixture.detectChanges();
    expect(spyCollapse).toHaveBeenCalledTimes(5);
    expect(spyExpand).toHaveBeenCalledTimes(1);
  });
});
