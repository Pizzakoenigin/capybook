import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { Component, Output, EventEmitter, Input, OnInit, HostBinding } from '@angular/core';

export interface MdbPaginationChange {
  page: number;
  entries: number;
  total: number;
}

@Component({
  selector: 'mdb-table-pagination',
  templateUrl: './table-pagination.component.html',
  exportAs: 'mdbPagination',
})
export class MdbTablePaginationComponent implements OnInit {
  @Input() allText = 'All';

  @Input()
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
  }
  private _disabled = false;

  @Input()
  set entries(value: number) {
    this._entries = value;

    if (this._isInitialized) {
      this._updateEntriesOptions();
    }
  }
  get entries(): number {
    return this._entries;
  }
  private _entries = 10;

  @Input()
  get entriesOptions(): number[] {
    return this._entriesOptions;
  }
  set entriesOptions(value: number[]) {
    this._entriesOptions = value;

    if (this._isInitialized) {
      this._updateEntriesOptions();
    }
  }
  private _entriesOptions = [10, 25, 50, 200];

  @Input()
  get nextButtonDisabled(): boolean {
    return this._nextButtonDisabled;
  }
  set nextButtonDisabled(value: boolean) {
    this._nextButtonDisabled = coerceBooleanProperty(value);
  }
  private _nextButtonDisabled = false;

  @Input() ofText = 'of';

  @Input()
  get prevButtonDisabled(): boolean {
    return this._prevButtonDisabled;
  }
  set prevButtonDisabled(value: boolean) {
    this._prevButtonDisabled = coerceBooleanProperty(value);
  }
  private _prevButtonDisabled = false;

  @Input() rowsPerPageText = 'Rows per page';

  @Input()
  get showAllEntries(): boolean {
    return this._showAllEntries;
  }
  set showAllEntries(value: boolean) {
    this._showAllEntries = coerceBooleanProperty(value);
  }
  private _showAllEntries = false;

  @Input()
  set total(value: number) {
    this._total = value;
  }
  get total(): number {
    return this._total;
  }
  private _total = 0;

  get page(): number {
    return this._page;
  }
  set page(value: number) {
    this._page = value;
  }
  private _page = 0;

  private _isInitialized = false;
  public firstVisibleItem = 1;
  public lastVisibleItem = 0;
  public activePageNumber = 1;

  @HostBinding('style.display') display = 'block';

  @Output() paginationChange = new EventEmitter<MdbPaginationChange>();

  constructor() {}

  ngOnInit(): void {
    this._isInitialized = true;
    this._updateEntriesOptions();
  }

  getPaginationRangeText(): string {
    const startIndex = this.page * this.entries;
    const endIndex = Math.min(startIndex + this.entries, this.total);

    return `${this._total ? startIndex + 1 : 0} – ${endIndex} ${this.ofText} ${this.total}`;
  }

  isPreviousPageDisabled(): boolean {
    return this.page === 0;
  }

  isNextPageDisabled(): boolean {
    const allPages = this._getNumberOfPages();

    return this.page === allPages - 1 || allPages === 0;
  }

  private _getNumberOfPages(): number {
    return Math.ceil(this.total / this.entries);
  }

  nextPage(): void {
    if (this.isNextPageDisabled()) {
      return;
    }

    this.page++;
    this._emitPaginationChange();
  }

  previousPage(): void {
    if (this.isPreviousPageDisabled()) {
      return;
    }

    this.page--;
    this._emitPaginationChange();
  }

  updateRowPerPageNumber(entries: any): void {
    const startIndex = this.page * this.entries;
    this.entries = entries;
    this.page = Math.floor(startIndex / entries) || 0;

    this._emitPaginationChange();
  }

  private _emitPaginationChange(): void {
    this.paginationChange.emit({
      page: this.page,
      entries: this.entries,
      total: this.total,
    });
  }

  private _updateEntriesOptions(): void {
    const entriesDefault = 10;
    const hasEntriesOptions = this.entriesOptions.length !== 0;
    const firstOption = hasEntriesOptions && this.entriesOptions[0];

    if (!this.entries) {
      this.entries = firstOption ? firstOption : entriesDefault;
    }

    if (!this.entriesOptions.includes(this.entries) && !this.showAllEntries) {
      this.entriesOptions.push(this.entries);
      this.entriesOptions.sort((a, b) => a - b);
    }
  }

  static ngAcceptInputType_disabled: BooleanInput;
  static ngAcceptInputType_prevButtonDisabled: BooleanInput;
  static ngAcceptInputType_nextButtonDisabled: BooleanInput;
  static ngAcceptInputType_showAllEntries: BooleanInput;
}
