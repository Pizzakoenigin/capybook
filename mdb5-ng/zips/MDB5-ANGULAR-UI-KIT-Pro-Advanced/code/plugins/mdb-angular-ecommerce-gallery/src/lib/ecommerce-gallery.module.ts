import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdbEcommerceGalleryComponent } from './ecommerce-gallery.component';
import { MdbMultiItemCarouselModule } from 'mdb-angular-multi-item-carousel';
import { MdbLightboxModule } from 'mdb-angular-ui-kit/lightbox';
import { MdbEcommerceGalleryImageDirective } from './ecommerce-gallery-image.directive';
import { MdbEcommerceGalleryMainImgComponent } from './ecommerce-gallery-main-img.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    MdbEcommerceGalleryComponent,
    MdbEcommerceGalleryImageDirective,
    MdbEcommerceGalleryMainImgComponent,
  ],
  imports: [CommonModule, BrowserAnimationsModule, MdbLightboxModule, MdbMultiItemCarouselModule],
  exports: [
    MdbEcommerceGalleryComponent,
    MdbEcommerceGalleryImageDirective,
    MdbEcommerceGalleryMainImgComponent,
  ],
})
export class MdbEcommerceGalleryModule {}
