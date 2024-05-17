import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MdbStepComponent } from './step.component';
import { MdbStepperComponent } from './stepper.component';
import { MdbStepIconDirective } from './step-icon.directive';
import { MdbStepHeaderDirective } from './step-header.directive';
import { PortalModule } from '@angular/cdk/portal';

@NgModule({
  declarations: [
    MdbStepperComponent,
    MdbStepComponent,
    MdbStepIconDirective,
    MdbStepHeaderDirective,
  ],
  exports: [MdbStepperComponent, MdbStepComponent, MdbStepIconDirective, MdbStepHeaderDirective],
  imports: [CommonModule, PortalModule],
})
export class MdbStepperModule {}
