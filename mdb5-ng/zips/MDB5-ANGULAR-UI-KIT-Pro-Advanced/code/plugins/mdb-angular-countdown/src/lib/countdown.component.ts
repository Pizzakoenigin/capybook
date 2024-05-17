import { coerceNumberProperty, NumberInput } from '@angular/cdk/coercion';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { timer } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import {
  getNowDatePlusSeconds,
  convertMsToDays,
  convertMsToHours,
  convertMsToMinutes,
  convertMsToSeconds,
} from './countdown.utils';

type CountdownUnit = 'days' | 'hours' | 'minutes' | 'seconds';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'mdb-countdown',
  templateUrl: './countdown.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdbCountdownComponent implements OnInit {
  @Input() countdown: string = '';
  @Input() countdownUnits: CountdownUnit[] = ['days', 'hours', 'minutes', 'seconds'];
  @Input() countdownSeparator: string = '';
  @Input() countdownPosition: 'horizontal' | 'vertical' = 'horizontal';
  @Input() countdownLabelPosition: 'horizontal' | 'vertical' = 'vertical';
  @Input() countdownLabelDays = '';
  @Input() countdownLabelHours = '';
  @Input() countdownLabelMinutes = '';
  @Input() countdownLabelSeconds = '';
  @Input() countdownTextStyle = '';
  @Input() countdownLabelStyle = '';
  @Input() countdownTextSize = '';
  @Input() countdownLabelSize = '';
  @Input()
  get countdownInterval(): number {
    return this._countdownInterval;
  }
  set countdownInterval(value: NumberInput) {
    this._countdownInterval = coerceNumberProperty(value);
  }
  private _countdownInterval = 0;

  private _countdown: Date = new Date(Date.now());
  private _isCounting = false;
  private _dateDistance = 0;

  isInvalidDate = false;
  unitFields = {
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00',
  };

  @Output() endCountdown: EventEmitter<void> = new EventEmitter();
  @Output() startCountdown: EventEmitter<void> = new EventEmitter();

  constructor(private _cdRef: ChangeDetectorRef) {}

  private _updateDateDistance(): void {
    const actualDate = new Date().getTime();

    let dateDistance = this._countdown.getTime() - actualDate;

    if (this._dateDistance !== 0 && this._dateDistance - dateDistance > 1000) {
      dateDistance = this._dateDistance - 1000;
    }

    this._dateDistance = dateDistance;
  }

  private _updateDateFields(): void {
    this.unitFields.days = convertMsToDays(this._dateDistance);
    this.unitFields.hours = convertMsToHours(this._dateDistance);
    this.unitFields.minutes = convertMsToMinutes(this._dateDistance);
    this.unitFields.seconds = convertMsToSeconds(this._dateDistance);
    this._cdRef.markForCheck();
  }

  private _startInterval() {
    this._updateDateDistance();
    this._updateDateFields();
    this._isCounting = true;

    timer(0, 1000)
      .pipe(takeWhile(() => this._isCounting))
      .subscribe(() => {
        this._updateDateDistance();
        this._updateDateFields();

        if (this._dateDistance < 0 && this.countdownInterval <= 0) {
          this.stop();
        }

        if (this._dateDistance < 0 && this.countdownInterval > 0) {
          this._countdown = getNowDatePlusSeconds(this._countdownInterval);
        }
      });
  }

  getLabel(unit: string): string {
    switch (unit) {
      case 'days':
        return this.countdownLabelDays;
      case 'hours':
        return this.countdownLabelHours;
      case 'minutes':
        return this.countdownLabelMinutes;
      case 'seconds':
        return this.countdownLabelSeconds;
      default:
        return '';
    }
  }

  start() {
    this._countdown = new Date(Date.parse(this.countdown));
    if (isNaN(this._countdown.getTime())) {
      this.isInvalidDate = true;
      this._cdRef.markForCheck();
      return;
    }

    this._startInterval();
    this.startCountdown.emit();
  }

  stop() {
    this._isCounting = false;
    this._dateDistance = 0;
    this.endCountdown.emit();
  }

  ngOnInit() {
    this.start();
  }
}
