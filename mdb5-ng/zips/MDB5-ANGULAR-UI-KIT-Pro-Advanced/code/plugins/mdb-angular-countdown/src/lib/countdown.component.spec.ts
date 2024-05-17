import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed } from '@angular/core/testing';
import { MdbCountdownComponent } from './countdown.component';
import { MdbCountdownModule } from './countdown.module';

const template = `
  <mdb-countdown
  [countdown]="countdown"
  [countdownPosition]="countdownPosition"
  [countdownInterval]="interval"
  [countdownSeparator]="separator"
  [countdownLabelDays]="labelDays"
  [countdownLabelHours]="labelHours"
  [countdownLabelMinutes]="labelMinutes"
  [countdownLabelSeconds]="labelSeconds"
  [countdownTextStyle]="textStyle"
  [countdownLabelStyle]="labelStyle"
  #countdownComponent
  >
  </mdb-countdown>
`;

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'mdb-countdown-test',
  template,
})
class TestCountdownComponent {
  @ViewChild('countdownComponent') countdownComponent: MdbCountdownComponent;
  countdown = '20 October 2023 16:26:00';
  interval = 0;
  separator = '';
  labelDays = '';
  labelHours = '';
  labelMinutes = '';
  labelSeconds = '';
  textStyle = '';
  labelStyle = '';

  start() {
    this.countdownComponent.start();
  }

  stop() {
    this.countdownComponent.stop();
  }
}

describe('MDB Countdown', () => {
  jest.useFakeTimers().setSystemTime(new Date('2020-01-01'));

  let fixture: ComponentFixture<TestCountdownComponent>;
  let element: any;
  let component: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestCountdownComponent],
      imports: [MdbCountdownModule],
      teardown: { destroyAfterEach: false },
    });
    fixture = TestBed.createComponent(TestCountdownComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  describe('Counting', () => {
    it('should create proper message if wrong date is passed', () => {
      component.stop();
      component.countdown = 'wrong date string';

      fixture.detectChanges();

      component.start();

      fixture.detectChanges();

      expect(element.textContent).toContain('Invalid Date Format');
    });

    it('should create value span for each time unit', () => {
      component.countdown = '20 October 2021 16:26:00';

      fixture.detectChanges();
      const units = element.querySelectorAll('.countdown-unit');

      expect(units.length).toBe(4);
      units.forEach((span) => {
        expect(span.textContent).toBeTruthy();
      });
    });

    it('should start counting if interv', () => {
      const setTime = function (time) {
        const t = new Date();
        t.setSeconds(t.getSeconds() + time);
        return String(t);
      };
      const date10SecForward = setTime(10);
      component.stop();
      component.countdown = date10SecForward;
      component.interval = 10;

      fixture.detectChanges();

      component.start();
      fixture.detectChanges();

      jest.advanceTimersByTime(9000);
      fixture.detectChanges();

      expect(element.textContent).toBe('00000001');

      jest.advanceTimersByTime(420);
      jest.advanceTimersByTime(580);
      fixture.detectChanges();

      expect(element.textContent).toBe('00000000');

      jest.advanceTimersByTime(2000);
      fixture.detectChanges();

      expect(element.textContent).toBe('00000009');

      jest.advanceTimersByTime(16000);
      fixture.detectChanges();

      expect(element.textContent).toBe('00000004');
    });

    it('shouldnt throw an error when counting is done', () => {
      const setTime = function (time) {
        const t = new Date();
        t.setSeconds(t.getSeconds() + time);
        return String(t);
      };
      const date10SecForward = setTime(10);
      component.stop();
      component.countdown = date10SecForward;
      component.interval = 0;

      fixture.detectChanges();

      component.start();
      fixture.detectChanges();

      jest.advanceTimersByTime(13000);
      fixture.detectChanges();

      expect(element.textContent).toBe('00000000');
    });
  });

  describe('Options', () => {
    jest.useFakeTimers().setSystemTime(new Date('2020-01-01'));

    it('should create separator', () => {
      component.countdown = '2020-01-01';
      component.separator = ':';
      component.stop();
      fixture.detectChanges();
      component.start();
      fixture.detectChanges();

      expect(element.textContent).toBe('00:00:00:00');
    });

    it('should create labels', () => {
      component.countdown = '2020-01-01';
      component.labelDays = 'd';
      component.labelHours = 'h';
      component.labelMinutes = 'm';
      component.labelSeconds = 's';
      component.stop();
      fixture.detectChanges();
      component.start();
      fixture.detectChanges();

      expect(element.textContent).toBe('00d00h00m00s');
    });

    it('should change countdown class depending on position', () => {
      component.countdown = '2020-01-01';
      component.countdownPosition = 'vertical';
      component.stop();
      fixture.detectChanges();
      component.start();
      fixture.detectChanges();
      const countdownEl = element.querySelector('.countdown');
      expect(countdownEl.classList).toContain('countdown-vertical');
    });

    it('should add custom classes to text and label elements', () => {
      component.countdown = '2020-01-01';
      component.textStyle = 'badge bg-primary';
      component.labelStyle = 'text-light bg-dark';
      component.stop();
      fixture.detectChanges();
      component.start();
      fixture.detectChanges();

      const unit = element.querySelector('.countdown-unit');
      const text = unit.children[0];
      const label = unit.children[1];
      expect(label.classList).toContain('text-light');
      expect(text.classList).toContain('badge');
    });
  });
});
