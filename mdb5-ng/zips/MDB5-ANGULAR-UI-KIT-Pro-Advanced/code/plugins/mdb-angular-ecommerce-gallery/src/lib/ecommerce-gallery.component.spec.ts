import { Component } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MdbEcommerceGalleryModule } from './ecommerce-gallery.module';

const defaultSlides = [
  {
    src: 'https://mdbcdn.b-cdn.net/img/Photos/Thumbnails/Slides/1.webp',
    img: 'https://mdbootstrap.com/img/Photos/Slides/1.webp',
    alt: 'Table Full of Spices',
  },
  {
    src: 'https://mdbcdn.b-cdn.net/img/Photos/Thumbnails/Slides/2.webp',
    img: 'https://mdbootstrap.com/img/Photos/Slides/2.webp',
    alt: 'Winter Landscape',
  },
  {
    src: 'https://mdbcdn.b-cdn.net/img/Photos/Thumbnails/Slides/3.webp',
    img: 'https://mdbootstrap.com/img/Photos/Slides/3.webp',
    alt: 'View of the City in the Mountains',
  },
  {
    src: 'https://mdbcdn.b-cdn.net/img/Photos/Thumbnails/Slides/4.webp',
    img: 'https://mdbootstrap.com/img/Photos/Slides/4.webp',
    alt: 'Place Royale Bruxelles',
  },
];

const CLASS_ACTIVE = 'active';

const SELECTOR_ECOMMERCE_MAIN_IMG = '.ecommerce-gallery-main-img';
const SELECTOR_ECOMMERCE_ACTIVE_MAIN_IMG = `${SELECTOR_ECOMMERCE_MAIN_IMG}.${CLASS_ACTIVE}`;
const SELECTOR_ECOMMERCE_SLIDE_THUMB = '.slide-thumb';
const SELECTOR_ECOMMERCE_ACTIVE_SLIDE_THUMB = `${SELECTOR_ECOMMERCE_SLIDE_THUMB}.${CLASS_ACTIVE}`;

const SELECTOR_LIGHTBOX_MODAL = 'mdb-lightbox-modal';
const SELECTOR_LIGHTBOX_IMG = `${SELECTOR_LIGHTBOX_MODAL} img`;
const SELECTOR_LIGHTBOX_BTN_NEXT = '.lightbox-gallery-arrow-right button';
const SELECTOR_LIGHTBOX_IMG_WRAPPER = '.lightbox-gallery-image';

@Component({
  selector: 'mdb-test-ecommerce-gallery',
  template: `
    <mdb-ecommerce-gallery>
      <div class="row">
        <div class="col-12 mb-1">
          <mdb-ecommerce-gallery-main-img></mdb-ecommerce-gallery-main-img>
        </div>
        <div class="col-4" *ngFor="let slide of slides">
          <img
            mdbEcommerceGalleryImage
            src="{{ slide.src }}"
            [img]="slide.img"
            alt="{{ slide.alt }}"
            class="w-100 slide-thumb"
          />
        </div>
      </div>
    </mdb-ecommerce-gallery>
  `,
})
class EcommerceGalleryComponent {
  slides = defaultSlides;
  items = 3;
  vertical = false;
  interval = 0;
  breakpoint = 922;
  lightbox = false;
}

describe('MdbEcommerceGalleryComponent', () => {
  let component: EcommerceGalleryComponent;
  let fixture: ComponentFixture<EcommerceGalleryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MdbEcommerceGalleryModule, NoopAnimationsModule],
      declarations: [EcommerceGalleryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EcommerceGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create main img', () => {
    const mainImg = document.querySelector(SELECTOR_ECOMMERCE_MAIN_IMG) as HTMLImageElement;

    expect(mainImg).toBeDefined();
    expect(mainImg.src).toBe(defaultSlides[0].img);
    expect(mainImg.alt).toBe(defaultSlides[0].alt);
  });

  it('should update main img and active class', () => {
    let activeMainImg = document.querySelector(
      SELECTOR_ECOMMERCE_ACTIVE_MAIN_IMG
    ) as HTMLImageElement;
    let slides = document.querySelectorAll(SELECTOR_ECOMMERCE_SLIDE_THUMB);
    let firstSlide = slides[0] as HTMLImageElement;
    let lastSlide = slides[1] as HTMLImageElement;

    expect(activeMainImg).toBeDefined();
    expect(firstSlide).toBeDefined();
    expect(lastSlide).toBeDefined();

    expect(firstSlide.classList.contains(CLASS_ACTIVE)).toBe(true);
    expect(lastSlide.classList.contains(CLASS_ACTIVE)).toBe(false);
    expect(activeMainImg.src).toBe(defaultSlides[0].img);
    expect(activeMainImg.alt).toBe(defaultSlides[0].alt);

    lastSlide.dispatchEvent(new Event('click'));
    fixture.detectChanges();
    activeMainImg = document.querySelector(SELECTOR_ECOMMERCE_ACTIVE_MAIN_IMG) as HTMLImageElement;

    expect(firstSlide.classList.contains(CLASS_ACTIVE)).toBe(false);
    expect(lastSlide.classList.contains(CLASS_ACTIVE)).toBe(true);

    expect(activeMainImg.src).toBe(defaultSlides[1].img);
    expect(activeMainImg.alt).toBe(defaultSlides[1].alt);
  });

  it('should open lightbox', fakeAsync(() => {
    let activeMainImg = document.querySelector(
      SELECTOR_ECOMMERCE_ACTIVE_MAIN_IMG
    ) as HTMLImageElement;
    let lightboxModal = document.querySelector(SELECTOR_LIGHTBOX_MODAL);

    expect(lightboxModal).toBeFalsy();

    activeMainImg.dispatchEvent(new Event('click'));
    fixture.detectChanges();
    flush();

    lightboxModal = document.querySelector(SELECTOR_LIGHTBOX_MODAL);

    expect(lightboxModal).toBeTruthy();

    //get element with index 1 - becouse ligtbox modal have 3 elements - prev, current visible, next
    const lightboxActiveImageSrc = document
      .querySelectorAll(SELECTOR_LIGHTBOX_IMG)[1]
      .getAttribute('src');
    const lightboxActiveImageAlt = document
      .querySelectorAll(SELECTOR_LIGHTBOX_IMG)[1]
      .getAttribute('alt');

    expect(lightboxActiveImageSrc).toBe(activeMainImg.src);
    expect(lightboxActiveImageAlt).toBe(activeMainImg.alt);
  }));

  it('should update main img after change img on lightbox and update slide thumb active element', fakeAsync(() => {
    let activeMainImg = document.querySelector(
      SELECTOR_ECOMMERCE_ACTIVE_MAIN_IMG
    ) as HTMLImageElement;
    let activeThumb = document.querySelector(
      SELECTOR_ECOMMERCE_ACTIVE_SLIDE_THUMB
    ) as HTMLImageElement;

    activeMainImg.dispatchEvent(new Event('click'));
    fixture.detectChanges();
    flush();

    const lightboxModal = document.querySelector(SELECTOR_LIGHTBOX_MODAL);
    const lightboxImagesWrappers = document.querySelectorAll(SELECTOR_LIGHTBOX_IMG_WRAPPER);
    const arrowNext: HTMLElement = lightboxModal.querySelector(SELECTOR_LIGHTBOX_BTN_NEXT);

    //get element with index 1 - becouse ligtbox modal have 3 elements - prev, current visible, next
    let lightboxActiveImageSrc = document
      .querySelectorAll(SELECTOR_LIGHTBOX_IMG)[1]
      .getAttribute('src');
    let lightboxActiveImageAlt = document
      .querySelectorAll(SELECTOR_LIGHTBOX_IMG)[1]
      .getAttribute('alt');

    expect(activeThumb.src).toBe(defaultSlides[0].src);
    expect(activeThumb.alt).toBe(defaultSlides[0].alt);
    expect(activeThumb.alt).toBe(activeMainImg.alt);
    expect(lightboxActiveImageSrc).toBe(defaultSlides[0].img);
    expect(lightboxActiveImageAlt).toBe(defaultSlides[0].alt);
    expect(lightboxActiveImageSrc).toBe(activeMainImg.src);
    expect(lightboxActiveImageAlt).toBe(activeMainImg.alt);

    arrowNext.dispatchEvent(new MouseEvent('click'));
    lightboxImagesWrappers[1].dispatchEvent(new CustomEvent('transitionend'));

    fixture.detectChanges();

    //get element with index 1 - becouse ligtbox modal have 3 elements - prev, current visible, next
    lightboxActiveImageSrc = document
      .querySelectorAll(SELECTOR_LIGHTBOX_IMG)[1]
      .getAttribute('src');
    lightboxActiveImageAlt = document
      .querySelectorAll(SELECTOR_LIGHTBOX_IMG)[1]
      .getAttribute('alt');
    activeMainImg = document.querySelector(SELECTOR_ECOMMERCE_ACTIVE_MAIN_IMG) as HTMLImageElement;
    activeThumb = document.querySelector(SELECTOR_ECOMMERCE_ACTIVE_SLIDE_THUMB) as HTMLImageElement;

    expect(activeThumb.src).toBe(defaultSlides[1].src);
    expect(activeThumb.alt).toBe(defaultSlides[1].alt);
    expect(activeThumb.alt).toBe(activeMainImg.alt);
    expect(lightboxActiveImageSrc).toBe(defaultSlides[1].img);
    expect(lightboxActiveImageAlt).toBe(defaultSlides[1].alt);
    expect(lightboxActiveImageSrc).toBe(activeMainImg.src);
    expect(lightboxActiveImageAlt).toBe(activeMainImg.alt);
  }));
});
