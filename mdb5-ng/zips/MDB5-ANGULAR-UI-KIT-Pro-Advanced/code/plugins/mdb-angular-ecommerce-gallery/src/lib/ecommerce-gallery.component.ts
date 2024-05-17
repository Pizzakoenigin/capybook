import {
  ContentChild,
  ContentChildren,
  ElementRef,
  QueryList,
  Renderer2,
  ViewChildren,
} from '@angular/core';
import { AfterContentInit, Component, HostBinding, Input } from '@angular/core';
import { MdbMultiItemCarouselComponent } from 'mdb-angular-multi-item-carousel';
import { fromEvent, Subject } from 'rxjs';
import { MdbEcommerceGalleryImageDirective } from './ecommerce-gallery-image.directive';
import { MdbEcommerceGalleryMainImgComponent } from './ecommerce-gallery-main-img.component';
import { MdbEcommerceGallerySlide } from './ecommerce-galery-slide.interface';
import { takeUntil } from 'rxjs/operators';

export type MdbEcommerceGalleryActivation = 'click' | 'mouseenter';

@Component({
  selector: 'mdb-ecommerce-gallery',
  templateUrl: './ecommerce-gallery.component.html',
})
export class MdbEcommerceGalleryComponent implements AfterContentInit {
  @ViewChildren('imageThumbnails') _imageThumbnails: QueryList<ElementRef>;
  @ContentChildren(MdbEcommerceGalleryImageDirective, { descendants: true })
  _galleryImages: QueryList<MdbEcommerceGalleryImageDirective>;
  @ContentChild(MdbEcommerceGalleryMainImgComponent)
  _mainImage: MdbEcommerceGalleryMainImgComponent;
  @ContentChild(MdbMultiItemCarouselComponent) _multiItemCarousel: MdbMultiItemCarouselComponent;

  @Input()
  get activation(): MdbEcommerceGalleryActivation {
    return this._activation;
  }
  set activation(value: MdbEcommerceGalleryActivation) {
    this._activation = value;
  }
  private _activation: MdbEcommerceGalleryActivation = 'click';

  @HostBinding('class') class = 'ecommerce-gallery';

  readonly _destroy$: Subject<void> = new Subject<void>();

  private _slides: MdbEcommerceGallerySlide[] = [];
  private _activeSlideIndex = 0;

  constructor(private _renderer: Renderer2) {}

  ngAfterContentInit(): void {
    this._getSlides();

    this._mainImage.slides = this._slides;

    this._subscribeMainImageActiveIndexChange();

    if (this._galleryImages.length) {
      this._subscribeGaleryImagesActivationEvent();
      this._updateGaleryImageActiveClass();
    }
  }

  ngAfterViewInit(): void {
    if (this._multiItemCarousel) {
      this._subscribeMultiItemCarouselActivationEvent();
      const firstCarouselItem = this._multiItemCarousel.carouselItemsDefault.first;
      this._renderer.addClass(firstCarouselItem.nativeElement.firstChild, 'active');
    }
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private _getSlides(): void {
    this._slides = [];

    if (this._galleryImages.length) {
      this._galleryImages.forEach((image: MdbEcommerceGalleryImageDirective) => {
        const imgData = {
          src: image.elRef.nativeElement.src,
          img: image.img,
          alt: image.elRef.nativeElement.alt,
        };
        this._slides.push(imgData);
      });
    } else {
      this._slides = this._multiItemCarousel.slides;
    }
  }

  private _updateMainImageIndex(index: number): void {
    if (this._activeSlideIndex === index) {
      return;
    }
    this._activeSlideIndex = index;
    this._mainImage.setSlideAsActive(index);
  }

  private _subscribeGaleryImagesActivationEvent(): void {
    this._galleryImages.forEach((image: MdbEcommerceGalleryImageDirective, i: number) => {
      fromEvent(image.elRef.nativeElement, this.activation)
        .pipe(takeUntil(this._destroy$))
        .subscribe(() => {
          this._updateMainImageIndex(i);
          this._updateGaleryImageActiveClass();
        });
    });
  }

  private _subscribeMainImageActiveIndexChange(): void {
    this._mainImage.slideIndexChanged$
      .pipe(takeUntil(this._destroy$))
      .subscribe((index: number) => {
        this._activeSlideIndex = index;
        this._updateGaleryImageActiveClass();
      });
  }

  private _updateGaleryImageActiveClass(): void {
    this._galleryImages.forEach((image: MdbEcommerceGalleryImageDirective, i: number) => {
      if (this._activeSlideIndex !== i) {
        image.toggleActive(false);
      } else {
        image.toggleActive(true);
      }
    });
  }

  private _subscribeMultiItemCarouselActivationEvent(): void {
    this._multiItemCarousel.carouselItems.forEach((item: ElementRef, i: number) => {
      fromEvent(item.nativeElement, this.activation)
        .pipe(takeUntil(this._destroy$))
        .subscribe(() => {
          this._updateMultiItemCarouselImageActiveClass(i);
        });
    });

    const carouselItemsRef = [
      this._multiItemCarousel.carouselItemsCopyBefore,
      this._multiItemCarousel.carouselItemsDefault,
      this._multiItemCarousel.carouselItemsCopyAfter,
    ];

    carouselItemsRef.forEach((carouselItems: QueryList<ElementRef>) => {
      carouselItems.forEach((item: ElementRef, i: number) => {
        fromEvent(item.nativeElement, this.activation)
          .pipe(takeUntil(this._destroy$))
          .subscribe(() => {
            this._updateMainImageIndex(i);
          });
      });
    });
  }

  private _updateMultiItemCarouselImageActiveClass(index: number): void {
    this._multiItemCarousel.carouselItems.forEach((item: ElementRef, i: number) => {
      if (index !== i) {
        this._renderer.removeClass(item.nativeElement.firstChild, 'active');
      } else {
        this._renderer.addClass(item.nativeElement.firstChild, 'active');
      }
    });
  }
}
