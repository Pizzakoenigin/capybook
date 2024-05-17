import { NgModule } from '@angular/core';
import { MdbMultiItemCarouselComponent } from './multi-item-carousel.component';
import { CommonModule } from '@angular/common';
import { MdbLightboxModule } from 'mdb-angular-ui-kit/lightbox';

@NgModule({
  declarations: [MdbMultiItemCarouselComponent],
  imports: [CommonModule, MdbLightboxModule],
  exports: [MdbMultiItemCarouselComponent],
})
export class MdbMultiItemCarouselModule {}
