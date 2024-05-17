import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MdbCalendarEvent } from './calendar.event.interface';
import { addDays, generateEvent, getDate, getDayNumber, getMonth, getYear } from './calendar.utils';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'mdb-tools-calendar',
  templateUrl: './calendar-tools.component.html',
  styles: [],
})
export class MdbCalendarToolsComponent implements OnDestroy {
  @Input() options;
  @Input()
  get activeDate(): Date {
    return this._activeDate;
  }
  set activeDate(date: Date) {
    this._activeDate = date;
    this.setPeriod();
  }
  private _activeDate: Date;
  @Input() mondayFirst;
  @Input()
  get activeView(): String {
    return this._activeView;
  }
  set activeView(view: String) {
    if (this.activeView !== view) {
      this._activeView = view;
      this.viewControl.setValue(view);
      this.setPeriod();
    }
  }
  private _activeView: String;
  @Input() navigation: boolean;
  @Input() viewSelect: boolean;
  @Input() addEventButton: boolean;
  private _destroy$ = new Subject<void>();

  @Output() viewChange: EventEmitter<string> = new EventEmitter();
  @Output() previousBtnClick: EventEmitter<string> = new EventEmitter();
  @Output() nextBtnClick: EventEmitter<string> = new EventEmitter();
  @Output() todayBtnClick: EventEmitter<string> = new EventEmitter();
  @Output() addEventBtnClick: EventEmitter<MdbCalendarEvent> = new EventEmitter();

  viewControl = new UntypedFormControl('month');
  period;

  constructor() {
    this.viewControl.valueChanges.pipe(takeUntil(this._destroy$)).subscribe((value: string) => {
      this.toggleView(value);
    });
  }

  setPeriod(): void {
    const sundayIndex = this.mondayFirst ? 1 : 0;
    const firstDay = addDays(this.activeDate, -getDayNumber(this.activeDate) + sundayIndex);
    const lastDay = addDays(firstDay, 6);

    const startMonth = `${this.options.monthsShort[getMonth(firstDay)]}`;
    const endMonth = `${this.options.monthsShort[getMonth(lastDay)]}`;
    const year = `${getYear(lastDay)}`;

    if (startMonth != endMonth) {
      this.period = `${startMonth} - ${endMonth}, ${year}`;
      return;
    }

    this.period = `${
      this.options.months[this.activeDate.getMonth()]
    } ${this.activeDate.getFullYear()}`;
  }

  onAddEventClick(): void {
    const newCalendarEvent = generateEvent(new Date());
    this.addEventBtnClick.emit(newCalendarEvent);
  }

  toggleView(view: string): void {
    this.viewChange.emit(view);
  }

  handlePreviousBtnClick(): void {
    this.previousBtnClick.emit();
  }

  handleNextBtnClick(): void {
    this.nextBtnClick.emit();
  }

  handleTodayBtnClick(): void {
    this.todayBtnClick.emit();
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
