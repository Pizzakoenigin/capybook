import { TestBed, ComponentFixture, flush, fakeAsync, tick } from '@angular/core/testing';
import {
  ElementRef,
  NgModule,
  Provider,
  QueryList,
  Type,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MdbSidenavModule } from './sidenav.module';
import { Component } from '@angular/core';
import { MdbSidenavComponent } from './sidenav.component';
import { MdbSidenavItemComponent } from './sidenav-item.component';
import { MdbSidenavLayoutComponent } from './sidenav-loyaut.component';

import { MdbCollapseModule } from '../collapse/collapse.module';
import { MdbCollapseDirective } from '../collapse';

describe('MDB Sidenav', () => {
  let fixture: ComponentFixture<TestSidenavComponent>;
  let sidenavLayout: MdbSidenavLayoutComponent;
  let firstItem: ElementRef;
  let secondItem: ElementRef;
  let firstCollapse: ElementRef;
  let secondCollapse: ElementRef;
  let sidenavToggle: ElementRef;
  let sidenavItem: QueryList<MdbSidenavItemComponent>;
  let testComponent: TestSidenavComponent;
  let sidenavComponent: MdbSidenavComponent;
  let sidenavEl: HTMLElement;
  let collapseElements: NodeListOf<HTMLElement>;
  let sidenavBackdropEl: HTMLElement;

  function createComponent<T>(component: Type<T>, providers: Provider[] = []): ComponentFixture<T> {
    TestBed.configureTestingModule({
      imports: [MdbSidenavModule, MdbCollapseModule],
      declarations: [component],
      providers: [...providers],
      teardown: { destroyAfterEach: false },
    });

    TestBed.compileComponents();

    return TestBed.createComponent<T>(component);
  }

  beforeEach(() => {
    fixture = createComponent(TestSidenavComponent);
    fixture.detectChanges();
    testComponent = fixture.componentInstance;
    sidenavLayout = testComponent.sidenavLayout;
    sidenavItem = testComponent.sidenavItem;
    firstItem = testComponent.firstItem;
    secondItem = testComponent.secondItem;
    firstCollapse = testComponent.firstCollapse;
    secondCollapse = testComponent.secondCollapse;
    sidenavComponent = testComponent.sidenavComponent;
    sidenavToggle = testComponent.sidenavToggle;
    sidenavEl = document.querySelector('.sidenav') as HTMLElement;
    collapseElements = document.querySelectorAll('.sidenav-collapse');
    sidenavBackdropEl = document.querySelector('.sidenav-backdrop') as HTMLElement;
  });

  it('should change default options', fakeAsync(() => {
    testComponent.color = 'secondary';
    testComponent.accordion = true;
    testComponent.backdrop = false;
    testComponent.backdropClass = 'test';
    testComponent.closeOnEsc = false;
    testComponent.expandOnHover = true;
    testComponent.hidden = false;
    testComponent.mode = 'push';
    testComponent.scrollContainer = '#testScroll2';
    testComponent.slim = true;
    testComponent.slimCollapsed = true;
    testComponent.slimWidth = 100;
    testComponent.position = 'fixed';
    testComponent.right = true;
    testComponent.transitionDuration = 500;
    testComponent.width = 500;
    testComponent.focusTrap = false;
    testComponent.disableWindowScroll = true;

    fixture.detectChanges();
    tick();
    flush();

    expect(sidenavComponent.color).toBe('secondary');
    expect(sidenavComponent.accordion).toBe(true);
    expect(sidenavComponent.backdrop).toBe(false);
    expect(sidenavComponent.backdropClass).toBe('test');
    expect(sidenavComponent.closeOnEsc).toBe(false);
    expect(sidenavComponent.expandOnHover).toBe(true);
    expect(sidenavComponent.hidden).toBe(false);
    expect(sidenavComponent.mode).toBe('push');
    expect(sidenavComponent.scrollContainer).toBe('#testScroll2');
    expect(sidenavComponent.slim).toBe(true);
    expect(sidenavComponent.slimCollapsed).toBe(true);
    expect(sidenavComponent.slimWidth).toBe(100);
    expect(sidenavComponent.position).toBe('fixed');
    expect(sidenavComponent.right).toBe(true);
    expect(sidenavComponent.transitionDuration).toBe(500);
    expect(sidenavComponent.width).toBe(500);
    expect(sidenavComponent.focusTrap).toBe(false);
    expect(sidenavComponent.disableWindowScroll).toBe(true);
  }));

  it('should open and close on togle click', fakeAsync(() => {
    fixture.detectChanges();
    flush();

    jest.spyOn(sidenavComponent, 'isVisible', 'get').mockReturnValue(false);
    sidenavToggle.nativeElement.click();
    fixture.detectChanges();
    flush();

    expect(sidenavEl.style.transform).toBe('translateX(0%)');

    jest.spyOn(sidenavComponent, 'isVisible', 'get').mockReturnValue(true);
    sidenavToggle.nativeElement.click();
    fixture.detectChanges();
    flush();

    expect(sidenavEl.style.transform).toBe('translateX(-100%)');
  }));

  it('should close on backdrop click', fakeAsync(() => {
    fixture.detectChanges();
    flush();

    jest.spyOn(sidenavComponent, 'isVisible', 'get').mockReturnValue(false);
    sidenavToggle.nativeElement.click();
    fixture.detectChanges();
    flush();

    expect(sidenavEl.style.transform).toBe('translateX(0%)');

    sidenavBackdropEl = document.querySelector('.sidenav-backdrop');
    jest.spyOn(sidenavComponent, 'isVisible', 'get').mockReturnValue(true);
    sidenavBackdropEl.click();
    fixture.detectChanges();
    flush();

    expect(sidenavEl.style.transform).toBe('translateX(-100%)');
  }));

  it('should set active el and remove active class for prev el', fakeAsync(() => {
    fixture.detectChanges();
    flush();

    expect(firstItem.nativeElement.classList.contains('active')).toBe(false);
    expect(secondItem.nativeElement.classList.contains('active')).toBe(false);

    firstItem.nativeElement.click();

    expect(firstItem.nativeElement.classList.contains('active')).toBe(true);
    expect(secondItem.nativeElement.classList.contains('active')).toBe(false);

    secondItem.nativeElement.click();

    expect(firstItem.nativeElement.classList.contains('active')).toBe(false);
    expect(secondItem.nativeElement.classList.contains('active')).toBe(true);
  }));

  it('should toggle collapse item group on "enter" keydown', fakeAsync(() => {
    fixture.detectChanges();
    flush();

    const enterEvent = new KeyboardEvent('keydown', {
      bubbles: true,
      keyCode: 13,
      key: 'Enter',
    });

    const sEvent = new KeyboardEvent('keydown', {
      bubbles: true,
      keyCode: 83,
      key: 's',
    });

    expect(collapseElements[0].classList.contains('show')).toBe(false);
    expect(collapseElements[collapseElements.length - 1].classList.contains('show')).toBe(false);

    firstCollapse.nativeElement.dispatchEvent(sEvent);

    fixture.detectChanges();
    flush();

    expect(collapseElements[0].classList.contains('show')).toBe(false);
    expect(collapseElements[collapseElements.length - 1].classList.contains('show')).toBe(false);

    firstCollapse.nativeElement.dispatchEvent(enterEvent);

    fixture.detectChanges();
    flush();

    expect(collapseElements[0].classList.contains('show')).toBe(true);
    expect(collapseElements[collapseElements.length - 1].classList.contains('show')).toBe(false);

    secondCollapse.nativeElement.dispatchEvent(enterEvent);
    fixture.detectChanges();
    flush();

    expect(collapseElements[0].classList.contains('show')).toBe(true);
    expect(collapseElements[collapseElements.length - 1].classList.contains('show')).toBe(true);

    secondCollapse.nativeElement.dispatchEvent(enterEvent);
    fixture.detectChanges();
    flush();

    expect(collapseElements[0].classList.contains('show')).toBe(true);
    expect(collapseElements[collapseElements.length - 1].classList.contains('show')).toBe(false);

    firstCollapse.nativeElement.dispatchEvent(enterEvent);
    fixture.detectChanges();
    flush();

    expect(collapseElements[0].classList.contains('show')).toBe(false);
    expect(collapseElements[collapseElements.length - 1].classList.contains('show')).toBe(false);
  }));

  it('should toggle collapse item group', fakeAsync(() => {
    fixture.detectChanges();
    flush();

    expect(collapseElements[0].classList.contains('show')).toBe(false);
    expect(collapseElements[collapseElements.length - 1].classList.contains('show')).toBe(false);

    firstCollapse.nativeElement.click();
    fixture.detectChanges();
    flush();

    expect(collapseElements[0].classList.contains('show')).toBe(true);
    expect(collapseElements[collapseElements.length - 1].classList.contains('show')).toBe(false);

    secondCollapse.nativeElement.click();
    fixture.detectChanges();
    flush();

    expect(collapseElements[0].classList.contains('show')).toBe(true);
    expect(collapseElements[collapseElements.length - 1].classList.contains('show')).toBe(true);

    secondCollapse.nativeElement.click();
    fixture.detectChanges();
    flush();
    expect(collapseElements[0].classList.contains('show')).toBe(true);
    expect(collapseElements[collapseElements.length - 1].classList.contains('show')).toBe(false);

    firstCollapse.nativeElement.click();
    fixture.detectChanges();
    flush();

    expect(collapseElements[0].classList.contains('show')).toBe(false);
    expect(collapseElements[collapseElements.length - 1].classList.contains('show')).toBe(false);
  }));

  it('should close other category list if accordion = true', fakeAsync(() => {
    testComponent.accordion = true;
    fixture.detectChanges();
    flush();

    expect(collapseElements[0].classList.contains('show')).toBe(false);
    expect(collapseElements[collapseElements.length - 1].classList.contains('show')).toBe(false);

    firstCollapse.nativeElement.click();
    fixture.detectChanges();
    flush();

    expect(collapseElements[0].classList.contains('show')).toBe(true);
    expect(collapseElements[collapseElements.length - 1].classList.contains('show')).toBe(false);

    secondCollapse.nativeElement.click();
    fixture.detectChanges();
    flush();

    expect(collapseElements[0].classList.contains('show')).toBe(false);
    expect(collapseElements[collapseElements.length - 1].classList.contains('show')).toBe(true);

    secondCollapse.nativeElement.click();
    fixture.detectChanges();
    flush();

    expect(collapseElements[0].classList.contains('show')).toBe(false);
    expect(collapseElements[collapseElements.length - 1].classList.contains('show')).toBe(false);
  }));

  it('should toggle slim programmatically', fakeAsync(() => {
    fixture.detectChanges();
    flush();

    const sidenavWidth = sidenavComponent.width + 'px';

    expect(sidenavEl.style.width).toBe(sidenavWidth);

    sidenavComponent.toggleSlim();
    fixture.detectChanges();
    flush();

    const sidenavSlimWidth = sidenavComponent.slimWidth + 'px';

    expect(sidenavEl.style.width).toBe(sidenavSlimWidth);
  }));
  it('should add and remove class sidenav-slim', fakeAsync(() => {
    sidenavComponent.slim = true;
    sidenavComponent.slimCollapsed = true;
    fixture.detectChanges();
    flush();

    expect(sidenavEl.classList).toContain('sidenav-slim');

    sidenavComponent.toggleSlim();
    fixture.detectChanges();
    flush();
    expect(sidenavEl.classList).not.toContain('sidenav-slim');
  }));

  it('should toggle mode programmatically', fakeAsync(() => {
    fixture.detectChanges();
    flush();

    expect(sidenavComponent.mode).toBe('over');

    sidenavComponent.setMode('push');
    fixture.detectChanges();
    flush();

    expect(sidenavComponent.mode).toBe('push');
  }));

  it('should set right sidenav', fakeAsync(() => {
    fixture.detectChanges();
    flush();

    expect(sidenavComponent.right).toBe(false);
    expect(sidenavEl.classList.contains('sidenav-right')).toBe(false);

    testComponent.right = true;
    fixture.detectChanges();
    flush();

    expect(sidenavComponent.right).toBe(true);
    expect(sidenavEl.classList.contains('sidenav-right')).toBe(true);
  }));

  it('should show backdrop on open and hide backdrop on close', fakeAsync(() => {
    let sidenavBackdropEl = document.querySelector('.sidenav-backdrop') as HTMLElement;
    fixture.detectChanges();
    flush();

    expect(document.querySelector('.sidenav-backdrop')).toBe(null);

    jest.spyOn(sidenavComponent, 'isVisible', 'get').mockReturnValue(false);
    sidenavToggle.nativeElement.click();
    fixture.detectChanges();
    flush();
    sidenavBackdropEl = document.querySelector('.sidenav-backdrop');
    expect(sidenavBackdropEl).not.toBe(null);
    expect(sidenavBackdropEl.style.opacity).toBe('1');

    jest.spyOn(sidenavComponent, 'isVisible', 'get').mockReturnValue(true);
    sidenavToggle.nativeElement.click();
    fixture.detectChanges();
    flush();
    sidenavBackdropEl = document.querySelector('.sidenav-backdrop');
    expect(sidenavBackdropEl).not.toBe(null);
    expect(sidenavBackdropEl.style.opacity).toBe('0');
  }));

  it('should dont show backdrop if backdrop = false', fakeAsync(() => {
    testComponent.backdrop = false;
    fixture.detectChanges();
    flush();

    let sidenavBackdropEl = document.querySelector('.sidenav-backdrop') as HTMLElement;
    expect(sidenavBackdropEl).toBe(null);

    jest.spyOn(sidenavComponent, 'isVisible', 'get').mockReturnValue(false);
    sidenavToggle.nativeElement.click();
    fixture.detectChanges();
    flush();
    sidenavBackdropEl = document.querySelector('.sidenav-backdrop') as HTMLElement;
    expect(sidenavBackdropEl).toBe(null);

    jest.spyOn(sidenavComponent, 'isVisible', 'get').mockReturnValue(true);
    sidenavToggle.nativeElement.click();
    fixture.detectChanges();
    flush();

    sidenavBackdropEl = document.querySelector('.sidenav-backdrop') as HTMLElement;
    expect(sidenavBackdropEl).toBe(null);
  }));

  it('should toggle color', fakeAsync(() => {
    fixture.detectChanges();
    flush();

    let sidenavBackdropEl = document.querySelector('.sidenav-backdrop') as HTMLElement;
    expect(sidenavEl.classList.contains('sidenav-primary')).toBe(true);

    testComponent.color = 'secondary';
    fixture.detectChanges();
    flush();

    expect(sidenavEl.classList.contains('sidenav-secondary')).toBe(true);
  }));

  it('should add custom backdrop class', fakeAsync(() => {
    testComponent.backdropClass = 'custom-class';
    fixture.detectChanges();
    flush();

    jest.spyOn(sidenavComponent, 'isVisible', 'get').mockReturnValue(false);
    sidenavToggle.nativeElement.click();
    fixture.detectChanges();
    flush();

    sidenavBackdropEl = document.querySelector('.custom-class');
    expect(sidenavBackdropEl).not.toBe(null);
    expect(sidenavBackdropEl.classList.contains('custom-class')).toBe(true);
  }));

  it('should close on esc', fakeAsync(() => {
    fixture.detectChanges();
    flush();

    jest.spyOn(sidenavComponent, 'isVisible', 'get').mockReturnValue(false);
    sidenavToggle.nativeElement.click();
    fixture.detectChanges();
    flush();

    expect(sidenavEl.style.transform).toBe('translateX(0%)');

    jest.spyOn(sidenavComponent, 'isVisible', 'get').mockReturnValue(true);
    const event = new KeyboardEvent('keydown', { code: 'Escape' });
    document.dispatchEvent(event);
    fixture.detectChanges();
    flush();

    expect(sidenavEl.style.transform).toBe('translateX(-100%)');
  }));

  it('should disable scroll when sidenav is opened with disableWindowScroll', fakeAsync(() => {
    testComponent.disableWindowScroll = true;
    fixture.detectChanges();
    flush();

    const testDiv = document.createElement('div');
    testDiv.textContent = 'Test Div';
    testDiv.style.height = '2000px';
    document.body.appendChild(testDiv);

    jest.spyOn(sidenavComponent, 'isVisible', 'get').mockReturnValue(false);
    sidenavToggle.nativeElement.click();
    fixture.detectChanges();
    flush();

    expect(sidenavEl.style.transform).toBe('translateX(0%)');
    expect(document.body.style.overflow).toBe('hidden');

    jest.spyOn(sidenavComponent, 'isVisible', 'get').mockReturnValue(true);
    sidenavToggle.nativeElement.click();
    fixture.detectChanges();
    flush();

    expect(sidenavEl.style.transform).toBe('translateX(-100%)');
    expect(document.body.style.overflow).toBe('');
  }));
});

@Component({
  selector: 'mdb-test-sidenav-item',
  template: `
    <mdb-sidenav-layout>
      <mdb-sidenav
        #sidenav="mdbSidenav"
        [color]="color"
        [accordion]="accordion"
        [backdrop]="backdrop"
        [backdropClass]="backdropClass"
        [closeOnEsc]="closeOnEsc"
        [expandOnHover]="expandOnHover"
        [hidden]="hidden"
        [mode]="mode"
        [scrollContainer]="scrollContainer"
        [slim]="slim"
        [slimCollapsed]="slimCollapsed"
        [slimWidth]="slimWidth"
        [position]="position"
        [right]="right"
        [transitionDuration]="transitionDuration"
        [width]="width"
        [focusTrap]="focusTrap"
        [disableWindowScroll]="disableWindowScroll"
      >
        <ul id="testScroll2"></ul>
        <ul class="sidenav-menu" id="testScroll">
          <mdb-sidenav-item>
            <a class="sidenav-link"><i class="far fa-smile fa-fw me-3"></i><span>Link 1</span></a>
          </mdb-sidenav-item>
          <mdb-sidenav-item>
            <a class="sidenav-link" #firstCollapse
              ><i class="fas fa-grin fa-fw me-3"></i><span>Category 1</span></a
            >
            <ul class="sidenav-collapse" mdbCollapse>
              <li class="sidenav-item">
                <a class="sidenav-link" #firstItem>Link 2</a>
              </li>
              <li class="sidenav-item">
                <a class="sidenav-link" #secondItem>Link 3</a>
              </li>
            </ul>
          </mdb-sidenav-item>
          <mdb-sidenav-item>
            <a class="sidenav-link" #secondCollapse
              ><i class="fas fa-grin-wink fa-fw me-3"></i><span>Category 4</span></a
            >
            <ul class="sidenav-collapse" mdbCollapse>
              <li class="sidenav-item">
                <a class="sidenav-link">Link 7</a>
              </li>
              <li class="sidenav-item">
                <a class="sidenav-link">Link 8</a>
              </li>
            </ul>
          </mdb-sidenav-item>
        </ul>
      </mdb-sidenav>
      <mdb-sidenav-content>
        <!-- Toggler -->
        <button #sidenavToggle class="btn btn-primary" (click)="sidenav.toggle()">
          <i class="fas fa-bars"></i>
        </button>
        <!-- Toggler -->
      </mdb-sidenav-content>
    </mdb-sidenav-layout>
  `,
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
class TestSidenavComponent {
  @ViewChild('firstItem') firstItem: ElementRef;
  @ViewChild('secondItem') secondItem: ElementRef;
  @ViewChild('sidenavToggle') sidenavToggle: ElementRef;
  @ViewChild('firstCollapse') firstCollapse: ElementRef;
  @ViewChild('secondCollapse') secondCollapse: ElementRef;
  @ViewChildren(MdbSidenavItemComponent) sidenavItem: QueryList<MdbSidenavItemComponent>;
  @ViewChild(MdbSidenavLayoutComponent) sidenavLayout: MdbSidenavLayoutComponent;
  @ViewChild(MdbSidenavComponent) sidenavComponent: MdbSidenavComponent;
  @ViewChildren(MdbCollapseDirective) collapseElements: QueryList<MdbCollapseDirective>;

  color = 'primary';
  accordion = false;
  backdrop = true;
  backdropClass: string;
  closeOnEsc = true;
  expandOnHover = false;
  hidden = true;
  mode = 'over';
  scrollContainer = '#testScroll';
  slim = false;
  slimCollapsed = false;
  slimWidth = 70;
  position = 'absolute';
  right = false;
  transitionDuration = 300;
  width = 240;
  focusTrap = true;
  disableWindowScroll = false;
}

const routes: Routes = [
  // Main
  { path: '', component: TestSidenavComponent },
  { path: 'test-path', component: TestSidenavComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule],
})
export class AppRoutingModule {}
