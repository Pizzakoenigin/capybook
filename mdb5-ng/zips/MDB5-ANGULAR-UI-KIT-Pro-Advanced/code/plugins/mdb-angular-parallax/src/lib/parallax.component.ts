/** !
 * The following code contains snippets of simpleParallax.js
 *
 * @license MIT
 * @author Geoffrey Signorato <geoffrey.signorato@gmail.com> (https://github.com/geosigno/simpleParallax.js/)
 * @version 5.6.1
 * */

import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  NgZone,
  OnDestroy,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export interface ParallaxStyle {
  height?: string;
  width?: string;
  position?: string;
  top?: string;
  left?: string;
  overflow?: string;
  transition?: string;
  transform?: string;
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'mdb-parallax',
  templateUrl: './parallax.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdbParallaxComponent implements AfterViewInit, OnDestroy {
  @ViewChild('imageContainer') _imageContainer: ElementRef<HTMLElement>;
  @ViewChild('image') _image: ElementRef<HTMLImageElement>;

  @Input() imageSrc = '';
  @Input() direction:
    | 'right down'
    | 'left down'
    | 'right up'
    | 'left up'
    | 'right'
    | 'down'
    | 'left'
    | 'up' = 'up';
  @Input() delay = 0.4;
  @Input() scale = 1.3;
  @Input() transition = 'cubic-bezier(0,0,0,1)';
  @Input() maxTransition = 0;
  @Input() maxHeight = 0;
  @Input() horizontalAlignment: 'left' | 'center' | 'right' = 'center';
  @Input() verticalAlignment: 'top' | 'center' | 'bottom' = 'center';
  @Input() overflow = false;

  get host(): HTMLElement {
    return this._elementRef.nativeElement;
  }
  private _isVisible = false;
  private _lastViewportPosition = -1;
  private _resizeWindowHandler = () => this._refresh();
  private _observer: IntersectionObserver;
  private _previousTranslateValue: { x: number; y: number } = { x: 0, y: 0 };
  private _translateValue: { x: number; y: number } = { x: 0, y: 0 };
  private _imageWrapperStyle: ParallaxStyle = {
    position: 'relative',
    top: '0px',
    left: '0px',
    overflow: `${this.overflow === false ? 'hidden' : ''}`,
  };

  private readonly _destroy$: Subject<void> = new Subject<void>();

  constructor(
    private _elementRef: ElementRef,
    private _renderer: Renderer2,
    private _ngZone: NgZone,
    private _cdRef: ChangeDetectorRef
  ) {}

  private _getPercentage(): number {
    const rect = this.host.getBoundingClientRect();
    const elementHeight = rect.height;
    const elementTop = rect.top + window.scrollY;
    const viewportHeight = document.documentElement.clientHeight;
    const viewportBottom = window.scrollY + viewportHeight;

    let percentage = Number(
      ((viewportBottom - elementTop) / ((viewportHeight + elementHeight) / 100)).toFixed(1)
    );

    percentage = Math.min(100, Math.max(0, percentage));

    if (this.maxTransition !== 0 && percentage > this.maxTransition) {
      return this.maxTransition;
    }

    return percentage;
  }

  private _getMaxTranslateRange(): { x: number; y: number } {
    return {
      x: Number(
        (
          this._image.nativeElement.naturalWidth * this.scale -
          this._image.nativeElement.naturalWidth
        ).toFixed(0)
      ),
      y: Number(
        (
          this._image.nativeElement.naturalHeight * this.scale -
          this._image.nativeElement.naturalHeight
        ).toFixed(0)
      ),
    };
  }

  private _getTranslateValue(): { x: number; y: number } {
    const maxTranslateRange = this._getMaxTranslateRange();
    return {
      x: Number(
        ((this._getPercentage() / 100) * maxTranslateRange.x - maxTranslateRange.x / 2).toFixed(0)
      ),
      y: Number(
        ((this._getPercentage() / 100) * maxTranslateRange.y - maxTranslateRange.y / 2).toFixed(0)
      ),
    };
  }

  private _translate(): void {
    let translateValueY = 0;
    let translateValueX = 0;
    let translateCSS;
    let translateX;

    if (this.direction.includes('left') || this.direction.includes('right')) {
      translateValueX = this.direction.includes('left')
        ? this._translateValue.y * -1
        : this._translateValue.y;
    }

    if (this.direction.includes('up') || this.direction.includes('down')) {
      translateValueY = this.direction.includes('up')
        ? this._translateValue.y * -1
        : this._translateValue.y;
    }
    if (this.overflow === false) {
      translateCSS = `translate3d(${translateValueX}px, ${translateValueY}px, 0px) scale(${this.scale})`;
    } else {
      translateCSS = `translate3d(${translateValueX}px, ${translateValueY}px, 0px)`;
    }

    if (this.horizontalAlignment === 'left') {
      translateX = 'translateX(10%)';
    } else if (this.horizontalAlignment === 'right') {
      translateX = 'translateX(-10%)';
    } else if (this.horizontalAlignment === 'center') {
      translateX = 'translateX(0%)';
    }
    this._renderer.setStyle(
      this._image.nativeElement,
      'transform',
      `${translateCSS} ${translateX}`
    );
  }

  _handleFrameLoop = () => {
    if (this._lastViewportPosition === window.scrollY) {
      window.requestAnimationFrame(this._handleFrameLoop);
      return;
    }

    this._translateValue = this._getTranslateValue();

    if (this._isVisible && this._previousTranslateValue !== this._translateValue) {
      this._translate();
    }

    this._previousTranslateValue = this._translateValue;

    window.requestAnimationFrame(this._handleFrameLoop);

    this._lastViewportPosition = window.scrollY;
  };

  private _getPositionY(): string {
    // vertical positioning of the image possible only when custom height of the element is given
    // otherwise image is always centered so it can be properly translated
    const maxTranslateRange = this._getMaxTranslateRange();

    let positionY = '0px';

    if (!(this.maxHeight > 0 && this.maxHeight <= this._image.nativeElement.naturalHeight)) {
      return positionY;
    }

    if (this.verticalAlignment === 'center') {
      positionY = `${Number(maxTranslateRange.y) + this._image.nativeElement.naturalHeight / -2}px`;
    }

    if (this.verticalAlignment === 'bottom') {
      positionY = `${
        Number(maxTranslateRange.y) / 2 + this._image.nativeElement.naturalHeight / -2
      }px`;
    }

    return positionY;
  }

  private _imageIntersectionObserver(): void {
    const options = {
      root: null,
      threshold: 0,
    };

    this._observer = new IntersectionObserver(this._setIsVisible.bind(this), options);

    this._observer.observe(this.host);
  }

  private _setIsVisible(entries): void {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        this._isVisible = true;
      } else {
        this._isVisible = false;
      }
    });
  }

  private _getMaxHeight(): number {
    return this.maxHeight > 0 && this.maxHeight <= this._image.nativeElement.naturalHeight
      ? this.maxHeight
      : this._image.nativeElement.naturalHeight;
  }

  private _addStyles(el: HTMLElement, styles: ParallaxStyle): void {
    Object.keys(styles).forEach((property) => {
      this._renderer.setStyle(el, property, styles[property]);
    });
  }

  private handleImageLoaded(): void {
    const dimensionStyles = {
      height: `${this._getMaxHeight()}px`,
      width: '100%',
    };

    let imageStyles = {
      willChange: 'transform',
      top: this._getPositionY(),
      display: 'block',
      opacity: 1,
      transform: 'scale(1)',
    };

    if (this.delay > 0) {
      imageStyles = {
        ...imageStyles,
        ...{ transition: `transform ${this.delay}s ${this.transition}` },
      };
    }

    if (this.overflow === false) {
      imageStyles = { ...imageStyles, ...{ transform: `scale(${this.scale})` } };
    }

    this._addStyles(this._image.nativeElement, imageStyles);
    this._addStyles(this.host, dimensionStyles);
    this._addStyles(this._imageContainer.nativeElement, dimensionStyles);

    this._imageIntersectionObserver();

    this._translateValue = this._getTranslateValue();

    this._previousTranslateValue = this._translateValue;

    this._translate();

    this._handleFrameLoop();
  }

  private _refresh(): void {
    this._lastViewportPosition = -1;
    this._translate();
  }

  getImageWrapperStyle(): ParallaxStyle {
    return this._imageWrapperStyle;
  }

  ngAfterViewInit() {
    this._renderer.setStyle(this.host, 'position', 'relative');

    this._imageWrapperStyle = {
      position: 'relative',
      top: '0px',
      left: '0px',
      overflow: `${this.overflow === false ? 'hidden' : ''}`,
    };

    this._cdRef.markForCheck();

    fromEvent(this._image.nativeElement, 'load')
      .pipe(takeUntil(this._destroy$))
      .subscribe(() => {
        this.handleImageLoaded();
      });

    this._ngZone.runOutsideAngular(() => {
      fromEvent(window, 'resize')
        .pipe(takeUntil(this._destroy$))
        .subscribe(() => {
          this._resizeWindowHandler();
        });
    });
  }

  ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
