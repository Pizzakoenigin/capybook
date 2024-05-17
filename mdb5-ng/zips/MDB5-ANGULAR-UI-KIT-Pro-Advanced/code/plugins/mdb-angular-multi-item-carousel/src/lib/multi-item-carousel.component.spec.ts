import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MdbMultiItemCarouselModule } from './multi-item-carousel.module';

const defaultSlides = [
  {
    src: 'https://mdbootstrap.com/img/Photos/Slides/1.webp',
    alt: 'Table Full of Spices',
  },
  {
    src: 'https://mdbootstrap.com/img/Photos/Slides/2.webp',
    alt: 'Winter Landscape',
  },
  {
    src: 'https://mdbootstrap.com/img/Photos/Slides/3.webp',
    alt: 'View of the City in the Mountains',
  },
  {
    src: 'https://mdbootstrap.com/img/Photos/Slides/4.webp',
    alt: 'Place Royale Bruxelles',
  },
];

const lightboxSlides = [
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

@Component({
  selector: 'mdb-test-multi-carousel',
  template: `
    <mdb-multi-item-carousel
      [slides]="slides"
      [items]="items"
      [vertical]="vertical"
      [interval]="interval"
      [breakpoint]="breakpoint"
      [lightbox]="lightbox"
      style="max-width: 20rem;"
    ></mdb-multi-item-carousel>
  `,
})
class MultiCarouselComponent {
  slides = defaultSlides;
  items = 3;
  vertical = false;
  interval = 0;
  breakpoint = 922;
  lightbox = false;
}

describe('MdbMultiItemCarouselComponent', () => {
  let component: MultiCarouselComponent;
  let fixture: ComponentFixture<MultiCarouselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MdbMultiItemCarouselModule],
      declarations: [MultiCarouselComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be horizontal by default', () => {
    fixture.detectChanges();

    const multiCarouselWrapper = document.querySelector('.multi-carousel');

    expect(multiCarouselWrapper.classList.contains('vertical')).toBe(false);
  });

  it('should be vertical if [vertical]="true" is set', () => {
    component.vertical = true;

    fixture.detectChanges();

    const multiCarouselWrapper = document.querySelector('.multi-carousel');

    expect(multiCarouselWrapper.classList.contains('vertical')).toBe(true);
  });

  it('should create slides copy', () => {
    fixture.detectChanges();

    const slidesEl = document.querySelectorAll('.multi-carousel-item');
    const images = document.querySelectorAll('.multi-carousel-item img');
    const numberOfSlides = defaultSlides.length;

    expect(slidesEl.length).toBe(numberOfSlides * 3);

    //also check if the img src is correct
    for (let i = 0; i < numberOfSlides; i++) {
      const copyBeforeImageElement = images[i] as HTMLImageElement;
      const defaultImageElement = images[i + numberOfSlides] as HTMLImageElement;
      const copyAfterImageElement = images[i + numberOfSlides * 2] as HTMLImageElement;

      expect(copyBeforeImageElement.src).toBe(defaultImageElement.src);
      expect(copyAfterImageElement.src).toBe(defaultImageElement.src);
    }
  });

  it('should set correct element size', () => {
    fixture.detectChanges();

    const slidesEl = document.querySelectorAll('.multi-carousel-item');

    // horizontal
    slidesEl.forEach((el: HTMLElement) => {
      expect(el.style.width).toBe(`${100 / component.items}%`);
      expect(el.style.height).toBe('');
    });

    component.items = 2;
    fixture.detectChanges();

    slidesEl.forEach((el: HTMLElement) => {
      expect(el.style.width).toBe(`${100 / component.items}%`);
      expect(el.style.height).toBe('');
    });
    //vertical
    component.vertical = true;

    fixture.detectChanges();
    slidesEl.forEach((el: HTMLElement) => {
      expect(el.style.height).toBe(`${100 / component.items}%`);
      expect(el.style.width).toBe('');
    });

    component.items = 3;
    fixture.detectChanges();

    slidesEl.forEach((el: HTMLElement) => {
      expect(el.style.height).toBe(`${100 / component.items}%`);
      expect(el.style.width).toBe('');
    });
  });

  it('should show 1 slide when resolution below breakpoint', () => {
    component.breakpoint = 720;
    window.innerWidth = 600;
    window.dispatchEvent(new Event('resize'));

    fixture.detectChanges();

    const slidesEl = document.querySelectorAll('.multi-carousel-item');

    // horizontal
    slidesEl.forEach((el: HTMLElement) => {
      expect(el.style.width).toBe('100%');
      expect(el.style.height).toBe('');
    });
  });
});
