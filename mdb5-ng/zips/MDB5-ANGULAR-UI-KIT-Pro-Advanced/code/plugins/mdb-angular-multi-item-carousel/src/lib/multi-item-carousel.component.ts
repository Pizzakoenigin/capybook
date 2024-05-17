import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnInit,
  Output,
  QueryList,
  Renderer2,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { MdbLightboxItemDirective } from 'mdb-angular-ui-kit/lightbox';
import { fromEvent } from 'rxjs';
import { MdbMultiItemCarouselSlide } from './multi-item-carousel-slide.interface';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'mdb-multi-item-carousel',
  templateUrl: './multi-item-carousel.component.html',
})
export class MdbMultiItemCarouselComponent implements AfterViewInit, OnInit {
  @ViewChildren(MdbLightboxItemDirective)
  lightboxItems: QueryList<MdbLightboxItemDirective>;

  @ViewChildren('carouselItem') carouselItems: QueryList<ElementRef>;
  @ViewChildren('carouselItemCopyBefore') carouselItemsCopyBefore: QueryList<ElementRef>;
  @ViewChildren('carouselItemCopyAfter') carouselItemsCopyAfter: QueryList<ElementRef>;
  @ViewChildren('carouselItemDefault') carouselItemsDefault: QueryList<ElementRef>;
  @ViewChild('carouselInner') carouselInner: ElementRef;

  @Input()
  get slides(): Array<MdbMultiItemCarouselSlide> {
    return this._slides;
  }
  set slides(value: Array<MdbMultiItemCarouselSlide>) {
    this._slides = value;
  }
  private _slides = [];

  @Input()
  get items(): number {
    return this._items;
  }
  set items(value: number) {
    this._items = value;
  }
  private _items = 3;

  @Input()
  get vertical(): boolean {
    return this._vertical;
  }
  set vertical(value: boolean) {
    this._vertical = value;
  }
  private _vertical = false;

  @Input()
  get interval(): number {
    return this._interval;
  }
  set interval(value: number) {
    this._interval = value;
  }
  private _interval = 0;

  @Input()
  get breakpoint(): number {
    return this._breakpoint;
  }
  set breakpoint(value: number) {
    this._breakpoint = value;
  }
  private _breakpoint = 922;

  @Input()
  get lightbox(): boolean {
    return this._lightbox;
  }
  set lightbox(value: boolean) {
    this._lightbox = value;
  }
  private _lightbox = false;

  @Output() slide: EventEmitter<void> = new EventEmitter();
  @Output() slided: EventEmitter<void> = new EventEmitter();

  carouselInnerTranslateValue = 0;
  totalImages = 0;
  private _firstActiveElementIndex = 0;
  private _originalItems = 0;

  constructor(private _renderer: Renderer2, private _ngZone: NgZone) {}

  ngOnInit(): void {
    this._originalItems = this.items;
    this._ngZone.runOutsideAngular(() => {
      if (window.innerWidth <= this.breakpoint) {
        this.items = 1;
      }
    });
  }

  ngAfterViewInit(): void {
    this.totalImages = this.slides.length;

    this._setAutoplay();
    this._setInitialCarouselInnerTranslateValue();
    this._setCarouselInnerTransformStyle();

    this._ngZone.runOutsideAngular(() => {
      this._ngZone.run(() => {
        if (window.innerWidth <= this.breakpoint) {
          this.items = 1;
          this._updateTransitionAfterResize();
        } else {
          this.items = this._originalItems;
        }
      });

      fromEvent(window, 'resize').subscribe((event: any) => {
        this._ngZone.run(() => {
          if (event.target.innerWidth <= this.breakpoint) {
            this.items = 1;
          } else {
            this.items = this._originalItems;
          }
          this._updateTransitionAfterResize();
        });
      });
    });
  }

  get lastActiveElementIndex(): number {
    let index = this._firstActiveElementIndex + this.items - 1;

    if (index >= this.totalImages) {
      index = index - this.totalImages;
    }

    return index;
  }

  get previousInactiveElement(): HTMLElement {
    if (this._firstActiveElementIndex > 0) {
      return this.carouselItemsDefault.toArray()[this._firstActiveElementIndex].nativeElement;
    } else {
      return this.carouselItemsDefault.toArray()[this.totalImages - 1].nativeElement;
    }
  }

  get previousElementSize(): number {
    return this.vertical
      ? this.previousInactiveElement.offsetHeight
      : this.previousInactiveElement.offsetWidth;
  }

  get translateValue(): string {
    return this.vertical
      ? `translate(0, ${this.carouselInnerTranslateValue}px)`
      : `translate(${this.carouselInnerTranslateValue}px)`;
  }

  openLightbox(imageIndex: number): void {
    this.lightboxItems.toArray()[imageIndex].el.nativeElement.click();
  }

  slideLeft(): void {
    this.slide.emit();
    this._setCarouselInnerTranslateValue('decrease');
    this._updateFirstActiveElementIndex('decrease');
    this.slided.emit();
  }

  slideRight(): void {
    this.slide.emit();
    this._setCarouselInnerTranslateValue('increase');
    this._updateFirstActiveElementIndex('increase');
    this.slided.emit();
  }

  private _setAutoplay(): void {
    if (this.interval !== 0) {
      setInterval(() => {
        this.slideRight();
      }, this.interval);
    }
  }

  private _setCarouselInnerTransformStyle(): void {
    this._renderer.setStyle(this.carouselInner.nativeElement, 'transform', this.translateValue);
  }

  private _getElementSize(el: ElementRef): number {
    return this.vertical ? el.nativeElement.offsetHeight : el.nativeElement.offsetWidth;
  }

  private _setInitialCarouselInnerTranslateValue(): void {
    this._renderer.setStyle(this.carouselInner.nativeElement, 'transition', 'none');

    this.carouselInnerTranslateValue = 0;
    this.carouselItemsCopyBefore.forEach((carouselItem: ElementRef) => {
      this.carouselInnerTranslateValue -= this._getElementSize(carouselItem);
    });
  }

  private _setCarouselInnerTranslateValue(action: 'increase' | 'decrease' = 'increase'): void {
    if (action === 'increase') {
      this._increaseCarouselInnerTranslateValue();
    } else {
      this._decreaseCarouselInnerTranslateValue();
    }
    this._renderer.setStyle(this.carouselInner.nativeElement, 'transition', '');
    this._setCarouselInnerTransformStyle();
  }

  private _decreaseCarouselInnerTranslateValue(): void {
    if (this.lastActiveElementIndex === this.items) {
      this._renderer.setStyle(this.carouselInner.nativeElement, 'transition', 'none');
      this._setInitialCarouselInnerTranslateValue();
      this.carouselInnerTranslateValue -= this.previousElementSize;
      this._setCarouselInnerTransformStyle();
    }
    this.carouselInnerTranslateValue += this.previousElementSize;
  }

  private _increaseCarouselInnerTranslateValue(): void {
    if (this._firstActiveElementIndex + 1 === this.totalImages) {
      this._renderer.setStyle(this.carouselInner.nativeElement, 'transition', 'none');
      this._setInitialCarouselInnerTranslateValue();
      this.carouselInnerTranslateValue += this.previousElementSize;
      this._setCarouselInnerTransformStyle();
    }
    this.carouselInnerTranslateValue -= this.previousElementSize;
  }

  private _updateTransitionAfterResize(): void {
    this._setInitialCarouselInnerTranslateValue();

    if (this._firstActiveElementIndex !== 0) {
      this.carouselItemsDefault.forEach((carouselItem, index) => {
        if (index < this._firstActiveElementIndex) {
          this.carouselInnerTranslateValue -= this._getElementSize(carouselItem);
        }
      });
    }

    this._setCarouselInnerTransformStyle();
  }

  private _updateFirstActiveElementIndex(action: 'increase' | 'decrease'): void {
    if (action === 'increase') {
      this._firstActiveElementIndex === this.totalImages - 1
        ? (this._firstActiveElementIndex = 0)
        : (this._firstActiveElementIndex += 1);
    } else {
      this._firstActiveElementIndex === 0
        ? (this._firstActiveElementIndex = this.totalImages - 1)
        : (this._firstActiveElementIndex -= 1);
    }
  }
}
