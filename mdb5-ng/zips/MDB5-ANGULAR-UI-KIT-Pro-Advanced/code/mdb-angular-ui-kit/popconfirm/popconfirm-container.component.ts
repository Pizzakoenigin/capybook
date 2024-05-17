import { CdkPortalOutlet, ComponentPortal, TemplatePortal } from '@angular/cdk/portal';
import {
  ChangeDetectionStrategy,
  Component,
  ComponentRef,
  ElementRef,
  EmbeddedViewRef,
  ViewChild,
} from '@angular/core';
import { Subject } from 'rxjs';
import { MdbPopconfirmConfig } from './popconfirm.config';
import { animate, state, style, transition, trigger, AnimationEvent } from '@angular/animations';

@Component({
  selector: 'mdb-popconfirm-container',
  templateUrl: 'popconfirm-container.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
  animations: [
    trigger('fade', [
      state('void, hidden', style({ opacity: 0 })),
      state('visible', style({ opacity: 1 })),
      state('hidden', style({ opacity: 0 })),
      transition('visible => hidden', animate('150ms linear')),
      transition('* => visible', animate('150ms linear')),
    ]),
  ],
})
export class MdbPopconfirmContainerComponent {
  @ViewChild(CdkPortalOutlet, { static: true }) _portalOutlet: CdkPortalOutlet;

  readonly _destroy$: Subject<void> = new Subject<void>();

  readonly _hidden: Subject<void> = new Subject();
  animationState = 'visible';

  _config: MdbPopconfirmConfig;

  constructor(public _elementRef: ElementRef) {}

  attachComponentPortal<T>(portal: ComponentPortal<T>): ComponentRef<T> {
    return this._portalOutlet.attachComponentPortal(portal);
  }

  attachTemplatePortal<C>(portal: TemplatePortal<C>): EmbeddedViewRef<C> {
    return this._portalOutlet.attachTemplatePortal(portal);
  }

  startCloseAnimation(): void {
    this.animationState = 'hidden';
  }

  onAnimationEnd(event: AnimationEvent): void {
    if (event.toState === 'hidden') {
      this._hidden.next();
    }
  }
}
