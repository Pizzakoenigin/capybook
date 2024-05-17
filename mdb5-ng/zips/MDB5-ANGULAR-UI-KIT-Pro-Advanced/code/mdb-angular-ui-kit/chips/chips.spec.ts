import { Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { MdbChipDeleteDirective } from './chip-delete.directive';
import { MdbChipComponent, MdbChipEditedEvent } from './chip.component';
import { MdbChipAddEvent, MdbChipsInputDirective } from './chips-input.directive';
import { MdbChipsModule } from './chips.module';

@Component({
  selector: 'mdb-basic-chips',
  template: `
    <mdb-chips>
      <mdb-form-control class="chips-input-wrapper chips-padding chips-transition">
        <mdb-chip
          *ngFor="let tag of tags"
          [editable]="editable"
          (deleted)="delete(tag)"
          (edited)="edit(tag, $event)"
        >
          <span class="text-chip">{{ tag.name }}</span>
          <i class="close fas fa-times" mdbChipDelete></i>
        </mdb-chip>
        <input #input mdbChipsInput class="form-control chips-input" (chipAdd)="add($event)" />
        <label mdbLabel class="form-label">Example label</label>
      </mdb-form-control>
    </mdb-chips>
  `,
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
class BasicChipsComponent {
  tags = [{ name: 'angular' }, { name: 'react' }, { name: 'vue' }];
  latestTagName: string | null = null;
  editable = false;

  add(event: MdbChipAddEvent) {
    this.tags.push({ name: event.value });
    this.latestTagName = event.value;

    event.input.clear();
  }

  delete(tag: any) {
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  edit(tag: any, event: MdbChipEditedEvent) {
    const value = event.value;

    if (!value) {
      this.delete(tag);
      return;
    }

    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags[index].name = value;
    }
  }

  @ViewChild('input', { static: true }) input: ElementRef<HTMLInputElement>;
  @ViewChild(MdbChipsInputDirective, { static: true }) chipsInput: MdbChipsInputDirective;
  @ViewChildren(MdbChipComponent) chips: QueryList<MdbChipComponent>;
  @ViewChildren(MdbChipComponent, { read: ElementRef }) chipsEl: QueryList<ElementRef>;
  @ViewChildren(MdbChipDeleteDirective, { read: ElementRef }) deleteButtons: QueryList<ElementRef>;
}

describe('MDB Chips', () => {
  let fixture: ComponentFixture<BasicChipsComponent>;
  let component: BasicChipsComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BasicChipsComponent],
      imports: [MdbChipsModule, MdbFormsModule],
      teardown: { destroyAfterEach: false },
    });

    fixture = TestBed.createComponent(BasicChipsComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should add new chip if value is confirmed using one of the confirm keys', () => {
    const chipsInput = component.chipsInput;
    const input = component.input.nativeElement;

    const addSpy = jest.spyOn(chipsInput.chipAdd, 'emit');

    expect(component.tags.length).toEqual(3);

    input.value = 'test';
    input.dispatchEvent(new Event('input'));

    input.focus();
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    fixture.detectChanges();

    expect(addSpy).toHaveBeenCalled();
    expect(component.tags.length).toEqual(4);
    expect(component.latestTagName).toBe('test');
  });

  it('should add new chip if input with value is blurred', () => {
    const chipsInput = component.chipsInput;
    const input = component.input.nativeElement;

    const addSpy = jest.spyOn(chipsInput.chipAdd, 'emit');

    expect(component.tags.length).toEqual(3);

    input.value = 'test';
    input.dispatchEvent(new Event('input'));

    input.focus();
    input.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    expect(addSpy).toHaveBeenCalled();
    expect(component.tags.length).toEqual(4);
    expect(component.latestTagName).toBe('test');
  });

  it('should remove last chip if input value is empty and Backspace key is used', () => {
    const chips = component.chips.toArray();
    const input = component.input.nativeElement;

    const lastChip = chips[chips.length - 1];
    const removeSpy = jest.spyOn(lastChip.deleted, 'emit');

    expect(component.tags.length).toEqual(3);

    input.focus();
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace' }));
    fixture.detectChanges();

    expect(removeSpy).toHaveBeenCalled();
    expect(component.tags.length).toEqual(2);
  });

  it('should remove last chip if input value is empty and Delete key is used', () => {
    const chips = component.chips.toArray();
    const input = component.input.nativeElement;

    const lastChip = chips[chips.length - 1];
    const removeSpy = jest.spyOn(lastChip.deleted, 'emit');

    expect(component.tags.length).toEqual(3);

    input.focus();
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Delete' }));
    fixture.detectChanges();

    expect(removeSpy).toHaveBeenCalled();
    expect(component.tags.length).toEqual(2);
  });

  it('should remove chip when its remove button is clicked', () => {
    const deleteButtons = component.deleteButtons.toArray();
    const chips = component.chips.toArray();

    const firstChip = chips[0];
    const firstTagDeleteButton = deleteButtons[0].nativeElement;

    const removeSpy = jest.spyOn(firstChip.deleted, 'emit');
    let angularTag = component.tags.find((tag) => tag.name === 'angular');

    expect(angularTag).not.toBe(null);
    expect(angularTag.name).toBe('angular');
    expect(component.tags.length).toEqual(3);

    firstTagDeleteButton.click();
    fixture.detectChanges();

    angularTag = component.tags.find((tag) => tag.name === 'angular');
    expect(angularTag).not.toBeDefined();
    expect(removeSpy).toHaveBeenCalled();
    expect(component.tags.length).toEqual(2);
  });

  it('should enable editable mode on double click if editable input is set to true', () => {
    component.editable = true;
    fixture.detectChanges();

    const chipsEl = component.chipsEl.toArray();
    const firstChipEl = chipsEl[0].nativeElement;
    const firstChipContainer = firstChipEl.querySelector('.chip');

    expect(firstChipContainer.getAttribute('contenteditable')).toBe('false');

    firstChipEl.dispatchEvent(new MouseEvent('dblclick'));
    fixture.detectChanges();

    expect(firstChipContainer.getAttribute('contenteditable')).toBe('true');
  });

  it('should emit edited value on enter key if component is in edit mode', () => {
    component.editable = true;
    fixture.detectChanges();

    const chipsEl = component.chipsEl.toArray();
    const chips = component.chips.toArray();
    const firstChip = chips[0];
    const firstChipEl = chipsEl[0].nativeElement;
    const firstChipText = firstChipEl.querySelector('.text-chip');

    const editSpy = jest.spyOn(firstChip.edited, 'emit');

    let testTag = component.tags.find((tag) => tag.name === 'test');
    let angularTag = component.tags.find((tag) => tag.name === 'angular');

    expect(testTag).not.toBeDefined();
    expect(angularTag).toBeDefined();
    expect(editSpy).not.toHaveBeenCalled();

    firstChipEl.dispatchEvent(new MouseEvent('dblclick'));
    fixture.detectChanges();

    firstChipText.textContent = 'test';

    firstChipEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    fixture.detectChanges();

    angularTag = component.tags.find((tag) => tag.name === 'angular');
    testTag = component.tags.find((tag) => tag.name === 'test');

    expect(testTag).toBeDefined();
    expect(angularTag).not.toBeDefined();
    expect(editSpy).toHaveBeenCalled();
  });
});
