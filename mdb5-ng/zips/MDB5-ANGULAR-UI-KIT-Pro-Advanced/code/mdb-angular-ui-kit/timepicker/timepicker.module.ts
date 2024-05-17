import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { A11yModule } from '@angular/cdk/a11y';
import { MdbTimepickerToggleComponent } from './timepicker-toggle.component';
import { MdbTimepickerDirective } from './timepicker.directive';
import { MdbTimepickerComponent } from './timepicker.component';
import { MdbTimepickerContentComponent } from './timepicker.content';
import { MdbTimepickerToggleIconDirective } from './timepicker-toggle-icon.directive';
import { PortalModule } from '@angular/cdk/portal';

@NgModule({
  imports: [CommonModule, OverlayModule, A11yModule, PortalModule],
  declarations: [
    MdbTimepickerComponent,
    MdbTimepickerToggleComponent,
    MdbTimepickerDirective,
    MdbTimepickerContentComponent,
    MdbTimepickerToggleIconDirective,
  ],
  exports: [
    MdbTimepickerComponent,
    MdbTimepickerToggleComponent,
    MdbTimepickerDirective,
    MdbTimepickerToggleIconDirective,
  ],
  bootstrap: [MdbTimepickerContentComponent],
})
export class MdbTimepickerModule {}
