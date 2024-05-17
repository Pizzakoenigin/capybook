import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  Component,
  forwardRef,
  HostBinding,
  HostListener,
  Inject,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MdbTableSortDirective, MdbSortDirection } from './table-sort.directive';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[mdbTableSortHeader]',
  templateUrl: './table-sort-header.component.html',
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class MdbTableSortHeaderDirective implements OnInit, OnDestroy {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input()
  get disableSort(): boolean {
    return this._disableSort;
  }
  set disableSort(value: boolean) {
    this._disableSort = coerceBooleanProperty(value);
  }
  private _disableSort = false;

  @Input()
  get forceSort(): boolean {
    return this._forceSort;
  }
  set forceSort(value: boolean) {
    this._forceSort = coerceBooleanProperty(value);
  }
  private _forceSort = false;

  @Input('mdbTableSortHeader')
  get name(): string {
    return this._name;
  }
  set name(value: string) {
    this._name = this._toCamelCase(value);
  }
  private _name: string;

  direction: MdbSortDirection = 'none';

  get rotate(): string {
    if (this.direction === 'none' || this.direction === 'asc') {
      return 'rotate(0deg)';
    } else {
      return 'rotate(180deg)';
    }
  }

  @HostBinding('style.cursor') get cursor() {
    return this.disableSort ? '' : 'pointer';
  }

  @HostListener('click')
  onClick(): void {
    if (this._disableSort) {
      return;
    }
    this.direction = this._getSortingDirection();

    this._sort.sort(this);
  }

  constructor(
    @Inject(forwardRef(() => MdbTableSortDirective)) private _sort: MdbTableSortDirective
  ) {}

  private _toCamelCase(str: string): string {
    return str
      .replace(/\s(.)/g, (a) => {
        return a.toUpperCase();
      })
      .replace(/\s/g, '')
      .replace(/^(.)/, (b) => {
        return b.toLowerCase();
      });
  }

  private _getSortingDirection(): MdbSortDirection {
    if (this.forceSort) {
      return this.direction === 'asc' ? 'desc' : 'asc';
    }

    if (this.direction === 'none') {
      return 'asc';
    }

    if (this.direction === 'asc') {
      return 'desc';
    }

    return 'none';
  }

  ngOnInit(): void {
    this._sort.addHeader(this.name, this);
  }

  ngOnDestroy(): void {
    this._sort.removeHeader(this.name);
  }

  static ngAcceptInputType_disableSort: BooleanInput;
  static ngAcceptInputType_forceSort: BooleanInput;
}
