import {
  Component,
  OnInit,
  Provider,
  Type,
  ViewChild,
  ViewChildren,
  QueryList,
} from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { startWith, map, tap } from 'rxjs/operators';
import { TestBed, ComponentFixture, inject, fakeAsync, flush } from '@angular/core/testing';
import { MdbAutocompleteModule } from './autocomplete.module';
import { UntypedFormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { OverlayContainer } from '@angular/cdk/overlay';
import { MdbAutocompleteDirective } from './autocomplete.directive';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import {
  DOWN_ARROW,
  ESCAPE,
  UP_ARROW,
  TAB,
  HOME,
  END,
  ENTER,
  LEFT_ARROW,
} from '@angular/cdk/keycodes';
import { MdbOptionComponent } from 'mdb-angular-ui-kit/option';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MdbAutocompleteComponent } from './autocomplete.component';

function createKeyboardEvent(type: string, keyCode: number, modifier?: string): KeyboardEvent {
  const event = new KeyboardEvent(type);

  Object.defineProperty(event, 'keyCode', {
    get: () => keyCode,
  });

  if (modifier === 'alt') {
    Object.defineProperty(event, 'altKey', {
      get: () => true,
    });
  }

  return event;
}

const BASIC_TEMPLATE = `
<div class="md-form">
  <input
    type="text"
    class="completer-input form-control mdb-autocomplete"
    [ngModel]="searchText | async"
    (ngModelChange)="searchText.next($event)"
    [mdbAutocomplete]="autocomplete"
    mdbInput
  />
  <label>Example label</label>
  <mdb-autocomplete #autocomplete="mdbAutocomplete" [autoSelect]="autoSelect">
    <mdb-option *ngFor="let option of results | async" [value]="option">
      {{ option }}
    </mdb-option>
  </mdb-autocomplete>
</div>
`;

@Component({
  template: BASIC_TEMPLATE,
})
class BasicAutocompleteComponent implements OnInit {
  @ViewChild(MdbAutocompleteDirective, { static: true }) directive: MdbAutocompleteDirective;
  @ViewChild(MdbAutocompleteComponent, { static: true }) component: MdbAutocompleteComponent;
  @ViewChildren(MdbOptionComponent) options: QueryList<MdbOptionComponent>;

  autoSelect = false;
  searchText = new Subject();
  searchVal: string;
  results: Observable<string[]>;
  data: string[] = ['Red', 'Green', 'Blue', 'Cyan', 'Magenta', 'Yellow', 'Black'];

  ngOnInit() {
    this.results = this.searchText.pipe(
      startWith(''),
      tap((value: string) => {
        this.searchVal = value;
      }),
      map((value: string) => this.filter(value))
    );
  }

  filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.data.filter((item: string) => item.toLowerCase().includes(filterValue));
  }
}

const TEMPLATE_WITH_FORM_CONTROL = `
<div class="md-form">
  <input
    type="text"
    class="completer-input form-control mdb-autocomplete"
    [formControl]="control"
    [mdbAutocomplete]="autocomplete"
    mdbInput
  />
  <label>Example label</label>
  <mdb-autocomplete #autocomplete="mdbAutocomplete">
    <mdb-option *ngFor="let option of results | async" [value]="option">
      {{ option }}
    </mdb-option>
  </mdb-autocomplete>
</div>
`;

@Component({
  template: TEMPLATE_WITH_FORM_CONTROL,
})
export class AutocompleteWithFormControlComponent {
  @ViewChild(MdbAutocompleteDirective, { static: true }) directive: MdbAutocompleteDirective;
  control = new UntypedFormControl();
  results: Observable<string[]>;
  notFound = false;
  data = ['Red', 'Green', 'Blue', 'Cyan', 'Magenta', 'Yellow', 'Black'];

  constructor() {
    this.results = this.control.valueChanges.pipe(
      startWith(''),
      map((value: string) => this.filter(value)),
      tap((results: string[]) =>
        results.length > 0 ? (this.notFound = false) : (this.notFound = true)
      )
    );
  }

  filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.data.filter((item: string) => item.toLowerCase().includes(filterValue));
  }
}

const DISPLAY_VALUE_TEMPLATE = `
<div class="md-form">
  <input
    type="text"
    class="completer-input form-control mdb-autocomplete"
    [formControl]="control"
    [mdbAutocomplete]="autocomplete"
    mdbInput
  />
  <label>Example label</label>
  <mdb-autocomplete #autocomplete="mdbAutocomplete" [autoSelect]="autoSelect" [displayValue]="displayValue">
    <mdb-option *ngFor="let option of results | async" [value]="option">
      {{ option }}
    </mdb-option>
  </mdb-autocomplete>
</div>
`;

@Component({
  template: DISPLAY_VALUE_TEMPLATE,
})
export class AutocompleteWithDisplayValue {
  @ViewChild(MdbAutocompleteDirective, { static: true }) directive: MdbAutocompleteDirective;
  control = new UntypedFormControl();
  results: Observable<string[]>;
  notFound = false;

  data = [
    { title: 'One', description: 'First item description' },
    { title: 'Two', description: 'Second item description' },
    { title: 'Three', description: 'Third item description' },
    { title: 'Four', description: 'Fourth item description' },
    { title: 'Five', description: 'Fifth item description' },
  ];

  constructor() {
    this.results = this.control.valueChanges.pipe(
      startWith(''),
      map((value: any) => {
        const title = typeof value === 'string' ? value : value.title;
        return this.filter(title);
      }),
      tap((results: string[]) =>
        results.length > 0 ? (this.notFound = false) : (this.notFound = true)
      )
    );
  }

  filter(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.data.filter((item: any) => item.title.toLowerCase().includes(filterValue));
  }

  displayValue(value: any): string {
    return value ? value.title : '';
  }
}

describe('MdbAutocomplete', () => {
  let overlayContainer: OverlayContainer;
  let overlayContainerElement: HTMLElement;

  function createComponent<T>(component: Type<T>, providers: Provider[] = []) {
    TestBed.configureTestingModule({
      imports: [
        MdbAutocompleteModule,
        MdbFormsModule,
        FormsModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
      ],
      declarations: [component],
      providers: [...providers],
      teardown: { destroyAfterEach: false },
    });

    TestBed.compileComponents();

    inject([OverlayContainer], (oc: OverlayContainer) => {
      overlayContainer = oc;
      overlayContainerElement = oc.getContainerElement();
    })();

    return TestBed.createComponent<T>(component);
  }

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  describe('Dropdown opening and closing', () => {
    let fixture: ComponentFixture<BasicAutocompleteComponent>;
    let input: HTMLElement;

    beforeEach(() => {
      fixture = createComponent(BasicAutocompleteComponent);
      fixture.detectChanges();
      input = fixture.debugElement.query(By.css('input')).nativeElement;
    });

    it('should open the dropdown on input focus', fakeAsync(() => {
      expect(fixture.componentInstance.directive._isDropdownOpen).toBe(false);
      input.focus();
      fixture.detectChanges();
      flush();

      expect(fixture.componentInstance.directive._isDropdownOpen).toBe(true);
      expect(overlayContainerElement.textContent).toContain('Red');
      expect(overlayContainerElement.textContent).toContain('Green');
    }));

    it('should open the dropdown when pressing alt and down arrow', fakeAsync(() => {
      expect(fixture.componentInstance.directive._isDropdownOpen).toBe(false);
      const event = createKeyboardEvent('keydown', DOWN_ARROW, 'alt');
      input.dispatchEvent(event);
      fixture.detectChanges();
      flush();

      expect(fixture.componentInstance.directive._isDropdownOpen).toBe(true);
      expect(overlayContainerElement.textContent).toContain('Red');
      expect(overlayContainerElement.textContent).toContain('Green');
    }));

    it('should open the dropdown programatically', fakeAsync(() => {
      expect(fixture.componentInstance.directive._isDropdownOpen).toBe(false);
      fixture.componentInstance.directive.open();
      fixture.detectChanges();
      flush();

      expect(fixture.componentInstance.directive._isDropdownOpen).toBe(true);
      expect(overlayContainerElement.textContent).toContain('Red');
      expect(overlayContainerElement.textContent).toContain('Green');
    }));

    it('should close the dropdown programatically', fakeAsync(() => {
      fixture.componentInstance.directive.open();
      fixture.detectChanges();
      flush();
      expect(fixture.componentInstance.directive._isDropdownOpen).toBe(true);

      fixture.componentInstance.directive.close();
      fixture.detectChanges();
      flush();

      expect(fixture.componentInstance.directive._isDropdownOpen).toBe(false);
      expect(overlayContainerElement.textContent).toEqual('');
    }));

    it('should close the dropdown when pressing escape', fakeAsync(() => {
      fixture.componentInstance.directive.open();
      fixture.detectChanges();
      flush();
      expect(fixture.componentInstance.directive._isDropdownOpen).toBe(true);

      const event = createKeyboardEvent('keydown', ESCAPE);
      document.body.dispatchEvent(event);
      fixture.detectChanges();
      flush();

      expect(fixture.componentInstance.directive._isDropdownOpen).toBe(false);
      expect(overlayContainerElement.textContent).toEqual('');
    }));

    it('should close the dropdown when pressing alt and up arrow', fakeAsync(() => {
      fixture.componentInstance.directive.open();
      fixture.detectChanges();
      flush();
      expect(fixture.componentInstance.directive._isDropdownOpen).toBe(true);

      const event = createKeyboardEvent('keydown', UP_ARROW, 'alt');

      document.body.dispatchEvent(event);
      fixture.detectChanges();
      flush();

      expect(fixture.componentInstance.directive._isDropdownOpen).toBe(false);
      expect(overlayContainerElement.textContent).toEqual('');
    }));

    it('should close the dropdown when clicking outside the component', fakeAsync(() => {
      fixture.componentInstance.directive.open();
      fixture.detectChanges();
      flush();
      expect(fixture.componentInstance.directive._isDropdownOpen).toBe(true);

      const clickEvent = new Event('click');
      document.dispatchEvent(clickEvent);
      fixture.detectChanges();
      flush();

      expect(fixture.componentInstance.directive._isDropdownOpen).toBe(false);
      expect(overlayContainerElement.textContent).toEqual('');
    }));

    it('should close the dropdown when tabbing away from the input', fakeAsync(() => {
      fixture.componentInstance.directive.open();
      fixture.detectChanges();
      flush();
      expect(fixture.componentInstance.directive._isDropdownOpen).toBe(true);

      const tabEvent = createKeyboardEvent('keydown', TAB);
      fixture.componentInstance.directive.onKeydown(tabEvent);
      fixture.detectChanges();
      flush();

      expect(fixture.componentInstance.directive._isDropdownOpen).toBe(false);
      expect(overlayContainerElement.textContent).toEqual('');
    }));

    it('should close the dropdown when an option is clicked', fakeAsync(() => {
      fixture.componentInstance.directive.open();
      fixture.detectChanges();
      flush();
      expect(fixture.componentInstance.directive._isDropdownOpen).toBe(true);

      const option = overlayContainerElement.querySelector('mdb-option') as HTMLElement;
      option.click();
      fixture.detectChanges();
      flush();

      expect(fixture.componentInstance.directive._isDropdownOpen).toBe(false);
      expect(overlayContainerElement.textContent).toEqual('');
    }));

    it('should not close the dropdown on input click', fakeAsync(() => {
      fixture.componentInstance.directive.open();
      fixture.detectChanges();
      flush();
      expect(fixture.componentInstance.directive._isDropdownOpen).toBe(true);

      input.click();
      fixture.detectChanges();
      flush();

      expect(fixture.componentInstance.directive._isDropdownOpen).toBe(true);
      expect(overlayContainerElement.textContent).toContain('Red');
      expect(overlayContainerElement.textContent).toContain('Green');
    }));
  });

  describe('Option selection and filtering', () => {
    let fixture: ComponentFixture<BasicAutocompleteComponent>;
    let input: HTMLInputElement;

    beforeEach(() => {
      fixture = createComponent(BasicAutocompleteComponent);
      fixture.detectChanges();
      input = fixture.nativeElement.querySelector('input');
    });

    it('should update input value and options list if search value is updated programmaticaly', fakeAsync(() => {
      fixture.componentInstance.searchText.next('Red');
      fixture.detectChanges();
      flush();

      expect(input.value).toEqual('Red');

      fixture.componentInstance.directive.open();
      fixture.detectChanges();
      flush();

      const options = overlayContainerElement.querySelectorAll(
        'mdb-option'
      ) as NodeListOf<HTMLElement>;

      expect(options.length).toEqual(1);
    }));

    it('should update ngModel search value when user type in input', fakeAsync(() => {
      input.value = 'red';
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(fixture.componentInstance.searchVal).toEqual('red');
    }));

    it('should update ngModel search value when user select option', fakeAsync(() => {
      fixture.componentInstance.directive.open();
      fixture.detectChanges();
      flush();

      const option = overlayContainerElement.querySelector('mdb-option') as HTMLElement;

      option.click();
      fixture.detectChanges();

      expect(fixture.componentInstance.searchVal).toEqual('Red');
    }));

    it('should update options list when user types in input', fakeAsync(() => {
      fixture.componentInstance.directive.open();
      fixture.detectChanges();
      flush();

      let optionsList = overlayContainerElement.querySelectorAll(
        'mdb-option'
      ) as NodeListOf<HTMLElement>;

      expect(optionsList.length).toEqual(7);

      input.value = 'Red';
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      optionsList = overlayContainerElement.querySelectorAll(
        'mdb-option'
      ) as NodeListOf<HTMLElement>;

      expect(optionsList.length).toEqual(1);
    }));

    it('should update input value with clicked option', fakeAsync(() => {
      fixture.componentInstance.directive.open();
      fixture.detectChanges();
      flush();

      const options = fixture.componentInstance.options.toArray();
      const optionsList = overlayContainerElement.querySelectorAll(
        'mdb-option'
      ) as NodeListOf<HTMLElement>;
      optionsList[0].click();
      fixture.detectChanges();

      expect(input.value).toEqual('Red');
    }));

    it('should emit selectionChange event when option is selected', fakeAsync(() => {
      fixture.componentInstance.directive.open();
      fixture.detectChanges();
      flush();

      const spy = jest.spyOn(fixture.componentInstance.component.selected, 'emit');

      const optionsList = overlayContainerElement.querySelectorAll(
        'mdb-option'
      ) as NodeListOf<HTMLElement>;
      optionsList[0].click();
      fixture.detectChanges();

      expect(spy).toHaveBeenCalled();
    }));
  });

  describe('Integration with form control', () => {
    let fixture: ComponentFixture<AutocompleteWithFormControlComponent>;
    let input: HTMLInputElement;

    beforeEach(() => {
      fixture = createComponent(AutocompleteWithFormControlComponent);
      fixture.detectChanges();
      input = fixture.nativeElement.querySelector('input');
    });

    it('should update input value and options list if search value is updated programmaticaly', () => {
      input.value = 'red';
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(fixture.componentInstance.control.value).toEqual('red');
    });

    it('should update form control if user select option', () => {
      fixture.componentInstance.directive.open();
      fixture.detectChanges();
      const option = overlayContainerElement.querySelector('mdb-option') as HTMLElement;

      option.click();
      fixture.detectChanges();

      expect(fixture.componentInstance.control.value).toEqual('Red');
    });

    it('should update input value and options list when form control is updated programmaticaly', fakeAsync(() => {
      fixture.componentInstance.control.setValue('Red');
      flush();
      fixture.detectChanges();

      expect(input.value).toEqual('Red');

      fixture.componentInstance.directive.open();
      fixture.detectChanges();

      const options = overlayContainerElement.querySelectorAll(
        'mdb-option'
      ) as NodeListOf<HTMLElement>;

      expect(options.length).toEqual(1);
    }));

    it('should disable input using form control method', () => {
      expect(input.disabled).toBe(false);

      fixture.componentInstance.control.disable();
      fixture.detectChanges();

      expect(input.disabled).toBe(true);
    });
  });

  describe('Keyboard navigation', () => {
    let fixture: ComponentFixture<BasicAutocompleteComponent>;
    let downArrowEvent: KeyboardEvent;
    let leftArrowEvent: KeyboardEvent;
    let upArrowEvent: KeyboardEvent;
    let homeEvent: KeyboardEvent;
    let endEvent: KeyboardEvent;
    let enterEvent: KeyboardEvent;
    let input: HTMLInputElement;

    beforeEach(() => {
      fixture = createComponent(BasicAutocompleteComponent);
      fixture.detectChanges();
      input = fixture.nativeElement.querySelector('input');

      downArrowEvent = createKeyboardEvent('keydown', DOWN_ARROW);
      leftArrowEvent = createKeyboardEvent('keydown', LEFT_ARROW);
      upArrowEvent = createKeyboardEvent('keydown', UP_ARROW);
      homeEvent = createKeyboardEvent('keydown', HOME);
      endEvent = createKeyboardEvent('keydown', END);
      enterEvent = createKeyboardEvent('keydown', ENTER);
    });

    it('should highlight next option when pressing down arrow', fakeAsync(() => {
      input.focus();
      fixture.detectChanges();
      flush();

      const options = overlayContainerElement.querySelectorAll(
        'mdb-option'
      ) as NodeListOf<HTMLElement>;

      input.dispatchEvent(downArrowEvent);
      input.dispatchEvent(downArrowEvent);
      fixture.detectChanges();

      expect(options[0].classList).not.toContain('active');
      expect(options[1].classList).toContain('active');
    }));

    it('should highlight previous option when pressing up arrow', fakeAsync(() => {
      input.focus();
      fixture.detectChanges();
      flush();

      const options = overlayContainerElement.querySelectorAll(
        'mdb-option'
      ) as NodeListOf<HTMLElement>;

      input.dispatchEvent(downArrowEvent);
      input.dispatchEvent(downArrowEvent);
      fixture.detectChanges();

      expect(options[1].classList).toContain('active');

      input.dispatchEvent(upArrowEvent);
      fixture.detectChanges();

      expect(options[1].classList).not.toContain('active');
      expect(options[0].classList).toContain('active');
    }));

    it('should highlight first option when pressing home or move carret', fakeAsync(() => {
      input.focus();
      fixture.detectChanges();
      flush();

      const options = overlayContainerElement.querySelectorAll(
        'mdb-option'
      ) as NodeListOf<HTMLElement>;

      input.dispatchEvent(downArrowEvent);
      input.dispatchEvent(downArrowEvent);
      input.dispatchEvent(downArrowEvent);
      fixture.detectChanges();

      expect(options[2].classList).toContain('active');

      input.dispatchEvent(homeEvent);
      fixture.detectChanges();

      expect(options[2].classList).not.toContain('active');
      expect(options[0].classList).toContain('active');

      input.value = 'Two';
      input.dispatchEvent(new Event('input'));
      input.dispatchEvent(homeEvent);
      fixture.detectChanges();

      expect(input.selectionStart).toBe(0);
    }));

    it('should highlight last option when pressing end or move carret', fakeAsync(() => {
      input.focus();
      fixture.detectChanges();
      flush();

      const options = overlayContainerElement.querySelectorAll(
        'mdb-option'
      ) as NodeListOf<HTMLElement>;

      input.dispatchEvent(downArrowEvent);
      fixture.detectChanges();
      expect(options[0].classList).toContain('active');

      input.dispatchEvent(endEvent);
      fixture.detectChanges();

      expect(options[0].classList).not.toContain('active');
      expect(options[options.length - 1].classList).toContain('active');

      input.value = 'Two';
      input.dispatchEvent(new Event('input'));
      input.dispatchEvent(endEvent);
      input.dispatchEvent(leftArrowEvent);
      fixture.detectChanges();

      expect(input.selectionStart).toBe(3);
    }));

    it('should select highlighted option when pressing enter', fakeAsync(() => {
      input.focus();
      fixture.detectChanges();
      flush();

      input.dispatchEvent(downArrowEvent);
      fixture.detectChanges();

      input.dispatchEvent(enterEvent);
      fixture.detectChanges();

      expect(input.value).toEqual('Red');
    }));

    it('should select highlighted option on tab out if autoSelect input is set to true', fakeAsync(() => {
      fixture.componentInstance.autoSelect = true;
      fixture.detectChanges();

      fixture.componentInstance.directive.open();
      fixture.detectChanges();
      flush();
      expect(fixture.componentInstance.directive._isDropdownOpen).toBe(true);

      input.dispatchEvent(downArrowEvent);
      fixture.detectChanges();

      const tabEvent = createKeyboardEvent('keydown', TAB);
      fixture.componentInstance.directive.onKeydown(tabEvent);
      fixture.detectChanges();
      flush();

      expect(input.value).toEqual('Red');
    }));
  });

  describe('Display value', () => {
    let fixture: ComponentFixture<AutocompleteWithDisplayValue>;
    let input: HTMLInputElement;

    beforeEach(() => {
      fixture = createComponent(AutocompleteWithDisplayValue);
      fixture.detectChanges();
      input = fixture.nativeElement.querySelector('input');
    });

    it('should use displayValue function to correctly set the default value from form control', fakeAsync(() => {
      fixture.componentInstance.control.setValue({
        title: 'One',
        description: 'First item description',
      });
      flush();
      fixture.detectChanges();

      expect(input.value).toEqual('One');
    }));
  });
});
