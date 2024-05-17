import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdbChartDirective } from './charts.directive';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@NgModule({
  declarations: [MdbChartDirective],
  imports: [CommonModule],
  exports: [MdbChartDirective],
})
export class MdbChartModule {}
