import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { MdbParallaxComponent } from './parallax.component';
import { MdbParallaxModule } from './parallax.module';

const template = `
  <mdb-parallax
  [imageSrc]="imageSrc"
  [maxHeight]="maxHeight"
  [delay]="delay"
  [direction]="direction"
  [scale]="scale"
  [transition]="transition"
  [maxTransition]="maxTransition"
  [horizontalAlignment]="horizontalAlignment"
  [verticalAlignment]="verticalAlignment"
  [overflow]="overflow"
  #parallax
  >
  <div class="container d-flex justify-content-center align-items-center" style="height: 100%">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">Card title</h5>
                <p class="card-text">
                  Some quick example text to show you possibilites of the parallax element.
                </p>
                <button type="button" class="btn btn-primary">Button</button>
              </div>
            </div>
          </div>
  </mdb-parallax>
`;

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'mdb-parallax-test',
  template,
})
class TestParallaxComponent {
  @ViewChild('parallax') parallax: MdbParallaxComponent;
  imageSrc = 'https://mdbcdn.b-cdn.net/img/Photos/Slides/3.webp';
  maxHeight = '200px';
  delay = 2;
  direction = 'right';
  scale = 1.8;
  transition = 'linear';
  maxTransition = 60;
  horizontalAlignment = 'left';
  verticalAlignment = 'top';
  overflow = false;
}

describe('MDB Parallax', () => {
  let fixture: ComponentFixture<TestParallaxComponent>;
  let element: any;
  let component: any;
  let parallax: MdbParallaxComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestParallaxComponent],
      imports: [MdbParallaxModule],
      teardown: { destroyAfterEach: false },
    });
    fixture = TestBed.createComponent(TestParallaxComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    parallax = component.instance;

    const mainEl = element.querySelector('mdb-parallax');

    mainEl.getBoundingClientRect = () => ({
      top: 515,
      height: 847,
      bottom: 1100,
    });
  });

  describe('DOM manipulation', () => {
    Object.defineProperty(window, 'IntersectionObserver', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // deprecated
        removeListener: jest.fn(), // deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
        observe: jest.fn(),
      })),
    });

    jest.spyOn(document.documentElement, 'clientHeight', 'get').mockImplementation(() => 1114);

    it('should create image element and image containers', () => {
      const image = element.querySelector('img');
      expect(image).toBeTruthy();

      const imageContainer = element.querySelector('.parallax-slider');

      expect(imageContainer).not.toBe(null);
    });

    it('should set transition', () => {
      const image = element.querySelector('img');

      expect(image).toBeTruthy();

      Object.defineProperty(image, 'naturalHeight', { value: '200', writable: true });

      image.dispatchEvent(new Event('load'));

      expect(image.style.transition).toBe('transform 2s linear');

      component.transition = 'cubic-bezier(0, 0, 0, 1)';
      fixture.detectChanges();

      image.dispatchEvent(new Event('load'));

      expect(image.style.transition).toBe('transform 2s cubic-bezier(0, 0, 0, 1)');
    });

    it('should calculate initial translate values for vertical parallax', () => {
      component.direction = 'up';
      fixture.detectChanges();
      const image = element.querySelector('img');

      expect(image).toBeTruthy();

      Object.defineProperty(image, 'naturalHeight', { value: '200', writable: true });

      image.dispatchEvent(new Event('load'));

      expect(image.style.transform).toBe('translate3d(0px, 31px, 0px) scale(1.8) translateX(10%)');
    });

    it('should calculate initial translate values for horizontal parallax', () => {
      component.direction = 'right';
      fixture.detectChanges();
      const image = element.querySelector('img');

      expect(image).toBeTruthy();

      Object.defineProperty(image, 'naturalHeight', { value: '200', writable: true });

      image.dispatchEvent(new Event('load'));

      expect(image.style.transform).toBe('translate3d(-31px, 0px, 0px) scale(1.8) translateX(10%)');
    });

    it('should properly set max height', () => {
      const image = element.querySelector('img');
      const imageContainer = element.querySelector('.parallax-slider');
      const imageContent = element.querySelector('.container');

      expect(image).toBeTruthy();

      Object.defineProperty(image, 'naturalHeight', { value: '200', writable: true });

      image.dispatchEvent(new Event('load'));

      expect(image.naturalHeight).toBe('200');
      expect(imageContent.style.height).toBe('100%');
      expect(imageContainer.style.height).toBe('200px');
    });

    it('should not add scale transform when overflow', () => {
      component.overflow = true;
      fixture.detectChanges();

      const image = element.querySelector('img');

      expect(image).toBeTruthy();

      image.dispatchEvent(new Event('load'));

      expect(image.style.transform).toBe('translate3d(0px, 0px, 0px) translateX(10%)');
      component.overflow = false;
      fixture.detectChanges();
    });
  });
});
