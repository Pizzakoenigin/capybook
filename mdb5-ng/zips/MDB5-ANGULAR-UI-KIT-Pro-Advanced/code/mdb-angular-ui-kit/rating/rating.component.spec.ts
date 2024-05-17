import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MdbRatingModule } from './rating.module';
import { MdbRatingComponent } from './rating.component';
import { By } from '@angular/platform-browser';

@Component({
  selector: 'mdb-rating-test',
  template: `
    <mdb-rating>
      <mdb-rating-icon [icon]="'far fa-angry fa-lg'" [color]="'#673ab7'"></mdb-rating-icon>
      <mdb-rating-icon [icon]="'far fa-frown fa-lg'" [color]="'#3f51b5'"></mdb-rating-icon>
      <mdb-rating-icon [icon]="'far fa-meh fa-lg'" [color]="'#2196f3'"></mdb-rating-icon>
      <mdb-rating-icon [icon]="'far fa-smile fa-lg'" [color]="'#03a9f4'"></mdb-rating-icon>
      <mdb-rating-icon [icon]="'far fa-grin-stars fa-lg'" [color]="'#00bcd4'"></mdb-rating-icon>
    </mdb-rating>
  `,
})
class TestRatingComponent {
  @ViewChild(MdbRatingComponent) rating: MdbRatingComponent;
}

@Component({
  template: `
    <mdb-rating [readonly]="true">
      <mdb-rating-icon [icon]="'far fa-angry fa-lg'" [color]="'#673ab7'"></mdb-rating-icon>
      <mdb-rating-icon [icon]="'far fa-frown fa-lg'" [color]="'#3f51b5'"></mdb-rating-icon>
      <mdb-rating-icon [icon]="'far fa-meh fa-lg'" [color]="'#2196f3'"></mdb-rating-icon>
      <mdb-rating-icon [icon]="'far fa-smile fa-lg'" [color]="'#03a9f4'"></mdb-rating-icon>
      <mdb-rating-icon [icon]="'far fa-grin-stars fa-lg'" [color]="'#00bcd4'"></mdb-rating-icon>
    </mdb-rating>
  `,
})
class RatingReadonlyComponent {
  @ViewChild(MdbRatingComponent) rating: MdbRatingComponent;
}

describe('MDB Rating', () => {
  let fixture: ComponentFixture<TestRatingComponent>;
  let component: TestRatingComponent;
  let mdbRating: any;
  let mdbRatingIcons: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestRatingComponent, RatingReadonlyComponent],
      imports: [MdbRatingModule],
      teardown: { destroyAfterEach: false },
    });
    fixture = TestBed.createComponent(TestRatingComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
    mdbRating = fixture.debugElement.query(By.css('mdb-rating'));
    mdbRatingIcons = fixture.debugElement.queryAll(By.css('mdb-rating-icon'));
  });

  it('should set active on mouseenter and remove active after mouseleave', () => {
    const icons = fixture.nativeElement.querySelectorAll('i');
    const rating = fixture.nativeElement.querySelector('.rating');
    const mouseEnterEvent = new MouseEvent('mouseenter');
    const mouseLeaveEvent = new MouseEvent('mouseleave');

    expect(icons[0].classList).not.toContain('active');
    expect(icons[1].classList).not.toContain('active');

    icons[1].dispatchEvent(mouseEnterEvent);
    fixture.detectChanges();

    expect(icons[0].classList).toContain('active');
    expect(icons[1].classList).toContain('active');

    rating.dispatchEvent(mouseLeaveEvent);
    fixture.detectChanges();

    expect(icons[0].classList).not.toContain('active');
    expect(icons[1].classList).not.toContain('active');
  });

  it('should emit onHover event on icons hover', () => {
    const icons = fixture.nativeElement.querySelectorAll('i');
    const mouseEnterEvent = new MouseEvent('mouseenter');
    const hoverSpy = jest.spyOn(component.rating.onHover, 'emit');

    icons[1].dispatchEvent(mouseEnterEvent);
    fixture.detectChanges();

    expect(hoverSpy).toHaveBeenCalled();
    expect(hoverSpy).toHaveBeenCalledWith(2);
  });

  it('should set active after click and not remove it after mouseleave', () => {
    const icons = fixture.nativeElement.querySelectorAll('i');
    const rating = fixture.nativeElement.querySelector('.rating');
    const mouseEnterEvent = new MouseEvent('mouseenter');
    const mouseLeaveEvent = new MouseEvent('mouseleave');

    expect(icons[0].classList).not.toContain('active');
    expect(icons[1].classList).not.toContain('active');

    icons[1].dispatchEvent(mouseEnterEvent);
    fixture.detectChanges();

    rating.click();
    fixture.detectChanges();

    expect(icons[0].classList).toContain('active');
    expect(icons[1].classList).toContain('active');
    expect(icons[2].classList).not.toContain('active');

    rating.dispatchEvent(mouseLeaveEvent);
    fixture.detectChanges();

    expect(icons[0].classList).toContain('active');
    expect(icons[1].classList).toContain('active');
  });

  it('should emit onSelect event after selection on click', () => {
    const icons = fixture.nativeElement.querySelectorAll('i');
    const rating = fixture.nativeElement.querySelector('.rating');
    const mouseEnterEvent = new MouseEvent('mouseenter');
    const selectSpy = jest.spyOn(component.rating.onSelect, 'emit');

    icons[1].dispatchEvent(mouseEnterEvent);
    fixture.detectChanges();

    rating.click();
    fixture.detectChanges();

    expect(selectSpy).toHaveBeenCalled();
    expect(selectSpy).toHaveBeenCalledWith(2);
  });

  it('should disable all icons if readonly input is set to true', () => {
    fixture = TestBed.createComponent(RatingReadonlyComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;

    const icons: HTMLElement[] = fixture.nativeElement.querySelectorAll('i');
    const rating = fixture.nativeElement.querySelector('.rating');
    const mouseEnterEvent = new MouseEvent('mouseenter');

    icons[4].dispatchEvent(mouseEnterEvent);
    fixture.detectChanges();

    rating.click();
    fixture.detectChanges();

    icons.forEach((icon) => {
      expect(icon.classList).not.toContain('active');
    });
  });
});
