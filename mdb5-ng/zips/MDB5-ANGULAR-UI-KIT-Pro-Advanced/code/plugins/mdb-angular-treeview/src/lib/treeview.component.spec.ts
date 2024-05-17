import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed } from '@angular/core/testing';
import { MdbTreeviewModule } from './treeview.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MdbTreeviewComponent } from './treeview.component';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'mdb-test-calendar',
  template: `
    <mdb-treeview
      textField="name"
      childrenField="children"
      [nodes]="data"
      [color]="color"
      [selectable]="true"
      (selected)="onSelected()"
      [openOnClick]="openOnClick"
      [accordion]="accordion"
    ></mdb-treeview>
  `,
})
class DefaultTreeviewComponent {
  @ViewChild(MdbTreeviewComponent) treeview: MdbTreeviewComponent;

  data = [
    { name: 'One' },
    { name: 'Two' },
    {
      name: 'Three',
      expandId: 'three',

      children: [
        { name: 'Second-one' },
        { name: 'Second-two' },
        {
          name: 'Second-three',
          expandId: 'second-three',
          children: [
            {
              name: 'Third-one',
              expandId: 'third-one',
              children: [{ name: 'Fourth-one' }, { name: 'Fourth-two' }, { name: 'Fourth-three' }],
            },
            { name: 'Third-two' },
            {
              name: 'Third-three',
              expandId: 'third-three',
              children: [{ name: 'Fourth-one' }, { name: 'Fourth-two' }, { name: 'Fourth-three' }],
            },
          ],
        },
      ],
    },
  ];
  onSelected() {
    console.log('selected');
    this.selected = true;
  }
  color = 'primary';
  selected = false;
  openOnClick = true;
  accordion = false;
}

describe('Mdb Treeview', () => {
  let fixture: ComponentFixture<DefaultTreeviewComponent>;
  let element: any;
  let component: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DefaultTreeviewComponent],
      imports: [MdbTreeviewModule, NoopAnimationsModule],
    });
    fixture = TestBed.createComponent(DefaultTreeviewComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should collapse elements', fakeAsync(() => {
    expect(document.querySelector('#collapse-three-1_2').classList.contains('show')).toBe(false);
    const clickEvent = new Event('click');

    const toggler = document.querySelector('#collapse-three-1_2').previousElementSibling;
    toggler.dispatchEvent(clickEvent);
    fixture.detectChanges();
    flush();

    expect(document.querySelector('#collapse-three-1_2').classList.contains('show')).toBe(true);

    toggler.dispatchEvent(clickEvent);
    fixture.detectChanges();
    flush();

    expect(document.querySelector('#collapse-three-1_2').classList.contains('show')).toBe(false);
  }));

  it('should toggle active class', fakeAsync(() => {
    const clickEvent = new Event('click');

    const toggler = document.querySelector('#collapse-three-1_2').previousElementSibling;
    const toggler2 = document.querySelector('#collapse-second-three-1_2_2').previousElementSibling;
    expect(toggler.classList.contains('active')).toBe(false);
    expect(toggler2.classList.contains('active')).toBe(false);

    toggler.dispatchEvent(clickEvent);
    fixture.detectChanges();
    flush();

    expect(toggler.classList.contains('active')).toBe(true);
    expect(toggler2.classList.contains('active')).toBe(false);

    toggler2.dispatchEvent(clickEvent);
    fixture.detectChanges();
    flush();

    expect(toggler.classList.contains('active')).toBe(false);
    expect(toggler2.classList.contains('active')).toBe(true);
  }));

  it('should update active color', fakeAsync(() => {
    const treeview = document.querySelector('.treeview') as HTMLElement;

    expect(treeview.classList.contains('treeview-primary')).toBe(true);
    expect(treeview.classList.contains('treeview-secondary')).toBe(false);

    component.color = 'secondary';
    fixture.detectChanges();
    flush();

    expect(treeview.classList.contains('treeview-primary')).toBe(false);
    expect(treeview.classList.contains('treeview-secondary')).toBe(true);
  }));

  it('should expand first list using public method', fakeAsync(() => {
    component.treeview.expand('three');

    fixture.detectChanges();
    flush();

    expect(document.querySelector('#collapse-three-1_2').classList.contains('show')).toBe(true);
  }));

  it('should collapse all lists', fakeAsync(() => {
    component.data[2].collapsed = false;
    component.data[2].children[2].collapsed = false;
    component.data[2].children[2].children[0].collapsed = false;
    component.data[2].children[2].children[2].collapsed = false;

    component.data = [...component.data];
    fixture.detectChanges();
    flush();

    expect(component.treeview.nodes[2].collapsed).toBe(false);
    expect(document.querySelector('#collapse-three-1_2').classList.contains('show')).toBe(true);
    expect(component.treeview.nodes[2].children[2].collapsed).toBe(false);
    expect(document.querySelector('#collapse-second-three-1_2_2').classList.contains('show')).toBe(
      true
    );
    expect(component.treeview.nodes[2].children[2].children[0].collapsed).toBe(false);
    expect(document.querySelector('#collapse-third-one-1_2_2_0').classList.contains('show')).toBe(
      true
    );
    expect(component.treeview.nodes[2].children[2].children[2].collapsed).toBe(false);
    expect(document.querySelector('#collapse-third-three-1_2_2_2').classList.contains('show')).toBe(
      true
    );

    component.treeview.collapse();
    fixture.detectChanges();
    flush();

    expect(component.treeview.nodes[2].collapsed).toBe(true);
    expect(document.querySelector('#collapse-three-1_2').classList.contains('show')).toBe(false);
    expect(component.treeview.nodes[2].children[2].collapsed).toBe(true);
    expect(document.querySelector('#collapse-second-three-1_2_2').classList.contains('show')).toBe(
      false
    );
    expect(component.treeview.nodes[2].children[2].children[0].collapsed).toBe(true);
    expect(document.querySelector('#collapse-third-one-1_2_2_0').classList.contains('show')).toBe(
      false
    );
    expect(component.treeview.nodes[2].children[2].children[2].collapsed).toBe(true);
    expect(document.querySelector('#collapse-third-three-1_2_2_2').classList.contains('show')).toBe(
      false
    );
  }));

  it('should disabled list', fakeAsync(() => {
    const toggler = document.querySelector('#collapse-three-1_2').previousElementSibling;
    const toggler2 = document.querySelector('#collapse-second-three-1_2_2').previousElementSibling;

    expect(component.treeview.nodes[2].disabled).toBe(false || undefined);
    expect(toggler.classList.contains('treeview-disabled')).toBe(false);
    expect(component.treeview.nodes[2].children[2].disabled).toBe(false || undefined);
    expect(toggler2.classList.contains('treeview-disabled')).toBe(false);

    component.data[2].disabled = true;
    component.data[2].children[2].disabled = true;

    component.data = [...component.data];
    fixture.detectChanges();
    flush();

    expect(component.treeview.nodes[2].disabled).toBe(true);
    expect(toggler.classList.contains('treeview-disabled')).toBe(true);
    expect(component.treeview.nodes[2].children[2].disabled).toBe(true);
    expect(toggler2.classList.contains('treeview-disabled')).toBe(true);
  }));

  it('should find and collapse item', fakeAsync(() => {
    const toggler = document.querySelector('#collapse-three-1_2') as HTMLElement;

    expect(toggler.classList.contains('show')).toBe(false);

    component.treeview.filter('Second-two');

    fixture.detectChanges();
    flush();

    expect(toggler.classList.contains('show')).toBe(true);
  }));

  it('should fire selected event', fakeAsync(() => {
    expect(component.selected).toEqual(false);
    const checkbox = document.querySelector('.form-check-input');
    expect(checkbox).toBeTruthy();

    const clickEvent = new Event('click');
    const changeEvent = new Event('change');
    checkbox.dispatchEvent(clickEvent);
    checkbox.dispatchEvent(changeEvent);

    fixture.detectChanges();
    flush();

    expect(component.selected).toEqual(true);
  }));

  it('should toggle node only when clicked on an arrow icon if openOnClick input is set to false', fakeAsync(() => {
    component.openOnClick = false;
    fixture.detectChanges();
    flush();

    const oneTwoListElement = document.querySelector('#collapse-three-1_2') as HTMLUListElement;
    const thirdNode = component.treeview.nodes[2];

    expect(oneTwoListElement.classList.contains('show')).toBe(false);
    expect(thirdNode.collapsed).toBe(true);

    const linkToggler = oneTwoListElement.previousElementSibling as HTMLAnchorElement;
    linkToggler.click();
    fixture.detectChanges();
    flush();

    expect(oneTwoListElement.classList.contains('show')).toBe(false);
    expect(thirdNode.collapsed).toBe(true);

    const arrowToggler = linkToggler.querySelector('span[aria-label="toggle"]') as HTMLSpanElement;
    arrowToggler.click();
    fixture.detectChanges();
    flush();

    expect(oneTwoListElement.classList.contains('show')).toBe(true);
    expect(thirdNode.collapsed).toBe(false);
  }));

  it('should allow only one open node at a given level if accordion input is set to true', fakeAsync(() => {
    component.accordion = true;
    component.data[2].collapsed = false;
    component.data[2].children[2].collapsed = false;
    component.data[2].children[2].children[0].collapsed = false;
    component.data = [...component.data];
    fixture.detectChanges();
    flush();

    const thirdOneNode = component.treeview.nodes[2].children[2].children[0];
    const thirdThreeNode = component.treeview.nodes[2].children[2].children[2];
    const thirdOneListElement = document.querySelector(
      '#collapse-third-one-1_2_2_0'
    ) as HTMLUListElement;
    const thirdThreeListElement = document.querySelector(
      '#collapse-third-three-1_2_2_2'
    ) as HTMLUListElement;

    expect(thirdOneNode.collapsed).toBe(false);
    expect(thirdOneListElement.classList.contains('show')).toBe(true);
    expect(thirdThreeNode.collapsed).toBe(true);
    expect(thirdThreeListElement.classList.contains('show')).toBe(false);

    const toggler = thirdThreeListElement.previousElementSibling as HTMLAnchorElement;
    toggler.click();
    fixture.detectChanges();
    flush();

    expect(thirdOneNode.collapsed).toBe(true);
    expect(thirdOneListElement.classList.contains('show')).toBe(false);
    expect(thirdThreeNode.collapsed).toBe(false);
    expect(thirdThreeListElement.classList.contains('show')).toBe(true);
  }));
});
