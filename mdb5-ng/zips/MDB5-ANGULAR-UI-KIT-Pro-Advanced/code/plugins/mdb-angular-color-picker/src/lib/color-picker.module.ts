import { NgModule } from '@angular/core';
import { MdbColorPickerComponent } from './color-picker.component';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [MdbColorPickerComponent],
  imports: [MdbFormsModule, FormsModule, CommonModule, ReactiveFormsModule],
  exports: [MdbColorPickerComponent],
})
export class MdbColorPickerModule {}
