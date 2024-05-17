import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  QueryList,
  Renderer2,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { fadeInAnimation } from 'mdb-angular-ui-kit/animations';
import { MdbEcommerceGallerySlide } from './ecommerce-galery-slide.interface';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'mdb-ecommerce-gallery-main-img',
  templateUrl: './ecommerce-gallery-main-img.component.html',
  animations: [fadeInAnimation()],
})
export class MdbEcommerceGalleryMainImgComponent implements AfterViewInit {
  @ViewChild('mainImageWrapper') _mainImageWrapper: ElementRef;
  @ViewChildren('mainImages') _mainImages: QueryList<ElementRef>;

  @Input()
  get zoomEfect(): boolean {
    return this._zoomEfect;
  }
  set zoomEfect(value: boolean) {
    this._zoomEfect = value;
  }
  private _zoomEfect = false;

  @Input()
  get autoHeight(): boolean {
    return this._autoHeight;
  }
  set autoHeight(value: boolean) {
    this._autoHeight = value;
  }
  private _autoHeight = false;

  activeSlideIndex = 0;
  slides: MdbEcommerceGallerySlide[] = [];
  animationState = false;

  readonly _destroy$: Subject<void> = new Subject<void>();
  readonly slideIndexChanged$: Subject<number> = new Subject<number>();

  constructor(private _renderer: Renderer2) {}

  ngAfterViewInit(): void {
    if (!this.zoomEfect) {
      return;
    }

    fromEvent(this._mainImageWrapper.nativeElement, 'mousemove')
      .pipe(takeUntil(this._destroy$))
      .subscribe((e: MouseEvent) => {
        this.zoom(e);
      });

    fromEvent(this._mainImageWrapper.nativeElement, 'mouseleave')
      .pipe(takeUntil(this._destroy$))
      .subscribe(() => {
        this.resetZoom();
      });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  setSlideAsActive(slideIndex: number): void {
    this.onAnimationDone();
    this.activeSlideIndex = slideIndex;
    this.startAnimation();
    this.slideIndexChanged$.next(slideIndex);
  }

  zoom(e: MouseEvent): void {
    const image = this._mainImages.toArray()[this.activeSlideIndex].nativeElement;
    const imageWrapperClientRect = this._mainImageWrapper.nativeElement.getBoundingClientRect();

    const scale = 4.5;

    const imageCenter = {
      x: image.width / 2,
      y: image.height / 2,
    };

    const cursorPosition = {
      x: e.x - imageWrapperClientRect.left,
      y: e.y - imageWrapperClientRect.top,
    };

    const positionDiff = {
      x: imageCenter.x - cursorPosition.x,
      y: imageCenter.y - cursorPosition.y,
    };

    const scaledPositionDiff = {
      x: positionDiff.x * (scale - 1),
      y: positionDiff.y * (scale - 1),
    };

    this._renderer.setStyle(
      image,
      'transform',
      `translate(${scaledPositionDiff.x}px,${scaledPositionDiff.y}px) scale(${scale})`
    );
  }

  resetZoom(): void {
    const image = this._mainImages.toArray()[this.activeSlideIndex].nativeElement;

    this._renderer.setStyle(image, 'transform', '');
  }

  startAnimation(): void {
    this.animationState = true;
  }

  onAnimationDone(): void {
    this.animationState = false;
  }
}
