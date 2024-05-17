import { Component, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed } from '@angular/core/testing';
import { MdbLightboxModule } from './lightbox.module';
import { MdbLightboxItemDirective } from './lightbox-item.directive';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MdbLightboxComponent } from './lightbox.component';

const template = `
<mdb-lightbox class="lightbox">
  <div class="row">
    <div class="col-lg-4">
      <img
        mdbLightboxItem
        src="https://mdbootstrap.com/img/Photos/Thumbnails/Slides/1.jpg"
        [img]="'https://mdbcdn.b-cdn.net/img/Photos/Slides/1.jpg'"
        alt="Lightbox image 1"
        class="w-100"
      />
    </div>
    <div class="col-lg-4">
      <img
        mdbLightboxItem
        src="https://mdbootstrap.com/img/Photos/Thumbnails/Slides/2.jpg"
        [img]="'https://mdbcdn.b-cdn.net/img/Photos/Slides/2.jpg'"
        alt="Lightbox image 2"
        class="w-100"
      />
    </div>
    <div class="col-lg-4">
      <img
        mdbLightboxItem
        src="https://mdbootstrap.com/img/Photos/Thumbnails/Slides/3.jpg"
        [img]="'https://mdbcdn.b-cdn.net/img/Photos/Slides/3.jpg'"
        alt="Lightbox image 3"
        class="w-100"
      />
    </div>
  </div>
</mdb-lightbox>
`;

const SELECTOR_LIGHTBOX_MODAL = 'mdb-lightbox-modal';
const SELECTOR_LIGHTBOX_IMG_WRAPPER = '.lightbox-gallery-image';
const SELECTOR_LIGHTBOX_CONTENT = '.lightbox-gallery-content';
const SELECTOR_IMG = `${SELECTOR_LIGHTBOX_MODAL} img`;
const SELECTOR_BTN_NEXT = '.lightbox-gallery-arrow-right button';
const SELECTOR_BTN_PREVIOUS = '.lightbox-gallery-arrow-left button';
const SELECTOR_BTN_CLOSE = '.lightbox-gallery-close-btn';
const SELECTOR_BTN_ZOOM = '.lightbox-gallery-zoom-btn';
const SELECTOR_BTN_FULLSCREEN = '.lightbox-gallery-fullscreen-btn';

@Component({
  selector: 'mdb-lightbox-test',
  template: template,
})
class TestLightboxComponent {
  @ViewChildren(MdbLightboxItemDirective) lightboxItems: QueryList<MdbLightboxItemDirective>;
  @ViewChild(MdbLightboxComponent) lightboxComponent: MdbLightboxComponent;
}

describe('MDB Lightbox', () => {
  let fixture: ComponentFixture<TestLightboxComponent>;
  let component: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestLightboxComponent],
      imports: [MdbLightboxModule, NoopAnimationsModule],
      teardown: { destroyAfterEach: false },
    });

    fixture = TestBed.createComponent(TestLightboxComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
  });

  it('should mount component', fakeAsync(() => {
    expect(component).toBeTruthy();
  }));

  it('should open on click', fakeAsync(() => {
    const lightboxItem = fixture.componentInstance.lightboxItems.toArray()[1];
    lightboxItem.el.nativeElement.click();

    fixture.detectChanges();
    flush();

    const lightboxModal = document.querySelector(SELECTOR_LIGHTBOX_MODAL);

    expect(lightboxModal).toBeTruthy();

    const src = document.querySelectorAll(SELECTOR_IMG)[1].getAttribute('src');

    expect(src).toBe(lightboxItem.img);
  }));

  it('should change img', fakeAsync(() => {
    const lightboxItems = fixture.componentInstance.lightboxItems.toArray();
    lightboxItems[0].el.nativeElement.click();

    fixture.detectChanges();
    flush();

    const lightboxModal = document.querySelector(SELECTOR_LIGHTBOX_MODAL);
    const ativeElementWrapper = document.querySelectorAll(SELECTOR_LIGHTBOX_IMG_WRAPPER);
    const arrowNext: HTMLElement = lightboxModal.querySelector(SELECTOR_BTN_NEXT);
    const arrowPrevious: HTMLElement = lightboxModal.querySelector(SELECTOR_BTN_PREVIOUS);
    let src = document.querySelectorAll(SELECTOR_IMG)[1].getAttribute('src');

    expect(src).toBe(lightboxItems[0].img);

    arrowNext.dispatchEvent(new MouseEvent('click'));
    ativeElementWrapper[1].dispatchEvent(new CustomEvent('transitionend'));

    fixture.detectChanges();

    src = document.querySelectorAll(SELECTOR_IMG)[2].getAttribute('src');

    expect(src).toBe(lightboxItems[1].img);

    arrowPrevious.dispatchEvent(new MouseEvent('click'));
    ativeElementWrapper[2].dispatchEvent(new CustomEvent('transitionend'));

    fixture.detectChanges();

    src = document.querySelectorAll(SELECTOR_IMG)[1].getAttribute('src');

    expect(src).toBe(lightboxItems[0].img);
  }));

  it('should close lightbox modal', fakeAsync(() => {
    const lightboxItems = fixture.componentInstance.lightboxItems.toArray();
    lightboxItems[0].el.nativeElement.click();

    fixture.detectChanges();
    flush();

    let lightboxModal = document.querySelector(SELECTOR_LIGHTBOX_MODAL);
    const closeBtn: HTMLElement = lightboxModal.querySelector(SELECTOR_BTN_CLOSE);

    expect(lightboxModal).toBeTruthy();

    closeBtn.dispatchEvent(new MouseEvent('click'));

    fixture.detectChanges();
    flush();

    lightboxModal = document.querySelector(SELECTOR_LIGHTBOX_MODAL);

    expect(lightboxModal).not.toBeTruthy();
  }));

  it('should toggle zoom on zoom btn click', () => {
    const lightboxItems = fixture.componentInstance.lightboxItems.toArray();
    lightboxItems[0].el.nativeElement.click();

    fixture.detectChanges();

    let lightboxModal = document.querySelector(SELECTOR_LIGHTBOX_MODAL);
    const zoomBtn: HTMLElement = lightboxModal.querySelector(SELECTOR_BTN_ZOOM);
    let activeElementWrapper = document.querySelectorAll(
      SELECTOR_LIGHTBOX_IMG_WRAPPER
    )[1] as HTMLElement;
    const activeImg = activeElementWrapper.querySelector('img');

    expect(zoomBtn.classList.contains('active')).toBe(false);
    expect(activeImg.style.transform).toBe('');

    zoomBtn.click();

    fixture.detectChanges();

    expect(zoomBtn.classList.contains('active')).toBe(true);
    expect(activeImg.style.transform).toContain('scale(2)');

    zoomBtn.click();

    fixture.detectChanges();

    expect(zoomBtn.classList.contains('active')).toBe(false);
    expect(activeImg.style.transform).toContain('scale(1)');
  });

  it('should toggle zoom on wheel scroll', () => {
    const lightboxItems = fixture.componentInstance.lightboxItems.toArray();
    lightboxItems[0].el.nativeElement.click();

    fixture.detectChanges();

    let lightboxModal = document.querySelector(SELECTOR_LIGHTBOX_MODAL);
    const zoomBtn: HTMLElement = lightboxModal.querySelector(SELECTOR_BTN_ZOOM);
    const activeElementWrapper = document.querySelectorAll(
      SELECTOR_LIGHTBOX_IMG_WRAPPER
    )[1] as HTMLElement;
    const activeImg = activeElementWrapper.querySelector('img');

    expect(zoomBtn.classList.contains('active')).toBe(false);
    expect(activeImg.style.transform).toBe('');

    activeImg.dispatchEvent(new WheelEvent('wheel', { deltaY: -100 }));

    fixture.detectChanges();

    expect(zoomBtn.classList.contains('active')).toBe(true);
    expect(activeImg.style.transform).toContain('scale(2)');

    activeImg.dispatchEvent(new WheelEvent('wheel', { deltaY: 100 }));

    fixture.detectChanges();

    expect(zoomBtn.classList.contains('active')).toBe(false);
    expect(activeImg.style.transform).toContain('scale(1)');
  });

  it('should handle keyboard events', fakeAsync(() => {
    const lightboxItems = fixture.componentInstance.lightboxItems.toArray();
    lightboxItems[0].el.nativeElement.click();

    fixture.detectChanges();

    let lightboxModal = document.querySelector(SELECTOR_LIGHTBOX_MODAL);
    const zoomBtn: HTMLElement = lightboxModal.querySelector(SELECTOR_BTN_ZOOM);
    let activeElementWrapper = document.querySelectorAll(
      SELECTOR_LIGHTBOX_IMG_WRAPPER
    )[1] as HTMLElement;
    let activeImg = activeElementWrapper.querySelector('img');
    const imgs = document.querySelectorAll(SELECTOR_IMG);

    expect(zoomBtn.classList.contains('active')).toBe(false);
    expect(activeImg.style.transform).toBe('');
    expect(imgs[1].getAttribute('src')).toBe(lightboxItems[0].img);

    lightboxModal.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowRight' }));
    activeImg.dispatchEvent(new CustomEvent('transitionend'));

    fixture.detectChanges();
    expect(imgs[2].getAttribute('src')).toBe(lightboxItems[1].img);

    lightboxModal.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowLeft' }));
    activeElementWrapper = document.querySelectorAll(
      SELECTOR_LIGHTBOX_IMG_WRAPPER
    )[2] as HTMLElement;
    activeElementWrapper.dispatchEvent(new CustomEvent('transitionend'));

    fixture.detectChanges();
    flush();

    expect(imgs[1].getAttribute('src')).toBe(lightboxItems[0].img);

    lightboxModal.dispatchEvent(new KeyboardEvent('keyup', { key: 'Home' }));
    activeElementWrapper = document.querySelectorAll(
      SELECTOR_LIGHTBOX_IMG_WRAPPER
    )[0] as HTMLElement;
    activeElementWrapper.dispatchEvent(new CustomEvent('transitionend'));

    fixture.detectChanges();
    flush();

    expect(imgs[0].getAttribute('src')).toBe(lightboxItems[0].img);

    lightboxModal.dispatchEvent(new KeyboardEvent('keyup', { key: 'End' }));
    activeElementWrapper = document.querySelectorAll(
      SELECTOR_LIGHTBOX_IMG_WRAPPER
    )[2] as HTMLElement;
    activeImg = activeElementWrapper.querySelector('img');
    activeElementWrapper.dispatchEvent(new CustomEvent('transitionend'));

    fixture.detectChanges();
    flush();

    expect(imgs[2].getAttribute('src')).toBe(lightboxItems[2].img);

    lightboxModal.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowUp' }));
    activeElementWrapper.dispatchEvent(new CustomEvent('transitionend'));

    fixture.detectChanges();
    flush();

    expect(zoomBtn.classList.contains('active')).toBe(true);
    expect(activeImg.style.transform).toContain('scale(2)');

    lightboxModal.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowDown' }));
    activeElementWrapper.dispatchEvent(new CustomEvent('transitionend'));

    fixture.detectChanges();
    flush();

    expect(zoomBtn.classList.contains('active')).toBe(false);
    expect(activeImg.style.transform).toContain('scale(1)');

    lightboxModal.dispatchEvent(new KeyboardEvent('keyup', { key: 'Escape' }));
    activeElementWrapper.dispatchEvent(new CustomEvent('transitionend'));

    fixture.detectChanges();
    flush();

    lightboxModal = document.querySelector(SELECTOR_LIGHTBOX_MODAL);

    expect(lightboxModal).not.toBeTruthy();
  }));

  it('should handle double click & double tap', fakeAsync(() => {
    const lightboxItems = fixture.componentInstance.lightboxItems.toArray();
    lightboxItems[0].el.nativeElement.click();

    fixture.detectChanges();
    flush();

    const activeElementWrapper = document.querySelectorAll(
      SELECTOR_LIGHTBOX_IMG_WRAPPER
    )[1] as HTMLElement;
    const activeImg = activeElementWrapper.querySelector('img');

    activeImg.dispatchEvent(new MouseEvent('mousedown'));
    activeImg.dispatchEvent(new MouseEvent('mouseup'));
    activeImg.dispatchEvent(new MouseEvent('mousedown'));
    activeImg.dispatchEvent(new MouseEvent('mouseup'));
    activeElementWrapper.dispatchEvent(new CustomEvent('transitionend'));

    fixture.detectChanges();
    flush();

    expect(activeImg.style.transform).toContain('scale(2)');

    activeImg.dispatchEvent(new MouseEvent('mousedown'));
    activeImg.dispatchEvent(new MouseEvent('mouseup'));
    activeImg.dispatchEvent(new MouseEvent('mousedown'));
    activeImg.dispatchEvent(new MouseEvent('mouseup'));
    activeElementWrapper.dispatchEvent(new CustomEvent('transitionend'));

    fixture.detectChanges();
    flush();

    expect(activeImg.style.transform).toContain('scale(1)');
  }));
});
