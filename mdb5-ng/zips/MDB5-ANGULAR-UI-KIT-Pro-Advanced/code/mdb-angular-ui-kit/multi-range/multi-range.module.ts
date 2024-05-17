import { NgModule } from '@angular/core';
import { MdbMultiRangeComponent } from './multi-range.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MdbMultiRangeThumbDirective } from './multi-range-thumb.directive';

@NgModule({
  declarations: [MdbMultiRangeComponent, MdbMultiRangeThumbDirective],
  imports: [FormsModule, CommonModule],
  exports: [MdbMultiRangeComponent, MdbMultiRangeThumbDirective],
})
export class MdbMultiRangeModule {}
