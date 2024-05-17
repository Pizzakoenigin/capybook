import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { MdbOrganizationChartComponent } from './organization-chart.component';
import { MdbOrganizationChartModule } from './organization-chart.module';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'mdb-test-organization-chart',
  template: `<mdb-organization-chart
    [data]="chartData"
    [switchHeaderText]="false"
  ></mdb-organization-chart> `,
})
class DefaultOrganizationChartComponent {
  @ViewChild(MdbOrganizationChartComponent) organizationChart: MdbOrganizationChartComponent;

  chartData = {
    name: 'Walter White',
    label: 'CEO',
    avatar: 'https://mdbootstrap.com/img/new/avatars/1.jpg',
    children: [
      {
        name: 'Jon Snow',
        label: 'SCEO',
        avatar: 'https://mdbootstrap.com/img/new/avatars/2.jpg',
        children: [
          {
            label: 'Tax',
          },
          {
            label: 'Legal',
          },
        ],
      },
      {
        label: 'COO',
        name: 'Jimmy McGill',
        avatar: 'https://mdbootstrap.com/img/new/avatars/3.jpg',
        children: [
          {
            label: 'Operations',
            avatar: 'https://mdbootstrap.com/img/new/avatars/4.jpg',
            name: 'Kim Wexler',
          },
        ],
      },
      {
        label: 'CTO',
        name: 'Pam Beesly',
        avatar: 'https://mdbootstrap.com/img/new/avatars/5.jpg',
        children: [
          {
            label: 'Development',
            name: 'Rachel Green',
            avatar: 'https://mdbootstrap.com/img/new/avatars/6.jpg',
            children: [
              {
                label: 'Analysis',
                name: 'Phoebe Buffay',
                avatar: 'https://mdbootstrap.com/img/new/avatars/7.jpg',
              },
              {
                label: 'Front End',
              },
              {
                label: 'Back End',
                name: 'Michael Scott',
                avatar: 'https://mdbootstrap.com/img/new/avatars/8.jpg',
              },
            ],
          },
          {
            label: 'QA',
          },
          {
            label: 'R&D',
            name: 'Monica Geller',
            avatar: 'https://mdbootstrap.com/img/new/avatars/9.jpg',
          },
        ],
      },
    ],
  };
}

describe('MdbOrganizationChartComponent', () => {
  let fixture: ComponentFixture<DefaultOrganizationChartComponent>;
  let element: any;
  let component: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DefaultOrganizationChartComponent],
      imports: [MdbOrganizationChartModule],
    });
    fixture = TestBed.createComponent(DefaultOrganizationChartComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create as many tables as nodes', () => {
    const tables = fixture.debugElement.queryAll(By.css('table'));
    expect(tables.length).toEqual(13);
  });

  it('should hide children elements after clicking icon', () => {
    const hiddenTr = fixture.debugElement.query(By.css('.organization-chart-lines-top'));
    expect(hiddenTr.nativeElement.classList.contains('organization-chart-hide')).toBe(false);
    const icon = document.querySelector('a');
    icon.click();
    fixture.detectChanges();
    expect(hiddenTr.nativeElement.classList.contains('organization-chart-hide')).toBe(true);
  });

  it('should create normal element', () => {
    const labelData = 'CTO';
    component.chartData = { label: labelData };
    fixture.detectChanges();

    const nodeContent = fixture.debugElement.query(By.css('.organization-chart-node'));
    expect(nodeContent).toBeTruthy();

    const labelText = nodeContent.query(By.css('p'));
    expect(labelText.nativeElement.innerHTML).toBe(labelData);
  });

  it('should create advanced template', () => {
    const nameData = 'John Doe';
    const labelData = 'CTO';
    component.chartData = { label: labelData, name: nameData };
    fixture.detectChanges();

    const nodeContent = fixture.debugElement.query(By.css('.card'));
    expect(nodeContent).toBeTruthy();

    const labelName = fixture.debugElement.query(By.css('.card-text'));
    expect(labelName.nativeElement.innerHTML.trim()).toBe(nameData);

    const labelText = fixture.debugElement.query(By.css('.card-header'));
    expect(labelText.nativeElement.innerHTML.trim()).toBe(labelData);
  });

  it('should switch label with name in card header when switchHeaderText input is set to true', () => {
    let headerElement = fixture.debugElement.query(By.css('.card-header'));
    expect(headerElement.nativeElement.innerHTML.trim()).toBe('CEO');

    component.organizationChart.switchHeaderText = true;
    fixture.detectChanges();

    expect(headerElement.nativeElement.innerHTML.trim()).toBe('Walter White');
  });
});
