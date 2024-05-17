import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, OnDestroy } from '@angular/core';
import { fromEvent, Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class MdbScrollStatusService implements OnDestroy {
  readonly _destroy$: Subject<void> = new Subject<void>();

  constructor(@Inject(DOCUMENT) private _document: any) {}

  public getScrollPercentage(container?: HTMLElement): Observable<number> {
    const target = container ? container : window;
    return fromEvent(target, 'scroll').pipe(
      takeUntil(this._destroy$),
      map(() =>
        container ? this.calculateContainerScroll(container) : this._calculateWindowScroll()
      )
    );
  }

  private calculateContainerScroll(container: HTMLElement): number {
    let scrollHeight: number;
    let fullHeight: number;
    let scrollPercentage: number;

    scrollHeight = container.scrollTop;
    fullHeight = container.scrollHeight - container.clientHeight;
    scrollPercentage = (scrollHeight / fullHeight) * 100;

    return scrollPercentage;
  }

  private _calculateWindowScroll(): number {
    let scrollHeight: number;
    let fullHeight: number;
    let scrollPercentage: number;

    scrollHeight =
      window.scrollY ||
      this._document.documentElement.scrollTop ||
      this._document.body.scrollTop ||
      0;
    fullHeight =
      this._document.documentElement.scrollHeight - window.innerHeight ||
      this._document.scrollingElement.clientHeight;

    scrollPercentage = (scrollHeight / fullHeight) * 100;

    return scrollPercentage;
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
