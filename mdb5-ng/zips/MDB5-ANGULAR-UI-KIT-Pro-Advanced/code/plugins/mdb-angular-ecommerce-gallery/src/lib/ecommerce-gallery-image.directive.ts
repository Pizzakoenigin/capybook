import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[mdbEcommerceGalleryImage]',
})
export class MdbEcommerceGalleryImageDirective {
  @Input()
  get img(): string {
    return this._img;
  }
  set img(value: string) {
    this._img = value;
  }
  private _img = '';

  active = false;

  constructor(private _renderer: Renderer2, public elRef: ElementRef) {}

  toggleActive(isActive: boolean): void {
    const action = isActive ? 'addClass' : 'removeClass';
    this._renderer[action](this.elRef.nativeElement, 'active');
  }
}
