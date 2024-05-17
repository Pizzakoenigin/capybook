import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MdbCountdownComponent } from './countdown.component';

@NgModule({
  declarations: [MdbCountdownComponent],
  imports: [CommonModule],
  exports: [MdbCountdownComponent],
})
export class MdbCountdownModule {}
