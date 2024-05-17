import { OverlayRef } from '@angular/cdk/overlay';
import { Observable, Subject } from 'rxjs';
import { first } from 'rxjs/operators';
import { MdbPopconfirmContainerComponent } from './popconfirm-container.component';

export class MdbPopconfirmRef<T> {
  constructor(
    public overlayRef: OverlayRef,
    private _popconfirmContainerRef: MdbPopconfirmContainerComponent
  ) {}

  component: T;

  private readonly onClose$: Subject<any> = new Subject();
  private readonly onConfirm$: Subject<any> = new Subject();

  readonly onClose: Observable<any> = this.onClose$.asObservable();
  readonly onConfirm: Observable<any> = this.onConfirm$.asObservable();

  close(message?: any): void {
    this._popconfirmContainerRef.startCloseAnimation();

    this._popconfirmContainerRef._hidden.pipe(first()).subscribe(() => {
      this.onClose$.next(message);
      this.onClose$.complete();

      this.overlayRef.detach();
      this.overlayRef.dispose();
    });
  }

  confirm(message?: any): void {
    this._popconfirmContainerRef.startCloseAnimation();

    this._popconfirmContainerRef._hidden.pipe(first()).subscribe(() => {
      this.onConfirm$.next(message);
      this.onConfirm$.complete();

      this.overlayRef.detach();
      this.overlayRef.dispose();
    });
  }

  getPosition(): DOMRect {
    return this.overlayRef.overlayElement.getBoundingClientRect();
  }
}
