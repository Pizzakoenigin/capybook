import { Component, Provider, Type } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MdbInputMaskModule } from './input-mask.module';
import { MdbInputMaskDirective } from './input-mask.directive';

import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';

describe('MdbInputMaskComponent', () => {
  function createKeyboardEvent(type: string, keyCode: number, key?: string): KeyboardEvent {
    const event = new KeyboardEvent(type);

    Object.defineProperty(event, 'keyCode', {
      get: () => keyCode,
    });

    Object.defineProperty(event, 'key', {
      get: () => key,
    });

    return event;
  }

  function createComponent<T>(component: Type<T>, providers: Provider[] = []): ComponentFixture<T> {
    TestBed.configureTestingModule({
      imports: [MdbInputMaskModule, NoopAnimationsModule, MdbFormsModule],
      declarations: [TestInputMaskComponent],
      teardown: { destroyAfterEach: false },
    });

    TestBed.compileComponents();

    return TestBed.createComponent<T>(component);
  }
  describe('after init', () => {
    let fixture: ComponentFixture<TestInputMaskComponent>;
    let element: HTMLElement;
    let component: TestInputMaskComponent;
    let directive: MdbInputMaskDirective;

    beforeEach(async () => {
      fixture = createComponent(TestInputMaskComponent);
      component = fixture.componentInstance;
      element = fixture.nativeElement;
      fixture.detectChanges();

      directive = fixture.debugElement
        .query(By.directive(MdbInputMaskDirective))
        .injector.get(MdbInputMaskDirective) as MdbInputMaskDirective;
      fixture.detectChanges();
    });

    describe('Init', () => {
      it('should set default input mask as a placeholder', () => {
        const inputEl = document.querySelector('input');

        expect(inputEl.classList.contains('active')).toBe(true);
        expect(inputEl.placeholder).toBe('aaa999***');
      });

      it('should update mask placeholder if mdbInputMask input is changed', () => {
        const inputEl = document.querySelector('input');

        expect(inputEl.placeholder).toBe('aaa999***');

        component.inputMask = 'a9*';
        fixture.detectChanges();

        expect(inputEl.placeholder).toBe('a9*');
      });
    });

    describe('Keyboard input', () => {
      it('should introduce valid values to basic example', () => {
        component.inputMask = 'aaa999***';

        fixture.detectChanges();

        const inputEl = document.querySelector('input');
        inputEl.value = 'mmmm';
        inputEl.dispatchEvent(createKeyboardEvent('input', 109, 'm'));

        fixture.detectChanges();

        expect(inputEl.value).toBe('mmm');

        inputEl.value = 'mmm4';
        inputEl.dispatchEvent(createKeyboardEvent('input', 4, 'Digit4'));

        fixture.detectChanges();

        expect(inputEl.value).toBe('mmm4');

        inputEl.value = 'mmm44';
        inputEl.dispatchEvent(createKeyboardEvent('input', 4, '4'));

        fixture.detectChanges();

        expect(inputEl.value).toBe('mmm44');
        inputEl.value = 'mmm44f';
        inputEl.dispatchEvent(createKeyboardEvent('input', 70, 'f'));

        expect(inputEl.value).toBe('mmm44');
      });

      it('should clear on blur', () => {
        const inputEl = document.querySelector('input');

        inputEl.value = 'mmmm';
        inputEl.dispatchEvent(createKeyboardEvent('input', 4, 'Digit4'));

        fixture.detectChanges();

        expect(inputEl.value).toBe('mmm');

        inputEl.dispatchEvent(new Event('blur'));
        fixture.detectChanges();

        expect(inputEl.value).toBe('');
      });

      it('shouldnt clear on blur when clearIncomplete is set to false', () => {
        component.clearIncomplete = false;
        const inputEl = document.querySelector('input');

        inputEl.value = 'mmmm';
        inputEl.dispatchEvent(createKeyboardEvent('input', 4, 'Digit4'));

        fixture.detectChanges();

        expect(inputEl.value).toBe('mmm');

        inputEl.dispatchEvent(new Event('blur'));
        fixture.detectChanges();

        expect(inputEl.value).toBe('mmm');
      });
    });
  });
});

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'mdb-test-input-mask',
  template: `
    <mdb-form-control>
      <input
        [mdbInputMask]="inputMask"
        [clearIncomplete]="clearIncomplete"
        type="text"
        id="form1"
        class="form-control"
        autocomplete="off"
      />
      <label mdbLabel class="form-label" for="form1">Example label</label>
    </mdb-form-control>
  `,
})
class TestInputMaskComponent {
  inputMask = 'aaa999***';
  clearIncomplete = true;
}
