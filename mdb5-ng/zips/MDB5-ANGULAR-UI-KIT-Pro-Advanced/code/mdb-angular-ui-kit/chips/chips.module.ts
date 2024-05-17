import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdbChipsInputDirective } from './chips-input.directive';
import { MdbChipsComponent } from './chips.component';
import { MdbChipComponent } from './chip.component';
import { MdbChipDeleteDirective } from './chip-delete.directive';

@NgModule({
  declarations: [
    MdbChipsInputDirective,
    MdbChipsComponent,
    MdbChipComponent,
    MdbChipDeleteDirective,
  ],
  exports: [MdbChipsInputDirective, MdbChipsComponent, MdbChipComponent, MdbChipDeleteDirective],
  imports: [CommonModule],
})
export class MdbChipsModule {}
