import { Component, Input, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';

interface MdbOrganizationChartData {
  label: string;
  name?: string;
  avatar?: string;
  children?: MdbOrganizationChartData[];
  visible?: boolean;
}

@Component({
  selector: 'mdb-organization-chart',
  templateUrl: 'organization-chart.component.html',
  animations: [
    trigger('fade', [
      state(
        'hidden',
        style({
          opacity: '0',
          transform: 'translateY(-100px)',
          visibility: 'hidden',
        })
      ),
      state(
        'visible',
        style({
          opacity: '*',
          transform: '*',
          visibility: '*',
        })
      ),
      transition('hidden => *', animate('200ms ease-in')),
      transition('visible => *', animate('200ms ease-out')),
    ]),
  ],
})
export class MdbOrganizationChartComponent implements OnInit {
  @Input() data: MdbOrganizationChartData;

  @Input()
  get switchHeaderText(): boolean {
    return this._switchHeaderText;
  }
  set switchHeaderText(value: boolean) {
    this._switchHeaderText = coerceBooleanProperty(value);
  }
  private _switchHeaderText = false;

  ngOnInit() {
    this.initVisible(this.data);
  }

  toggleFade(data: MdbOrganizationChartData) {
    data.visible = !data.visible;
  }

  initVisible(data: MdbOrganizationChartData) {
    data.visible = true;
    if (data.children) {
      data.children.forEach((child) => this.initVisible(child));
    }
  }

  protected _createArray(length: number) {
    return new Array(length);
  }

  static ngAcceptInputType_switchHeaderText: BooleanInput;
}
