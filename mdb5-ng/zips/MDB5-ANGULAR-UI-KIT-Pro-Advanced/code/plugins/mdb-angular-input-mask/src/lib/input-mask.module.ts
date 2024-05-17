import { NgModule } from '@angular/core';
import { MdbInputMaskDirective } from './input-mask.directive';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [MdbInputMaskDirective],
  imports: [CommonModule, MdbFormsModule],
  exports: [MdbInputMaskDirective],
})
export class MdbInputMaskModule {}
