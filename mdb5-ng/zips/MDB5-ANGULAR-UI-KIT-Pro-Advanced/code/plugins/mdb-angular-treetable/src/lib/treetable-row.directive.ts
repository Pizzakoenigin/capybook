import { AfterViewInit, Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { MdbTreeTableData, MdbTreeTableDirective } from './treetable.directive';

@Directive({
  selector: '[mdbTreeTableRow]',
})
export class MdbTreeTableRowDirective<T extends MdbTreeTableData = MdbTreeTableData>
  implements AfterViewInit
{
  @Input('mdbTreeTableRow') rowData: T;

  constructor(
    private _elementRef: ElementRef,
    private _renderer: Renderer2,
    private _mdbTreeTable: MdbTreeTableDirective<T>
  ) {}

  ngAfterViewInit(): void {
    this._processRows();
  }

  get host(): HTMLTableRowElement {
    return this._elementRef.nativeElement;
  }

  private _processRows(): void {
    this._setPadding();
    this._wrapTdContentInDiv();

    if (this.rowData.children && this.rowData.children.length > 0) {
      this._setToggleButton();
    }
  }

  private _setPadding(): void {
    const PADDING_VALUE = 25;
    const firstCell = this.host.cells[0];
    const paddingLeft = (this.rowData.dataDepth || 1) * PADDING_VALUE;
    this._renderer.setStyle(firstCell, 'padding-left', `${paddingLeft}px`);
  }

  private _wrapTdContentInDiv(): void {
    Array.from(this.host.cells).forEach((cell) => {
      const content = cell.innerHTML;
      const divElement = this._renderer.createElement('div');
      this._renderer.setProperty(divElement, 'innerHTML', content);
      this._renderer.setProperty(cell, 'innerHTML', '');
      this._renderer.appendChild(cell, divElement);
    });
  }

  private _setToggleButton(): void {
    const firstCell = this.host.cells[0];
    const divElement = firstCell.querySelector('div');
    const existingButton = divElement.previousElementSibling as HTMLButtonElement;

    if (existingButton && existingButton.tagName === 'BUTTON') {
      return;
    }

    const toggleButton = this._renderer.createElement('button');
    const toggleIcon = this._renderer.createElement('i');

    this._renderer.addClass(toggleButton, 'btn');
    this._renderer.addClass(toggleButton, 'btn-link');
    this._renderer.addClass(toggleButton, 'btn-rounded');
    this._renderer.addClass(toggleButton, 'p-0');
    this._renderer.addClass(toggleButton, 'mx-n3');
    this._renderer.addClass(toggleButton, 'my-1');
    this._renderer.addClass(toggleButton, 'position-absolute');
    this._renderer.addClass(toggleButton, 'text-dark');

    this._renderer.addClass(toggleIcon, 'fas');
    this._renderer.addClass(toggleIcon, this.rowData.expanded ? 'fa-angle-down' : 'fa-angle-right');
    this._renderer.addClass(toggleIcon, 'fa-lg');

    this._renderer.setAttribute(toggleIcon, 'aria-hidden', 'true');

    this._renderer.appendChild(toggleButton, toggleIcon);
    this._renderer.insertBefore(divElement, toggleButton, divElement.firstChild);

    this._renderer.listen(toggleButton, 'click', () => {
      this._mdbTreeTable.toggle(this.rowData);
    });
  }
}
