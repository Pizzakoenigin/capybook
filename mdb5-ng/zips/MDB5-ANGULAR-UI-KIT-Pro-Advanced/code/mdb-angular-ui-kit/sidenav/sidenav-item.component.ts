import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  forwardRef,
  Inject,
  OnDestroy,
  Optional,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { fromEvent, merge, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { MdbCollapseDirective } from 'mdb-angular-ui-kit/collapse';
import { MdbSidenavLayoutComponent } from './sidenav-loyaut.component';
import { MdbSidenavComponent } from './sidenav.component';

@Component({
  selector: 'mdb-sidenav-item',
  templateUrl: 'sidenav-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'listitem',
  },
})
export class MdbSidenavItemComponent implements AfterViewInit, AfterContentInit, OnDestroy {
  @ViewChild('linkWrapper') _sidenavLink: ElementRef;
  @ContentChild(MdbCollapseDirective) collapse: MdbCollapseDirective;

  private _tempSlim = false;
  private _isSlimTransitioning = false;

  sidenavLayout: MdbSidenavLayoutComponent;

  readonly _destroy$: Subject<void> = new Subject<void>();

  constructor(
    private _renderer: Renderer2,
    private _elRef: ElementRef,
    @Optional() private _router: Router,
    @Optional() private _route: ActivatedRoute,
    private _cdRef: ChangeDetectorRef,
    @Inject(forwardRef(() => MdbSidenavComponent)) private _sidenav: MdbSidenavComponent
  ) {}

  ngAfterContentInit(): void {
    if (this.collapse) {
      this.collapse.collapseShow.pipe(takeUntil(this._destroy$)).subscribe(() => {
        this._toggleArrowIcon('up');
      });
      this.collapse.collapseHide.pipe(takeUntil(this._destroy$)).subscribe(() => {
        this._toggleArrowIcon('down');
      });
    }
  }

  ngAfterViewInit(): void {
    if (!this.collapse) {
      return;
    }

    const links = this._elRef.nativeElement.querySelectorAll('.sidenav-link');
    // links[0].innerHTML += '<i class="fas fa-angle-down rotate-icon"></i>';
    const iElement = this._renderer.createElement('i');
    this._renderer.addClass(iElement, 'fas');
    this._renderer.addClass(iElement, 'fa-angle-down');
    this._renderer.addClass(iElement, 'rotate-icon');
    this._renderer.appendChild(links[0], iElement);

    if (!this.collapse.collapsed) {
      this._toggleArrowIcon('up');
    }

    this._sidenav.sidenavCollapsed.pipe(takeUntil(this._destroy$)).subscribe(() => {
      this._isSlimTransitioning = false;
    });

    this._sidenav.sidenavCollapse.pipe(takeUntil(this._destroy$)).subscribe(() => {
      this._isSlimTransitioning = true;
    });

    this._sidenav.sidenavExpand.pipe(takeUntil(this._destroy$)).subscribe(() => {
      this._isSlimTransitioning = true;
    });

    this._sidenav.sidenavExpanded.pipe(takeUntil(this._destroy$)).subscribe(() => {
      this._isSlimTransitioning = false;
    });

    this.collapse.collapseHide.pipe(takeUntil(this._destroy$)).subscribe(() => {
      if (!this._sidenav.slim) {
        return;
      }
      if (
        this._sidenav.isTheLastItemToBeCollapsed() &&
        !this._sidenav.slimCollapsed &&
        !this._isSlimTransitioning
      ) {
        this._tempSlim = false;
        this._sidenav.setSlim(true);
      }
    });

    this.collapse.host.childNodes.forEach((child: HTMLElement) => {
      fromEvent(child, 'click')
        .pipe(takeUntil(this._destroy$))
        .subscribe(() => this.setActiveElement(child));
    });

    const clickEvent$ = fromEvent(this._sidenavLink.nativeElement, 'click');
    const keydownEvent$ = fromEvent(this._sidenavLink.nativeElement, 'keydown').pipe(
      filter((event: KeyboardEvent) => event.key === 'Enter')
    );

    const pressLinkEvents$ = merge(clickEvent$, keydownEvent$).pipe(takeUntil(this._destroy$));
    pressLinkEvents$.subscribe(() => {
      if (this._sidenav.accordion) {
        this._sidenav.closeOtherCollapseItems(this.collapse);
      }
      this.collapse.toggle();
      if (this._sidenav.slimCollapsed && !this._isSlimTransitioning) {
        this._tempSlim = true;
        this._sidenav.setSlim(false);
      }
    });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  markForCheck(): void {
    this._cdRef.markForCheck();
  }

  public setActiveElement(el: HTMLElement): void {
    this.markForCheck();
    this.collapse.host.childNodes.forEach((child: HTMLElement) => {
      if (child instanceof HTMLElement) {
        if (el === child) {
          this._renderer.addClass(child.querySelector('.sidenav-link'), 'active');
        } else {
          this._renderer.removeClass(child.querySelector('.sidenav-link'), 'active');
        }
      }
    });
  }

  public setActiveCategory(): void {
    this.markForCheck();
    this._renderer.addClass(
      this._sidenavLink.nativeElement.querySelector('.sidenav-link'),
      'active'
    );
  }

  public unsetActiveCategory(): void {
    this.markForCheck();
    this._renderer.removeClass(
      this._sidenavLink.nativeElement.querySelector('.sidenav-link'),
      'active'
    );
  }

  private _toggleArrowIcon(direction): void {
    const arrowIcon = this._sidenavLink.nativeElement.querySelector('.fa-angle-down');

    if (direction === 'down') {
      this._renderer.setStyle(arrowIcon, 'transform', 'rotate(0deg)');
    } else {
      this._renderer.setStyle(arrowIcon, 'transform', 'rotate(180deg)');
    }
  }
}
