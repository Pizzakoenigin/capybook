import { Component, Provider, Type, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { TestBed, ComponentFixture, inject, fakeAsync, flush, tick } from '@angular/core/testing';
import { UntypedFormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { OverlayContainer } from '@angular/cdk/overlay';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { MdbOptionComponent } from 'mdb-angular-ui-kit/option';
import { MdbSelectComponent, MdbSelectFilterFn } from './select.component';
import { MdbSelectModule } from './select.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DOWN_ARROW, END, ENTER, HOME, TAB, UP_ARROW } from '@angular/cdk/keycodes';

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

describe('MDB Select', () => {
  let overlayContainer: OverlayContainer;
  let overlayContainerElement: HTMLElement;

  function createComponent<T>(component: Type<T>, providers: Provider[] = []): ComponentFixture<T> {
    TestBed.configureTestingModule({
      imports: [
        MdbSelectModule,
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

  afterEach(inject([OverlayContainer], (currentOverlayContainer: OverlayContainer) => {
    currentOverlayContainer.ngOnDestroy();
    overlayContainer.ngOnDestroy();
  }));

  describe('Dropdown opening and closing', () => {
    let fixture: ComponentFixture<BasicSelect>;
    let input: HTMLElement;
    let select: MdbSelectComponent;

    beforeEach(() => {
      fixture = createComponent(BasicSelect);
      fixture.detectChanges();
      select = fixture.componentInstance.select;
      input = fixture.debugElement.query(By.css('input')).nativeElement;
    });

    it('should toggle the dropdown on input click', fakeAsync(() => {
      input.click();
      fixture.detectChanges();
      flush();
      expect(select._isOpen).toBe(true);
      expect(overlayContainerElement.textContent).toContain('One');

      input.click();
      fixture.detectChanges();
      flush();
      expect(select._isOpen).toBe(false);
      expect(overlayContainerElement.textContent).toEqual('');
    }));

    it('should open the dropdown when alt + down arrow key is pressed', fakeAsync(() => {
      const event = createKeyboardEvent('keydown', DOWN_ARROW, 'alt');
      const selectEl = document.querySelector('mdb-select') as HTMLElement;
      selectEl.dispatchEvent(event);
      fixture.detectChanges();
      flush();

      expect(select._isOpen).toBe(true);
    }));

    it('should open the dropdown programatically', () => {
      expect(select._isOpen).toBe(false);
      select.open();
      fixture.detectChanges();

      expect(select._isOpen).toBe(true);
    });

    it('should close the dropdown programatically', () => {
      select.open();
      fixture.detectChanges();
      expect(select._isOpen).toBe(true);

      select.close();
      fixture.detectChanges();
      expect(select._isOpen).toBe(false);
    });

    it('should close the dropdown when escape key is pressed', fakeAsync(() => {
      input.click();
      fixture.detectChanges();
      flush();
      expect(select._isOpen).toBe(true);

      const escapeEvent = createKeyboardEvent('keydown', 27);
      const dropdown = document.querySelector('.select-dropdown-container') as HTMLElement;
      dropdown.dispatchEvent(escapeEvent);
      fixture.detectChanges();
      flush();

      expect(select._isOpen).toBe(false);
      expect(overlayContainerElement.textContent).toEqual('');
    }));

    it('should close the dropdown when arrow up key is pressed', fakeAsync(() => {
      input.click();
      fixture.detectChanges();
      flush();
      expect(select._isOpen).toBe(true);

      const event = createKeyboardEvent('keydown', UP_ARROW, 'alt');
      const dropdown = document.querySelector('.select-dropdown-container') as HTMLElement;
      dropdown.dispatchEvent(event);
      fixture.detectChanges();
      flush();

      expect(select._isOpen).toBe(false);
      expect(overlayContainerElement.textContent).toEqual('');
    }));

    it('should close the dropdown when clicking outside the component', () => {
      select.open();
      fixture.detectChanges();

      const event = new MouseEvent('click');
      document.dispatchEvent(event);
      fixture.detectChanges();

      expect(select._isOpen).toBe(false);
    });

    it('should close the dropdown when tabbing away from the dropdown', fakeAsync(() => {
      select.open();
      fixture.detectChanges();
      flush();
      expect(select._isOpen).toBe(true);

      const tabEvent = createKeyboardEvent('keydown', TAB);
      const dropdown = document.querySelector('.select-dropdown-container');
      dropdown.dispatchEvent(tabEvent);
      fixture.detectChanges();
      flush();

      expect(select._isOpen).toBe(false);
      expect(overlayContainerElement.textContent).toEqual('');
    }));

    it('should close the dropdown when single option is clicked', () => {
      select.open();
      fixture.detectChanges();

      const option = overlayContainerElement.querySelector('mdb-option') as HTMLElement;
      option.click();
      fixture.detectChanges();

      expect(select._isOpen).toBe(false);
    });
  });

  describe('Selection', () => {
    let fixture: ComponentFixture<BasicSelect>;
    let input: HTMLElement;
    let select: MdbSelectComponent;

    beforeEach(() => {
      fixture = createComponent(BasicSelect);
      fixture.detectChanges();
      select = fixture.componentInstance.select;
      input = fixture.debugElement.query(By.css('input')).nativeElement;
    });

    it('should select option when its clicked', fakeAsync(() => {
      select.open();
      fixture.detectChanges();
      flush();

      let option = overlayContainerElement.querySelector('mdb-option') as HTMLElement;

      option.click();
      fixture.detectChanges();
      flush();

      select.open();
      fixture.detectChanges();
      flush();

      option = overlayContainerElement.querySelector('mdb-option') as HTMLElement;

      expect(option.classList).toContain('selected');
      expect(fixture.componentInstance.options.first.selected).toBe(true);
    }));

    it('should not select disabled option', fakeAsync(() => {
      select.open();
      fixture.detectChanges();
      flush();

      let options = overlayContainerElement.querySelectorAll(
        'mdb-option'
      ) as NodeListOf<HTMLElement>;

      options[3].click();
      fixture.detectChanges();
      flush();

      select.open();
      fixture.detectChanges();
      flush();

      options = overlayContainerElement.querySelectorAll('mdb-option') as NodeListOf<HTMLElement>;

      expect(options[3].classList).not.toContain('selected');
      const optionInstances = fixture.componentInstance.options.toArray();
      expect(optionInstances[3].selected).toBe(false);
    }));

    it('should deselect other options on option click in single mode', fakeAsync(() => {
      select.open();
      fixture.detectChanges();
      flush();

      let options = overlayContainerElement.querySelectorAll(
        'mdb-option'
      ) as NodeListOf<HTMLElement>;

      options[1].click();
      fixture.detectChanges();

      expect(options[1].classList).toContain('selected');

      options[0].click();
      fixture.detectChanges();
      flush();

      select.open();
      fixture.detectChanges();
      flush();

      options = overlayContainerElement.querySelectorAll('mdb-option') as NodeListOf<HTMLElement>;
      expect(options[1].classList).not.toContain('selected');

      const optionInstances = fixture.componentInstance.options.toArray();
      expect(optionInstances[1].selected).toBe(false);
    }));

    it('should display selected option in input', fakeAsync(() => {
      select.open();
      fixture.detectChanges();
      flush();

      const option = overlayContainerElement.querySelector('mdb-option') as HTMLElement;
      const selectInput = document.querySelector('.select-input') as HTMLInputElement;

      option.click();
      fixture.detectChanges();
      flush();

      expect(selectInput.value).toBe(' One ');
    }));

    it('should use value from ngModel to set default selected value', fakeAsync(() => {
      expect(fixture.componentInstance.value).toBe(null);

      fixture.componentInstance.value = 'one';
      fixture.detectChanges();

      flush();
      fixture.detectChanges();

      const options = fixture.componentInstance.options.toArray();
      const selectInput = document.querySelector('.select-input') as HTMLInputElement;

      expect(options[0].selected).toBe(true);
      expect(selectInput.value).toBe(' One ');
    }));

    it('should update ngModel value when option is selected', fakeAsync(() => {
      select.open();
      fixture.detectChanges();
      flush();

      const option = overlayContainerElement.querySelector('mdb-option') as HTMLElement;

      option.click();
      fixture.detectChanges();
      flush();

      expect(fixture.componentInstance.value).toEqual('one');
    }));
  });

  describe('Form control integration', () => {
    let fixture: ComponentFixture<SelectWithFormControl>;
    let input: HTMLElement;
    let select: MdbSelectComponent;

    beforeEach(() => {
      fixture = createComponent(SelectWithFormControl);
      fixture.detectChanges();
      select = fixture.componentInstance.select;
      input = fixture.debugElement.query(By.css('input')).nativeElement;
    });

    it('should use value from Form Control to set default selected value', fakeAsync(() => {
      fixture.componentInstance.control = new UntypedFormControl('one');
      fixture.detectChanges();

      flush();
      fixture.detectChanges();

      const options = fixture.componentInstance.options.toArray();
      const selectInput = document.querySelector('.select-input') as HTMLInputElement;

      expect(options[0].selected).toBe(true);
      expect(selectInput.value).toBe(' One ');
    }));

    it('should update form control value when new option is selected', fakeAsync(() => {
      select.open();
      fixture.detectChanges();
      flush();

      const option = overlayContainerElement.querySelector('mdb-option') as HTMLElement;

      expect(fixture.componentInstance.control.value).toEqual(null);

      option.click();
      fixture.detectChanges();
      flush();

      expect(fixture.componentInstance.control.value).toEqual('one');
    }));
  });

  describe('Events', () => {
    let fixture: ComponentFixture<BasicSelect>;
    let input: HTMLElement;
    let select: MdbSelectComponent;

    beforeEach(() => {
      fixture = createComponent(BasicSelect);
      fixture.detectChanges();
      select = fixture.componentInstance.select;
      input = fixture.debugElement.query(By.css('input')).nativeElement;
    });

    it('should emit opened event when dropdown is opened and closed event when dropdown is closed', fakeAsync(() => {
      const openSpy = jest.spyOn(select.opened, 'emit');
      const closeSpy = jest.spyOn(select.closed, 'emit');

      select.open();
      fixture.detectChanges();
      flush();

      expect(openSpy).toHaveBeenCalled();

      select.close();
      fixture.detectChanges();

      expect(closeSpy).toHaveBeenCalled();
    }));

    it('should emit selected event when new option is selected', fakeAsync(() => {
      const selectedSpy = jest.spyOn(select.selected, 'emit');

      select.open();
      fixture.detectChanges();
      flush();

      const option: HTMLElement = overlayContainerElement.querySelector('mdb-option');

      option.click();
      fixture.detectChanges();

      expect(selectedSpy).toHaveBeenCalled();
    }));
  });

  describe('Options groups', () => {
    let fixture: ComponentFixture<SelectWithOptionsGroups>;
    let input: HTMLElement;
    let select: MdbSelectComponent;

    beforeEach(() => {
      fixture = createComponent(SelectWithOptionsGroups);
      fixture.detectChanges();
      select = fixture.componentInstance.select;
      input = fixture.debugElement.query(By.css('input')).nativeElement;
    });

    it('should disable all options inside disabled option group', fakeAsync(() => {
      select.open();
      fixture.detectChanges();
      flush();
      fixture.detectChanges();

      const disabledGroup = overlayContainerElement.querySelectorAll('mdb-option-group')[1];
      const disabledGroupOptions = disabledGroup.querySelectorAll(
        'mdb-option'
      ) as NodeListOf<HTMLElement>;

      disabledGroupOptions.forEach((option) => {
        expect(option.classList).toContain('disabled');
      });
    }));
  });

  describe('Keyboard navigation', () => {
    let fixture: ComponentFixture<BasicSelect>;
    let input: HTMLElement;
    let select: MdbSelectComponent;

    beforeEach(() => {
      fixture = createComponent(BasicSelect);
      fixture.detectChanges();
      select = fixture.componentInstance.select;
      input = fixture.debugElement.query(By.css('input')).nativeElement;
    });

    it('should highlight next option when down arrow key is pressed', fakeAsync(() => {
      select.open();
      fixture.detectChanges();
      flush();

      const options = overlayContainerElement.querySelectorAll(
        'mdb-option'
      ) as NodeListOf<HTMLElement>;

      const optionInstances = fixture.componentInstance.options.toArray();

      expect(optionInstances[0].active).toBe(true);
      expect(options[0].classList).toContain('active');

      const event = createKeyboardEvent('keydown', DOWN_ARROW);
      const dropdown = document.querySelector('.select-dropdown-container');
      dropdown.dispatchEvent(event);

      fixture.detectChanges();

      expect(optionInstances[1].active).toBe(true);
      expect(options[1].classList).toContain('active');
    }));

    it('should highlight previous option when up arrow key is pressed', fakeAsync(() => {
      select.open();
      fixture.detectChanges();
      flush();

      const options = overlayContainerElement.querySelectorAll(
        'mdb-option'
      ) as NodeListOf<HTMLElement>;
      const optionInstances = fixture.componentInstance.options.toArray();
      const dropdown = document.querySelector('.select-dropdown-container');

      const downArrowEvent = createKeyboardEvent('keydown', DOWN_ARROW);
      const upArrowEvent = createKeyboardEvent('keydown', UP_ARROW);
      dropdown.dispatchEvent(downArrowEvent);

      fixture.detectChanges();

      expect(optionInstances[1].active).toBe(true);
      expect(options[1].classList).toContain('active');

      dropdown.dispatchEvent(upArrowEvent);
      fixture.detectChanges();

      expect(optionInstances[0].active).toBe(true);
      expect(options[0].classList).toContain('active');
    }));

    it('should highlight first option when home key is pressed', fakeAsync(() => {
      select.open();
      fixture.detectChanges();
      flush();

      const options = overlayContainerElement.querySelectorAll(
        'mdb-option'
      ) as NodeListOf<HTMLElement>;
      const optionInstances = fixture.componentInstance.options.toArray();
      const dropdown = document.querySelector('.select-dropdown-container');

      const downArrowEvent = createKeyboardEvent('keydown', DOWN_ARROW);
      const homeEvent = createKeyboardEvent('keydown', HOME);
      dropdown.dispatchEvent(downArrowEvent);
      dropdown.dispatchEvent(downArrowEvent);

      fixture.detectChanges();

      expect(optionInstances[2].active).toBe(true);
      expect(options[2].classList).toContain('active');

      dropdown.dispatchEvent(homeEvent);
      fixture.detectChanges();

      expect(optionInstances[0].active).toBe(true);
      expect(options[0].classList).toContain('active');
    }));

    it('should highlight last option when end key is pressed', fakeAsync(() => {
      select.open();
      fixture.detectChanges();
      flush();

      const options = overlayContainerElement.querySelectorAll(
        'mdb-option'
      ) as NodeListOf<HTMLElement>;
      const optionInstances = fixture.componentInstance.options.toArray();
      const dropdown = document.querySelector('.select-dropdown-container');

      const endEvent = createKeyboardEvent('keydown', END);

      dropdown.dispatchEvent(endEvent);
      fixture.detectChanges();

      expect(optionInstances[5].active).toBe(true);
      expect(options[5].classList).toContain('active');
    }));

    it('should select highlihted option on tab out in single select with autoSelect input set to true', fakeAsync(() => {
      fixture.componentInstance.multiple = false;
      fixture.componentInstance.autoSelect = true;
      fixture.detectChanges();

      const options = fixture.componentInstance.options.toArray();

      select.open();
      fixture.detectChanges();
      flush();
      expect(select._isOpen).toBe(true);

      const tabEvent = createKeyboardEvent('keydown', TAB);
      const dropdown = document.querySelector('.select-dropdown-container');
      dropdown.dispatchEvent(tabEvent);
      fixture.detectChanges();
      flush();

      expect(fixture.componentInstance.value).toEqual('one');
      expect(options[0].selected).toBe(true);
    }));
  });

  describe('Keyboard navigation on closed dropdown', () => {
    let fixture: ComponentFixture<BasicSelect>;
    let select: MdbSelectComponent;
    let selectEl: HTMLElement;

    beforeEach(() => {
      fixture = createComponent(BasicSelect);
      fixture.detectChanges();
      select = fixture.componentInstance.select;
      selectEl = fixture.debugElement.query(By.css('mdb-select')).nativeElement;
    });

    it('should select options using arrow down and arrow up keys', () => {
      const downArrowEvent = createKeyboardEvent('keydown', DOWN_ARROW);
      const upArrowEvent = createKeyboardEvent('keydown', UP_ARROW);
      const options = fixture.componentInstance.options.toArray();

      selectEl.dispatchEvent(downArrowEvent);
      fixture.detectChanges();

      expect(options[0].selected).toBe(true);
      expect(fixture.componentInstance.value).toEqual('one');

      selectEl.dispatchEvent(downArrowEvent);
      selectEl.dispatchEvent(downArrowEvent);
      fixture.detectChanges();

      expect(options[2].selected).toBe(true);
      expect(fixture.componentInstance.value).toEqual('three');

      selectEl.dispatchEvent(upArrowEvent);
      fixture.detectChanges();

      expect(options[1].selected).toBe(true);
      expect(fixture.componentInstance.value).toEqual('two');
    });

    it('should select first option using HOME key', () => {
      const homeEvent = createKeyboardEvent('keydown', HOME);
      const options = fixture.componentInstance.options.toArray();

      selectEl.dispatchEvent(homeEvent);
      fixture.detectChanges();

      expect(options[0].selected).toBe(true);
      expect(fixture.componentInstance.value).toEqual('one');
    });

    it('should select last option using END key', () => {
      const endEvent = createKeyboardEvent('keydown', END);
      const options = fixture.componentInstance.options.toArray();
      const lastOptionIndex = options.length - 1;

      selectEl.dispatchEvent(endEvent);
      fixture.detectChanges();

      expect(options[lastOptionIndex].selected).toBe(true);
      expect(fixture.componentInstance.value).toEqual('six');
    });

    it('should open dropdown using enter key', fakeAsync(() => {
      expect(select._isOpen).toBe(false);

      const enterEvent = createKeyboardEvent('keydown', ENTER);

      selectEl.dispatchEvent(enterEvent);
      fixture.detectChanges();
      flush();

      expect(overlayContainerElement.textContent).toContain('One');
    }));

    it('should open dropdown on arrow down key in multiple mode', fakeAsync(() => {
      fixture.componentInstance.multiple = true;
      fixture.detectChanges();

      expect(select._isOpen).toBe(false);

      const downArrowEvent = createKeyboardEvent('keydown', DOWN_ARROW);

      selectEl.dispatchEvent(downArrowEvent);
      fixture.detectChanges();
      flush();

      expect(overlayContainerElement.textContent).toContain('One');
    }));

    it('should open dropdown on arrow up key in multiple mode', fakeAsync(() => {
      fixture.componentInstance.multiple = true;
      fixture.detectChanges();

      expect(select._isOpen).toBe(false);

      const downArrowEvent = createKeyboardEvent('keydown', DOWN_ARROW);

      selectEl.dispatchEvent(downArrowEvent);
      fixture.detectChanges();
      flush();

      expect(overlayContainerElement.textContent).toContain('One');
    }));
  });

  describe('Filter', () => {
    let fixture: ComponentFixture<BasicSelect>;
    let select: MdbSelectComponent;

    beforeEach(() => {
      fixture = createComponent(BasicSelect);
      fixture.detectChanges();
      select = fixture.componentInstance.select;
    });

    it('should update visible options list when user types in filter input', fakeAsync(() => {
      fixture.componentInstance.filter = true;
      fixture.detectChanges();

      const options = fixture.componentInstance.options.toArray();

      select.open();
      fixture.detectChanges();
      flush();

      expect(options[0].hidden).toBe(false);
      expect(options[1].hidden).toBe(false);
      expect(options[2].hidden).toBe(false);

      const filterInput = overlayContainerElement.querySelector(
        '.select-filter-input'
      ) as HTMLInputElement;

      filterInput.value = 'One';
      filterInput.dispatchEvent(new Event('input'));
      tick(300);
      fixture.detectChanges();

      expect(options[0].hidden).toBe(false);
      expect(options[1].hidden).toBe(true);
      expect(options[2].hidden).toBe(true);
    }));

    it('should update visible options list when user types in filter input with custom filterFn input', fakeAsync(() => {
      fixture.componentInstance.filter = true;
      fixture.componentInstance.filterFn = (option, filterValue) => option.startsWith(filterValue);
      fixture.detectChanges();

      const options = fixture.componentInstance.options.toArray();

      select.open();
      fixture.detectChanges();
      flush();

      expect(options[0].hidden).toBe(false);
      expect(options[1].hidden).toBe(false);
      expect(options[2].hidden).toBe(false);

      const filterInput = overlayContainerElement.querySelector(
        '.select-filter-input'
      ) as HTMLInputElement;

      filterInput.value = 'o';
      filterInput.dispatchEvent(new Event('input'));
      tick(300);
      fixture.detectChanges();

      expect(options[0].hidden).toBe(false);
      expect(options[1].hidden).toBe(true);
      expect(options[2].hidden).toBe(true);
    }));

    it('should display notFoundMsg text if no option is found during filtering', fakeAsync(() => {
      fixture.componentInstance.filter = true;
      fixture.componentInstance.notFoundMsg = 'Test no result message';
      fixture.detectChanges();

      const options = fixture.componentInstance.options.toArray();

      select.open();
      fixture.detectChanges();
      flush();

      const filterInput = overlayContainerElement.querySelector(
        '.select-filter-input'
      ) as HTMLInputElement;

      filterInput.value = 'test input text';
      filterInput.dispatchEvent(new Event('input'));
      tick(300);
      fixture.detectChanges();

      options.forEach((option) => expect(option.hidden).toBe(true));

      const noResultsElement = overlayContainerElement.querySelector('.select-no-results');

      expect(noResultsElement).toBeTruthy();
      expect(noResultsElement.textContent).toEqual('Test no result message');
    }));

    it('should properly allow to navigate by keyboard after filtering', fakeAsync(() => {
      fixture.componentInstance.filter = true;
      fixture.detectChanges();

      select.open();
      fixture.detectChanges();
      flush();

      const options = overlayContainerElement.querySelectorAll(
        'mdb-option'
      ) as NodeListOf<HTMLElement>;

      const optionInstances = fixture.componentInstance.options.toArray();

      expect(optionInstances[0].active).toBe(true);
      expect(options[0].classList).toContain('active');

      const searchEl = document.querySelector('.select-filter-input') as HTMLInputElement;
      const eventInput = new Event('input');
      searchEl.value = 's';
      searchEl.dispatchEvent(eventInput);

      tick(300);
      fixture.detectChanges();

      expect(optionInstances[5].active).toBe(false);
      expect(options[5].classList).not.toContain('active');

      const dropdown = document.querySelector('.select-dropdown-container');
      const downArrowEvent = createKeyboardEvent('keydown', DOWN_ARROW);
      dropdown.dispatchEvent(downArrowEvent);
      fixture.detectChanges();

      expect(optionInstances[5].active).toBe(true);
      expect(options[5].classList).toContain('active');

      select.close();
      fixture.detectChanges();
      flush();

      select.open();
      fixture.detectChanges();
      flush();

      dropdown.dispatchEvent(downArrowEvent);
      fixture.detectChanges();

      expect(optionInstances[5].active).toBe(false);
      expect(options[5].classList).not.toContain('active');
      expect(optionInstances[1].active).toBe(true);
      expect(options[1].classList).toContain('active');
    }));
  });

  describe('Filtering and selection', () => {
    let fixture: ComponentFixture<SelectFilterMultiple>;
    let select: MdbSelectComponent;

    beforeEach(() => {
      fixture = createComponent(SelectFilterMultiple);
      fixture.detectChanges();
      select = fixture.componentInstance.select;
    });

    it('should select only filtered options when using select all option', fakeAsync(() => {
      select.open();
      fixture.detectChanges();
      flush();

      const filterInput = overlayContainerElement.querySelector(
        '.select-filter-input'
      ) as HTMLInputElement;

      filterInput.value = 'One';
      filterInput.dispatchEvent(new Event('input'));
      tick(300);
      fixture.detectChanges();

      let selectAllOption = overlayContainerElement.querySelector(
        'mdb-select-all-option'
      ) as HTMLElement;

      selectAllOption.click();
      fixture.detectChanges();
      flush();

      const options = fixture.componentInstance.options.toArray();
      const selectInput = document.querySelector('.select-input') as HTMLInputElement;

      expect(selectAllOption.classList).toContain('selected');
      expect(selectInput.value).toBe('One');
      expect(options[0].selected).toBe(true);
      expect(options[1].selected).toBe(false);
    }));

    it('should update select all option state when option list change during filtering', fakeAsync(() => {
      select.open();
      fixture.detectChanges();
      flush();

      const filterInput = overlayContainerElement.querySelector(
        '.select-filter-input'
      ) as HTMLInputElement;

      filterInput.value = 'One';
      filterInput.dispatchEvent(new Event('input'));
      tick(300);
      fixture.detectChanges();

      let selectAllOption = overlayContainerElement.querySelector(
        'mdb-select-all-option'
      ) as HTMLElement;

      selectAllOption.click();
      fixture.detectChanges();
      flush();

      expect(selectAllOption.classList).toContain('selected');

      filterInput.value = '';
      filterInput.dispatchEvent(new Event('input'));
      tick(300);
      fixture.detectChanges();

      expect(selectAllOption.classList).not.toContain('selected');
    }));
  });
});

@Component({
  selector: 'mdb-basic-select',
  template: `
    <mdb-form-control>
      <mdb-select
        [filter]="filter"
        [filterFn]="filterFn"
        [notFoundMsg]="notFoundMsg"
        [multiple]="multiple"
        [autoSelect]="autoSelect"
        [(ngModel)]="value"
      >
        <mdb-option
          *ngFor="let number of numbers"
          [value]="number.value"
          [disabled]="number.disabled"
        >
          {{ number.label }}
        </mdb-option>
      </mdb-select>
    </mdb-form-control>
  `,
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
class BasicSelect {
  numbers: any[] = [
    { value: 'one', label: 'One', disabled: false },
    { value: 'two', label: 'Two', disabled: false },
    { value: 'three', label: 'Three', disabled: false },
    { value: 'four', label: 'Four', disabled: true },
    { value: 'five', label: 'Five', disabled: false },
    { value: 'six', label: 'Six', disabled: false },
  ];

  value = null;

  filter = false;
  filterFn: MdbSelectFilterFn = (option, filterValue) => option.includes(filterValue);

  @ViewChild(MdbSelectComponent, { static: true }) select: MdbSelectComponent;
  @ViewChildren(MdbOptionComponent) options: QueryList<MdbOptionComponent>;

  multiple = false;
  notFoundMsg = 'No results found';
  autoSelect = false;
}

@Component({
  selector: 'mdb-select-filter-multiple',
  template: `
    <mdb-form-control>
      <mdb-select
        [filter]="filter"
        [notFoundMsg]="notFoundMsg"
        [multiple]="multiple"
        [autoSelect]="autoSelect"
        [(ngModel)]="value"
      >
        <mdb-select-all-option></mdb-select-all-option>
        <mdb-option
          *ngFor="let number of numbers"
          [value]="number.value"
          [disabled]="number.disabled"
        >
          {{ number.label }}
        </mdb-option>
      </mdb-select>
    </mdb-form-control>
  `,
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
class SelectFilterMultiple {
  numbers: any[] = [
    { value: 'one', label: 'One', disabled: false },
    { value: 'two', label: 'Two', disabled: false },
    { value: 'three', label: 'Three', disabled: false },
    { value: 'four', label: 'Four', disabled: false },
    { value: 'five', label: 'Five', disabled: false },
    { value: 'six', label: 'Six', disabled: false },
  ];

  value = null;

  filter = true;
  @ViewChild(MdbSelectComponent, { static: true }) select: MdbSelectComponent;
  @ViewChildren(MdbOptionComponent) options: QueryList<MdbOptionComponent>;

  multiple = true;
  notFoundMsg = 'No results found';
  autoSelect = false;
}

const SELECT_WITH_FORM_CONTROL_TEMPLATE = `
<mdb-form-control>
  <mdb-select
    [multiple]="multiple"
    [formControl]="control"
  >
    <mdb-option
      *ngFor="let number of numbers"
      [value]="number.value"
      [disabled]="number.disabled"
    >
      {{ number.label }}
    </mdb-option>
  </mdb-select>
</mdb-form-control>
`;

@Component({
  selector: 'mdb-select-with-form-control',
  template: SELECT_WITH_FORM_CONTROL_TEMPLATE,
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
class SelectWithFormControl {
  numbers: any[] = [
    { value: 'one', label: 'One', disabled: false },
    { value: 'two', label: 'Two', disabled: false },
    { value: 'three', label: 'Three', disabled: false },
    { value: 'four', label: 'Four', disabled: true },
    { value: 'five', label: 'Five', disabled: false },
    { value: 'six', label: 'Six', disabled: false },
  ];

  control = new UntypedFormControl();

  @ViewChild(MdbSelectComponent, { static: true }) select: MdbSelectComponent;
  @ViewChildren(MdbOptionComponent) options: QueryList<MdbOptionComponent>;

  multiple = false;
}

const SELECT_WITH_OPTIONS_GROUPS_TEMPLATE = `
<mdb-form-control>
  <mdb-select>
    <mdb-option-group *ngFor="let group of groups" [label]="group.name" [disabled]="group.disabled">
      <mdb-option *ngFor="let option of group.options" [value]="option.value">{{
        option.label
      }}</mdb-option>
    </mdb-option-group>
  </mdb-select>
  <label mdbLabel class="form-label">Example label</label>
</mdb-form-control>
`;

@Component({
  selector: 'mdb-select-with-options-groups',
  template: SELECT_WITH_OPTIONS_GROUPS_TEMPLATE,
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
class SelectWithOptionsGroups {
  groups = [
    {
      name: 'Label 1',
      disabled: false,
      options: [
        { value: 'first-group-1', label: 'One' },
        { value: 'first-group-2', label: 'Two' },
        { value: 'first-group-3', label: 'Three' },
      ],
    },
    {
      name: 'Label 2',
      disabled: true,
      options: [
        { value: 'second-group-4', label: 'Four' },
        { value: 'second-group-5', label: 'Five' },
        { value: 'second-group-6', label: 'Six' },
      ],
    },
  ];

  @ViewChild(MdbSelectComponent, { static: true }) select: MdbSelectComponent;
  @ViewChildren(MdbOptionComponent) options: QueryList<MdbOptionComponent>;
}
