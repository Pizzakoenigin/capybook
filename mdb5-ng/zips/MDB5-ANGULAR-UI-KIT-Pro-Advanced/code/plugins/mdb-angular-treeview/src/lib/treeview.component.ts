import { coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  ViewChildren,
  QueryList,
  Renderer2,
  ElementRef,
  ChangeDetectorRef,
} from '@angular/core';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'mdb-treeview',
  exportAs: 'mdbTreeview',
  templateUrl: 'treeview.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdbTreeviewComponent {
  @ViewChildren('activeElement') activeElement: QueryList<ElementRef>;

  @Input()
  get accordion(): boolean {
    return this._accordion;
  }
  set accordion(value: boolean) {
    this._accordion = coerceBooleanProperty(value);
  }
  private _accordion = false;

  @Input() checkboxesField: string;

  @Input() checkedField: string;

  @Input() childrenField: string;

  @Input() color = 'primary';

  @Input()
  get line(): boolean {
    return this._line;
  }
  set line(value: boolean) {
    this._line = coerceBooleanProperty(value);
  }
  private _line = false;

  @Input()
  get nodes(): any[] {
    return this._nodes;
  }
  set nodes(newData: any[]) {
    this._nodes = this._setLevelsAndCollapsed(newData);
  }
  private _nodes: any[];

  @Input()
  get openOnClick(): boolean {
    return this._openOnClick;
  }
  set openOnClick(value: boolean) {
    this._openOnClick = coerceBooleanProperty(value);
  }
  private _openOnClick = true;

  @Input() rotationAngle = '90';

  @Input()
  get selectable(): boolean {
    return this._selectable;
  }
  set selectable(value: boolean) {
    this._selectable = coerceBooleanProperty(value);
  }
  private _selectable = false;

  @Input() textField: string;

  @Output() selected: EventEmitter<any> = new EventEmitter();
  @Output() activeItemChange: EventEmitter<ElementRef> = new EventEmitter();

  constructor(private _renderer: Renderer2, private _cdRef: ChangeDetectorRef) {}

  private _setLevelsAndCollapsed(nodes: any[], level: number = 0): any[] {
    return nodes.map((node) => {
      node.level = level;

      if (node[this.childrenField] && node[this.childrenField].length > 0) {
        node.collapsed = node.collapsed === undefined ? true : node.collapsed;
        node[this.childrenField] = this._setLevelsAndCollapsed(node[this.childrenField], level + 1);
      }

      return node;
    });
  }

  handleClick(clickedNode: any, clickedElement: HTMLAnchorElement | HTMLSpanElement) {
    // This step is necessary to define the proper element that should be activated
    // When [openOnClick]="false" only span element with arrow is clickable therefore we need to grab
    // the parent element which is the desired <a> element that should be passed into setActive function
    let target: any;
    if (!this.openOnClick && clickedElement instanceof HTMLSpanElement) {
      target = clickedElement.parentElement;
    } else {
      target = clickedElement;
    }

    this.setActive(target, false);

    clickedNode.collapsed = !clickedNode.collapsed;

    // This check makes sure all children nodes get collapsed when we collapse parent node
    if (clickedNode.collapsed) {
      this._collapseChildrenNodes(clickedNode);
    }

    if (this.accordion) {
      this._showOnlyOne(clickedNode);
    }
  }

  private _collapseChildrenNodes(clickedNode: any): void {
    if (clickedNode[this.childrenField] && clickedNode[this.childrenField].length > 0) {
      clickedNode[this.childrenField].forEach((childNode) => {
        childNode.collapsed = true;
        this._collapseChildrenNodes(childNode);
      });
    }
  }

  private _showOnlyOne(clickedNode: any): void {
    const iterate = (nodes: any[], level: number = 0) => {
      nodes.forEach((node) => {
        if (node.level === clickedNode.level && node !== clickedNode) {
          node.collapsed = true;
        }

        if (node[this.childrenField]) {
          iterate(node[this.childrenField], level + 1);
        }
      });
    };

    iterate(this.nodes);
  }

  expand(id: string): void {
    const node = this._deepFind(id, 'expandId');

    if (!node) {
      return;
    }

    this._expandParentsNode(node[this.textField]);

    node.collapsed = false;

    this._cdRef.markForCheck();
  }

  collapse(): void {
    this._collapseAll(this.nodes);
    this._cdRef.markForCheck();
  }

  _checkboxChange(node: any, isChecked: boolean): void {
    node[this.checkedField] = isChecked;
  }

  _handleCheckboxClick(element: HTMLInputElement, isChecked: boolean, node: any): void {
    const isParentField = () => node[this.childrenField];

    const toggleAllDirectChildrenCheckboxes = (actualNode: any, state: boolean): void => {
      actualNode[this.childrenField].forEach((childrenNode) => {
        this._checkboxChange(childrenNode, state);
      });
    };

    const toggleAllChildrenCheckboxes = (actualNode: any, state: boolean): void => {
      toggleAllDirectChildrenCheckboxes(actualNode, state);
      actualNode[this.childrenField]?.forEach((childrenNode) => {
        if (childrenNode[this.childrenField]) {
          toggleAllChildrenCheckboxes(childrenNode, state);
        }
      });
    };

    if (isChecked && isParentField()) {
      toggleAllChildrenCheckboxes(node, true);
    }
    if (!isChecked && isParentField()) {
      toggleAllChildrenCheckboxes(node, false);
    }

    this._checkboxChange(node, element.checked);

    const iterator = (actualNode: any = this.nodes): void => {
      actualNode.forEach((childrenNode) => {
        if (childrenNode[this.childrenField]) {
          iterator(childrenNode[this.childrenField]);
          let isAllChildrenChecked = childrenNode[this.childrenField].every(
            (sibling) => sibling[this.checkedField] === true
          );
          this._checkboxChange(childrenNode, isAllChildrenChecked);
        }
      });
    };
    iterator(this.nodes);
  }

  checkboxSelected(node: any): void {
    this.selected.emit(node);
  }

  setActive(target: ElementRef, preventClick: boolean): void {
    if (preventClick) {
      return;
    }

    this.activeElement.forEach((element: ElementRef) => {
      this._renderer.removeClass(element.nativeElement, 'active');
    });

    this._renderer.addClass(target, 'active');

    this.activeItemChange.emit(target);
  }

  filter(value: string): void {
    this.collapse();

    const node = this._deepFind(value, 'name');

    if (!node) {
      return;
    }

    this._expandParentsNode(node[this.textField]);

    node.collapsed = false;

    this._cdRef.markForCheck();
  }

  generateUid(): string {
    const uid = Math.random().toString(36).substr(2, 9);
    return `mdb-treeview-${uid}`;
  }

  private _deepFind(value: string, key: string = this.textField): any {
    let result: any;

    const findInNode = (nodes: any[], value: string) => {
      nodes.forEach((node: any) => {
        const includes = node[key]?.toLowerCase().includes(value.toLowerCase());

        if (includes) {
          result = node;
        } else if (node[this.childrenField]) {
          findInNode(node[this.childrenField], value);
        }
      });
    };

    findInNode(this.nodes, value);

    return result;
  }

  private _expandParentsNode(value: string, key: string = this.textField): void {
    const findInNode = (nodes: any, value: string) => {
      nodes.forEach((parentNode: any) => {
        parentNode[this.childrenField]?.forEach((childrenNode: any) => {
          const includes = childrenNode[key]?.toLowerCase().includes(value.toLowerCase());

          if (includes) {
            parentNode.collapsed = false;
          } else if (childrenNode[this.childrenField]) {
            findInNode(parentNode[this.childrenField], value);
          }
        });
      });
    };

    findInNode(this.nodes, value);
  }

  private _collapseAll(nodes: any): void {
    nodes.forEach((node: any) => {
      node.collapsed = true;

      if (node[this.childrenField]) {
        this._collapseAll(node[this.childrenField]);
      }
    });
  }
}
