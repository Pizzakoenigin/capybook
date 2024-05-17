import { Component, Provider, Type, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MdbMultiRangeModule } from './multi-range.module';
import { MdbMultiRangeThumbDirective } from './multi-range-thumb.directive';
import { FormsModule } from '@angular/forms';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { MdbMultiRangeComponent } from 'mdb-angular-ui-kit/multi-range/multi-range.component';

describe('MDB Multi Range', () => {
  function createComponent<T>(component: Type<T>, providers: Provider[] = []): ComponentFixture<T> {
    TestBed.configureTestingModule({
      imports: [MdbMultiRangeModule, NoopAnimationsModule, MdbFormsModule, FormsModule],
      declarations: [TestMultiRangeComponent],
      teardown: { destroyAfterEach: false },
    });

    TestBed.compileComponents();

    return TestBed.createComponent<T>(component);
  }

  describe('after init', () => {
    let fixture: ComponentFixture<TestMultiRangeComponent>;
    let element: HTMLElement;
    let component: TestMultiRangeComponent;
    let directive: MdbMultiRangeThumbDirective;

    const dispatchDrag = (clientX, thumb) => {
      const event = new MouseEvent('mousemove', {
        view: window,
        bubbles: true,
        cancelable: true,
        clientX: clientX,
        clientY: 0,
      });
      thumb.dispatchEvent(event);
    };

    beforeEach(async () => {
      Object.defineProperties(window.HTMLElement.prototype, {
        offsetWidth: {
          get: function () {
            return 116;
          },
        },
      });

      fixture = createComponent(TestMultiRangeComponent);
      component = fixture.componentInstance;
      element = fixture.nativeElement;
      fixture.detectChanges();

      directive = fixture.debugElement
        .query(By.directive(MdbMultiRangeThumbDirective))
        .injector.get(MdbMultiRangeThumbDirective) as MdbMultiRangeThumbDirective;
    });

    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    describe('mouse pointer', () => {
      it('should change control value upon ui thumb sliding', () => {
        let thumbs = document.querySelectorAll('.thumb');

        thumbs[0].dispatchEvent(new MouseEvent('mousedown'));
        dispatchDrag(10, thumbs[0]);
        document.dispatchEvent(new MouseEvent('mouseup'));

        fixture.detectChanges();

        expect(component.external[0]).toBe(30);
        expect(component.external[1]).toBe(60);

        thumbs[1].dispatchEvent(new MouseEvent('mousedown'));
        dispatchDrag(-2, thumbs[1]);
        document.dispatchEvent(new MouseEvent('mouseup'));

        fixture.detectChanges();

        expect(component.external[0]).toBe(30);
        expect(component.external[1]).toBe(58);
      });

      it('should render and update tooltips', () => {
        let thumbs = document.querySelectorAll('.thumb');

        component.tooltip = true;
        fixture.detectChanges();

        thumbs[0].dispatchEvent(new MouseEvent('mousedown'));
        dispatchDrag(10, thumbs[0]);
        fixture.detectChanges();

        let tooltip1 = element.querySelector('.multi-range-slider-tooltip') as HTMLElement;
        expect(tooltip1).toBeTruthy();

        expect(tooltip1.textContent).toBe('30');
        document.dispatchEvent(new MouseEvent('mouseup'));
        fixture.detectChanges();
        tooltip1 = element.querySelector('.multi-range-slider-tooltip') as HTMLElement;

        expect(tooltip1).toBeFalsy();

        thumbs[1].dispatchEvent(new MouseEvent('mousedown'));
        dispatchDrag(20, thumbs[1]);
        fixture.detectChanges();

        const tooltip2 = element.querySelector('.multi-range-slider-tooltip') as HTMLElement;
        expect(tooltip2).toBeTruthy();

        expect(tooltip2.textContent).toBe('80');
      });

      it('should move at a pace multiplied by step input value', () => {
        let thumbs = document.querySelectorAll('.thumb');
        component.step = 5;
        fixture.detectChanges();

        thumbs[0].dispatchEvent(new MouseEvent('mousedown'));
        dispatchDrag(5, thumbs[0]);
        document.dispatchEvent(new MouseEvent('mouseup'));
        fixture.detectChanges();

        expect(component.external[0]).toBe(25);

        thumbs[0].dispatchEvent(new MouseEvent('mousedown'));
        dispatchDrag(8, thumbs[0]);
        document.dispatchEvent(new MouseEvent('mouseup'));
        fixture.detectChanges();

        expect(component.external[0]).toBe(25);

        thumbs[0].dispatchEvent(new MouseEvent('mousedown'));
        dispatchDrag(24, thumbs[0]);
        document.dispatchEvent(new MouseEvent('mouseup'));
        fixture.detectChanges();

        expect(component.external[0]).toBe(25);

        thumbs[0].dispatchEvent(new MouseEvent('mousedown'));
        dispatchDrag(25, thumbs[0]);
        document.dispatchEvent(new MouseEvent('mouseup'));
        fixture.detectChanges();

        expect(component.external[0]).toBe(50);
      });

      it('shouldnt take value under min', () => {
        let thumbs = document.querySelectorAll('.thumb');
        component.min = 25;
        fixture.detectChanges();

        thumbs[0].dispatchEvent(new MouseEvent('mousedown'));
        dispatchDrag(-116, thumbs[0]);
        document.dispatchEvent(new MouseEvent('mouseup'));
        fixture.detectChanges();

        expect(component.external[0]).toBe(25);
      });

      it('shouldnt take value over max', () => {
        let thumbs = document.querySelectorAll('.thumb');
        component.max = 45;
        fixture.detectChanges();

        thumbs[1].dispatchEvent(new MouseEvent('mousedown'));
        dispatchDrag(116, thumbs[1]);
        document.dispatchEvent(new MouseEvent('mouseup'));
        fixture.detectChanges();

        expect(component.external[1]).toBe(45);
      });

      it('should dispatch events on drag move at proper time', () => {
        const multiRange = component.multiRange;
        const thumbs = document.querySelectorAll('.thumb');
        const spyStartDrag = jest.spyOn(multiRange.startDrag, 'emit');
        const spyEndDrag = jest.spyOn(multiRange.endDrag, 'emit');
        const spyChangeValue = jest.spyOn(multiRange.changeValue, 'emit');

        thumbs[0].dispatchEvent(new MouseEvent('mousedown'));
        fixture.detectChanges();
        expect(spyStartDrag).toHaveBeenCalledTimes(1);
        dispatchDrag(10, thumbs[0]);
        document.dispatchEvent(new MouseEvent('mouseup'));
        fixture.detectChanges();
        expect(spyChangeValue).toHaveBeenCalledTimes(1);
        expect(spyEndDrag).toHaveBeenCalledTimes(1);
      });
    });
  });
});

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'mdb-test-mention',
  template: `
    <mdb-multi-range
      [step]="step"
      [tooltip]="tooltip"
      [startValues]="startValues"
      [(ngModel)]="external"
      [min]="min"
      [max]="max"
    ></mdb-multi-range>
  `,
})
class TestMultiRangeComponent {
  @ViewChild(MdbMultiRangeComponent) multiRange: MdbMultiRangeComponent;
  step = 0;
  startValues = [20, 60];
  external = [0, 0];
  tooltip = false;
  min = 0;
  max = 100;
}
