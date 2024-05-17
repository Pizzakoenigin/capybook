import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MdbOrganizationChartComponent } from './organization-chart.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [MdbOrganizationChartComponent],
  imports: [CommonModule, BrowserAnimationsModule],
  exports: [MdbOrganizationChartComponent],
})
export class MdbOrganizationChartModule {}
