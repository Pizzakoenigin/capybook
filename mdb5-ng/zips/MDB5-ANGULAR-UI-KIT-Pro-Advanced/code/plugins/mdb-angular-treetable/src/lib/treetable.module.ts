import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MdbTreeTableDirective } from './treetable.directive';
import { MdbTreeTableRowDirective } from './treetable-row.directive';

@NgModule({
  declarations: [MdbTreeTableDirective, MdbTreeTableRowDirective],
  imports: [CommonModule],
  exports: [MdbTreeTableDirective, MdbTreeTableRowDirective],
})
export class MdbTreeTableModule {}
