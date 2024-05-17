import {
  Directive,
  Input,
  QueryList,
  Renderer2,
  ContentChildren,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { Subject } from 'rxjs';
import { MdbTreeTableRowDirective } from './treetable-row.directive';

export interface MdbTreeTableData {
  children?: Array<this>;
  expanded?: boolean;
  dataDepth?: number;
}

@Directive({
  selector: '[mdbTreeTable]',
  exportAs: 'mdbTreeTable',
})
export class MdbTreeTableDirective<T extends MdbTreeTableData = MdbTreeTableData>
  implements OnDestroy
{
  @ContentChildren(MdbTreeTableRowDirective, { descendants: true })
  mdbTreeTableRowDirectives: QueryList<MdbTreeTableRowDirective>;

  @Input()
  get dataSource(): T[] | null {
    return this._dataSource;
  }
  set dataSource(value: T[] | null) {
    this._dataSource = value;
    this.data = this._processDataSource(value);
  }
  private _dataSource: T[] | null = [];

  @Output() collapse: EventEmitter<T> = new EventEmitter();
  @Output() expand: EventEmitter<T> = new EventEmitter();

  public data: T[] = [];

  private _destroy$ = new Subject<void>();

  constructor(private _renderer: Renderer2) {}

  toggle(rowData: T): void {
    rowData.expanded = !rowData.expanded;
    this._updateRowVisibility(rowData);
  }

  private _updateRowVisibility(rowData: T): void {
    const rowIndex = this.data.indexOf(rowData);
    const rowElement = this.mdbTreeTableRowDirectives.toArray()[rowIndex].host;

    this._updateToggleButtonIcon(rowData, rowElement);

    if (rowData.children) {
      this._updateChildRowsVisibility(rowData);

      if (rowData.expanded) {
        this.expand.emit(rowData);
      } else {
        this.collapse.emit(rowData);
      }
    }
  }

  private _updateToggleButtonIcon(rowData: T, rowElement: HTMLTableRowElement): void {
    const toggleIcon = rowElement.querySelector('button i');
    if (toggleIcon) {
      this._renderer.removeClass(toggleIcon, rowData.expanded ? 'fa-angle-right' : 'fa-angle-down');
      this._renderer.addClass(toggleIcon, rowData.expanded ? 'fa-angle-down' : 'fa-angle-right');
    }
  }

  private _updateChildRowsVisibility(rowData: T): void {
    rowData.children.forEach((child: T) => {
      const childIndex = this.data.indexOf(child);
      const childRowElement = this.mdbTreeTableRowDirectives.toArray()[childIndex].host;

      if (rowData.expanded) {
        if (child.children) {
          child.expanded = false;
        } else {
          child.expanded = true;
        }
        this._renderer.removeClass(childRowElement, 'hidden');
      } else {
        child.expanded = false;
        this._renderer.addClass(childRowElement, 'hidden');
      }

      // Recursively update child rows visibility if the child has its children
      if (child.children) {
        this._updateRowVisibility(child);
      }
    });
  }

  private _processDataSource(
    data: T[] | null,
    dataDepth: number = 1,
    isChild: boolean = false
  ): T[] {
    if (!data) {
      return [];
    }

    let flatData: T[] = [];

    data.forEach((item) => {
      if (item.children && !('expanded' in item)) {
        item.expanded = true;
      }
      item.dataDepth = isChild && !item.children ? dataDepth - 1 : dataDepth;
      flatData.push(item);

      if (item.children) {
        const childData = this._processDataSource(item.children, dataDepth + 1, true);
        flatData = flatData.concat(childData);
      }
    });

    return flatData;
  }

  public collapseAll(): void {
    this.data.forEach((rowData) => {
      if (rowData.children) {
        rowData.expanded = false;
        this._updateRowVisibility(rowData);
      }
    });
  }

  public expandAll(): void {
    this.data.forEach((rowData) => {
      if (rowData.children) {
        rowData.expanded = true;
        this._updateRowVisibility(rowData);
      }
    });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
