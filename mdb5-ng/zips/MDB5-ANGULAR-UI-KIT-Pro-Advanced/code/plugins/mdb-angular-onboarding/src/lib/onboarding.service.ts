import {
  ConnectedPosition,
  Overlay,
  OverlayConfig,
  OverlayPositionBuilder,
  OverlayRef,
} from '@angular/cdk/overlay';
import { ComponentPortal, DomPortalOutlet, Portal } from '@angular/cdk/portal';
import { DOCUMENT } from '@angular/common';
import {
  ApplicationRef,
  ComponentFactoryResolver,
  ComponentRef,
  ElementRef,
  EventEmitter,
  Inject,
  Injectable,
  Injector,
  Output,
} from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
import { MdbOnboardingComponent } from './onboarding.component';
import { MdbOnboardingBackdropComponent } from './onboarding-backdrop.component';
import { MdbOnboardingDirective } from './onboarding.directive';
import { filter, takeUntil } from 'rxjs/operators';

export interface MdbOnboardingConfig {
  backdrop?: boolean;
  backdropOpacity?: number;
  nextLabel?: string;
  prevLabel?: string;
  skipLabel?: string;
  finishLabel?: string;
  pauseLabel?: string;
  resumeLabel?: string;
  btnNextClass?: string;
  btnPrevClass?: string;
  btnSkipClass?: string;
  btnFinishClass?: string;
  btnPauseClass?: string;
  btnResumeClass?: string;
  customClass?: string | string[];
  autoplay?: boolean;
  stepDuration?: number;
  autoscroll?: boolean;
  placement?: 'top' | 'right' | 'bottom' | 'left';
  container?: ElementRef<any> | null;
  delay?: number;
  index?: number;
}

export interface MdbOnboardingStep {
  id: string;
  content: string;
  backdrop?: boolean;
  backdropOpacity?: number;
  nextLabel?: string;
  prevLabel?: string;
  skipLabel?: string;
  finishLabel?: string;
  pauseLabel?: string;
  resumeLabel?: string;
  btnNextClass?: string;
  btnPrevClass?: string;
  btnSkipClass?: string;
  btnFinishClass?: string;
  btnPauseClass?: string;
  btnResumeClass?: string;
  customClass?: string | string[];
  autoplay?: boolean;
  stepDuration?: number;
  autoscroll?: boolean;
  placement?: 'top' | 'right' | 'bottom' | 'left';
  container?: ElementRef<any> | null;
  delay?: number;
  index?: number;
}

@Injectable({
  providedIn: 'root',
})
export class MdbOnboardingService {
  private _overlayRef: OverlayRef | null = null;
  private _onboardingRef: ComponentRef<MdbOnboardingComponent> | null = null;
  private _activeStepIndex = 0;
  private _anchors: MdbOnboardingDirective[] = [];
  private _steps: MdbOnboardingStep[] = [];
  private _opened = false;
  private _portalHost: DomPortalOutlet | null = null;
  private _portalHostRef: ComponentRef<MdbOnboardingBackdropComponent> | null = null;
  private _ctx: any | null = null;
  private _backdrop: HTMLCanvasElement | null = null;
  private readonly _defaultGlobalConfig: MdbOnboardingConfig = {
    backdrop: false,
    backdropOpacity: 0.4,
    nextLabel: 'Next',
    prevLabel: 'Back',
    skipLabel: 'Skip',
    finishLabel: 'Finish',
    pauseLabel: 'Pause',
    resumeLabel: 'Resume',
    btnNextClass: 'btn-primary mx-0 next',
    btnPrevClass: 'btn-primary mx-0 prev',
    btnSkipClass: 'btn-danger mx-0 skip',
    btnFinishClass: 'btn-danger mx-0 finish',
    btnPauseClass: 'btn-primary mx-0 pause',
    btnResumeClass: 'btn-success mx-0 resume',
    customClass: '',
    autoplay: false,
    stepDuration: 4,
    autoscroll: true,
    container: null,
    index: 1,
  };
  private _globalConfig: MdbOnboardingConfig = this._defaultGlobalConfig;
  private _autoplayTimeout;
  private _remainingTimeout: number | null = null;
  private _startTime: number | null = null;
  private _delay: ReturnType<typeof setTimeout> | undefined = undefined;

  @Output() readonly onboardingStart: EventEmitter<void> = new EventEmitter<void>();
  @Output() readonly onboardingEnd: EventEmitter<void> = new EventEmitter<void>();
  @Output() readonly onboardingOpen: EventEmitter<void> = new EventEmitter<void>();
  @Output() readonly onboardingClose: EventEmitter<void> = new EventEmitter<void>();
  @Output() readonly onboardingNext: EventEmitter<void> = new EventEmitter<void>();
  @Output() readonly onboardingPrev: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private _overlay: Overlay,
    private _overlayPositionBuilder: OverlayPositionBuilder,
    private componentFactoryResolver: ComponentFactoryResolver,
    private injector: Injector,
    private appRef: ApplicationRef,
    @Inject(DOCUMENT) private _document: any
  ) {}

  init(steps: MdbOnboardingStep[], config?: MdbOnboardingConfig) {
    if (!steps || steps.length < 1 || this._opened || this._delay) {
      return;
    }

    const stepGlobalConfig = { ...this._globalConfig, ...config };
    this._steps = steps.map((step) => Object.assign({}, stepGlobalConfig, step));

    const shouldSort = this._steps.some((step) => step.index);
    if (shouldSort) {
      this._steps.sort((stepA, stepB) => stepA.index - stepB.index);
    }
  }

  pause() {
    this._onboardingRef.instance.autoplayPlaying = false;
    this._remainingTimeout =
      this._steps[this._activeStepIndex].stepDuration * 1000 - (Date.now() - this._startTime);

    clearTimeout(this._autoplayTimeout);
    this._autoplayTimeout = null;
  }

  play() {
    this._onboardingRef.instance.autoplayPlaying = true;

    const duration = this._remainingTimeout
      ? this._remainingTimeout
      : this._steps[this._activeStepIndex].stepDuration * 1000;

    this._autoplayTimeout = setTimeout(() => {
      this.nextStep();
    }, duration);
  }

  addAnchor(anchor: MdbOnboardingDirective) {
    this._anchors.push(anchor);
  }

  removeAnchor(anchor: MdbOnboardingDirective) {
    const index = this._anchors.indexOf(anchor);

    if (index > -1) {
      this._anchors.splice(index, 1);
    }
  }

  private _scrollToAnchor(anchor: MdbOnboardingDirective) {
    anchor.host.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  private _updatePosition(step: MdbOnboardingStep) {
    this._overlayRef.updatePositionStrategy(
      this._overlayPositionBuilder
        .flexibleConnectedTo(this._getAnchorByStep(step).host)
        .withPositions(this._getPosition(step))
        .withPush(false)
    );

    this._overlayRef.updatePosition();
  }

  private _syncComponentState(step: MdbOnboardingStep) {
    this._onboardingRef.instance.content = step.content;
    this._onboardingRef.instance.actualIndex = this._steps.indexOf(step);
    this._onboardingRef.instance.stepsLength = this._steps.length;
    this._onboardingRef.instance.nextLabel = step.nextLabel;
    this._onboardingRef.instance.prevLabel = step.prevLabel;
    this._onboardingRef.instance.skipLabel = step.skipLabel;
    this._onboardingRef.instance.finishLabel = step.finishLabel;
    this._onboardingRef.instance.pauseLabel = step.pauseLabel;
    this._onboardingRef.instance.resumeLabel = step.resumeLabel;
    this._onboardingRef.instance.btnNextClass = step.btnNextClass;
    this._onboardingRef.instance.btnPrevClass = step.btnPrevClass;
    this._onboardingRef.instance.btnSkipClass = step.btnSkipClass;
    this._onboardingRef.instance.btnFinishClass = step.btnFinishClass;
    this._onboardingRef.instance.btnPauseClass = step.btnPauseClass;
    this._onboardingRef.instance.btnResumeClass = step.btnResumeClass;
    this._onboardingRef.instance.customClass = step.customClass;
    this._onboardingRef.instance.autoplay = step.autoplay;
    this._onboardingRef.instance.stepDuration = step.stepDuration;
  }

  goToLastStep() {
    this._activeStepIndex = this._steps.length - 1;
    this._open(this._steps[this._steps.length - 1]);
  }

  goToFirstStep() {
    this._activeStepIndex = 0;
    this._open(this._steps[0]);
  }

  nextStep() {
    if (this._activeStepIndex < this._steps.length - 1 && this._opened) {
      this._activeStepIndex++;
      const nextStep = this._steps[this._activeStepIndex];
      this._open(nextStep);
      this.onboardingNext.emit();
    }
  }

  prevStep() {
    if (this._activeStepIndex > 0 && this._opened) {
      this._activeStepIndex--;
      const nextStep = this._steps[this._activeStepIndex];
      this._open(nextStep);
      this.onboardingPrev.emit();
    }
  }

  private _startWithDelay(delay: number) {
    this._delay = setTimeout(() => {
      const firstStep = this._steps[0];
      this._open(firstStep);
      this._delay = undefined;
    }, delay * 1000);
  }

  start() {
    if (this._opened || this._delay) {
      return;
    }

    const firstStep = this._steps[0];

    this.onboardingStart.emit();

    if (firstStep.delay) {
      this._startWithDelay(firstStep.delay);
      return;
    }

    this._open(firstStep);
  }

  finish() {
    this._close();
  }

  private _getAnchorByStep(step: MdbOnboardingStep): MdbOnboardingDirective {
    return this._anchors.find((anchor) => anchor.mdbOnboardingAnchor === step.id);
  }

  private _getCanvasBounding(step: MdbOnboardingStep) {
    let left = 0;
    let top = 0;
    let width = 0;
    let height = 0;

    if (step.container) {
      const rect = step.container.nativeElement.getBoundingClientRect();
      left = rect.left;
      top = rect.top + window.scrollY;
      width = step.container.nativeElement.clientWidth;
      height = rect.height;
    } else {
      const body = this._document.body;
      const html = this._document.documentElement;

      const maxHeight = Math.max(
        body.scrollHeight,
        body.offsetHeight,
        html.clientHeight,
        html.scrollHeight,
        html.offsetHeight
      );
      left = 0;
      top = 0;
      width = body.clientWidth;
      height = maxHeight;
    }

    return { left, top, width, height };
  }

  private _adjustCanvas() {
    const step: MdbOnboardingStep = this._steps[this._activeStepIndex];

    const { left, top, width, height } = this._getCanvasBounding(step);

    this._backdrop.style.top = `${top}px`;
    this._backdrop.style.left = `${left}px`;
    this._backdrop.style.width = `${width}px`;
    this._backdrop.style.height = `${height}px`;
    this._backdrop.style.position = 'absolute';
    this._backdrop.width = width;
    this._backdrop.height = height;

    this._ctx.fillStyle = `rgba(0,0,0, ${step.backdropOpacity})`;
    this._ctx.fillRect(0, 0, this._backdrop.width, this._backdrop.height);

    const stepAnchorEl = this._getAnchorByStep(step).element;
    const stepAnchorRect = stepAnchorEl.getBoundingClientRect();

    if (step.container) {
      this._ctx.clearRect(
        stepAnchorRect.left - 5 - left,
        stepAnchorEl.offsetTop -
          step.container.nativeElement.offsetTop -
          5 -
          step.container.nativeElement.scrollTop,
        stepAnchorRect.width + 10,
        stepAnchorRect.height + 10
      );
    } else {
      this._ctx.clearRect(
        stepAnchorRect.left - 5,
        stepAnchorRect.top - 5 + window.scrollY,
        stepAnchorRect.width + 10,
        stepAnchorRect.height + 10
      );
    }
  }

  private _createBackdrop() {
    const step: MdbOnboardingStep = this._steps[this._activeStepIndex];
    const backdropPortal = new ComponentPortal(MdbOnboardingBackdropComponent);
    const outletElement = step.container ? step.container.nativeElement : this._document.body;

    this._portalHost = new DomPortalOutlet(
      outletElement,
      this.componentFactoryResolver,
      this.appRef,
      this.injector
    );

    this._portalHostRef = this._portalHost.attach(backdropPortal);
    this._backdrop = this._portalHostRef.location.nativeElement.children[0];

    this._ctx = this._backdrop.getContext('2d');
  }

  private _open(step: MdbOnboardingStep): void {
    const activeAnchor = this._getAnchorByStep(step);

    if (!this._overlayRef) {
      this._createOverlay(step);
    }

    if (!this._opened && !this._overlayRef.hasAttached()) {
      const onboardingPortal = new ComponentPortal(MdbOnboardingComponent);

      this._onboardingRef = this._overlayRef.attach(onboardingPortal);

      this._onboardingRef.instance.close
        .pipe(takeUntil(this._overlayRef.detachments()))
        .subscribe(() => {
          this._close();
        });

      this._onboardingRef.instance.firstStep
        .pipe(takeUntil(this._overlayRef.detachments()))
        .subscribe(() => {
          this._open(this._steps[0]);
        });

      this._onboardingRef.instance.lastStep
        .pipe(takeUntil(this._overlayRef.detachments()))
        .subscribe(() => {
          this._open(this._steps[this._steps.length - 1]);
        });

      this._onboardingRef.instance.next
        .pipe(takeUntil(this._overlayRef.detachments()))
        .subscribe(() => {
          this.nextStep();
        });

      this._onboardingRef.instance.prev
        .pipe(takeUntil(this._overlayRef.detachments()))
        .subscribe(() => {
          this.prevStep();
        });

      this._onboardingRef.instance.pause
        .pipe(takeUntil(this._overlayRef.detachments()))
        .subscribe(() => {
          this.pause();
        });

      this._onboardingRef.instance.resume
        .pipe(takeUntil(this._overlayRef.detachments()))
        .subscribe(() => {
          this.play();
        });

      setTimeout(() => {
        this._listenToOutSideClick(this._overlayRef, activeAnchor.host.nativeElement).subscribe(
          () => {
            this.finish();
          }
        );
      }, 0);
    }
    this._syncComponentState(step);

    if (step.backdrop) {
      if (!this._backdrop) {
        this._createBackdrop();
      }

      if (!this._opened) {
        fromEvent(window, 'resize')
          .pipe(takeUntil(this._overlayRef.detachments()))
          .subscribe(() => {
            this._adjustCanvas();
          });
      }

      if (step.container && !this._opened) {
        fromEvent(step.container.nativeElement, 'scroll')
          .pipe(takeUntil(this._overlayRef.detachments()))
          .subscribe(() => {
            this._document.dispatchEvent(new Event('scroll'));
            this._adjustCanvas();
          });
      }

      this._adjustCanvas();
    }

    setTimeout(() => {
      if (step.autoscroll) {
        this._scrollToAnchor(activeAnchor);
      }
    }, 0);

    clearTimeout(this._autoplayTimeout);

    if (step.autoplay) {
      this._onboardingRef.instance.autoplayPlaying = true;
      this._startTime = Date.now();

      this._autoplayTimeout = setTimeout(() => {
        if (this._activeStepIndex === this._steps.length - 1) {
          this._close();
        } else {
          this.nextStep();
        }
      }, step.stepDuration * 1000);
    }

    this._updatePosition(step);
    this._opened = true;
    this._onboardingRef.instance.startAnimation();
    this.onboardingOpen.emit();
  }

  private _createOverlay(step: MdbOnboardingStep): void {
    this._overlayRef = this._overlay.create(this._createOverlayConfig(step));
  }

  private _listenToOutSideClick(
    overlayRef: OverlayRef,
    origin: HTMLElement
  ): Observable<MouseEvent> {
    return fromEvent(document, 'click').pipe(
      filter((event: MouseEvent) => {
        const target = event.target as HTMLElement;
        const notOrigin = target !== origin;
        const notOverlay = !!overlayRef && overlayRef.overlayElement.contains(target) === false;
        return notOrigin && notOverlay;
      }),
      takeUntil(overlayRef.detachments())
    );
  }

  private _getPosition(step: MdbOnboardingStep): ConnectedPosition[] {
    let position;

    const positionTop = {
      originX: 'start',
      originY: 'top',
      overlayX: 'start',
      overlayY: 'bottom',
      offsetY: 0,
    };

    const positionBottom = {
      originX: 'start',
      originY: 'bottom',
      overlayX: 'start',
      overlayY: 'top',
      offsetY: 0,
    };

    const positionRight = {
      originX: 'end',
      originY: 'center',
      overlayX: 'start',
      overlayY: 'center',
      offsetX: 0,
    };

    const positionLeft = {
      originX: 'start',
      originY: 'center',
      overlayX: 'end',
      overlayY: 'center',
      offsetX: 0,
    };

    switch (step.placement) {
      case 'top':
        position = [positionTop, positionBottom];
        break;
      case 'bottom':
        position = [positionBottom, positionTop];
        break;
      case 'left':
        position = [positionLeft, positionRight];
        break;
      case 'right':
        position = [positionRight, positionLeft];
        break;
      default:
        position = [positionBottom, positionTop];
        break;
    }

    return position;
  }

  private _createOverlayConfig(step: MdbOnboardingStep): OverlayConfig {
    const anchor = this._getAnchorByStep(step);
    const host = anchor.host;
    const positionStrategy = this._overlayPositionBuilder
      .flexibleConnectedTo(host)
      .withPositions(this._getPosition(step));
    const overlayConfig = new OverlayConfig({
      width: host.nativeElement.offsetWidth,
      hasBackdrop: false,
      scrollStrategy: this._overlay.scrollStrategies.reposition(),
      positionStrategy,
    });

    return overlayConfig;
  }

  private _close(): void {
    const actualStep = this._steps[this._activeStepIndex];
    if (actualStep.autoplay) {
      this._onboardingRef.instance.autoplayPlaying = false;
      clearTimeout(this._autoplayTimeout);
    }

    if (this._overlayRef) {
      if (this._overlayRef.hasAttached()) {
        this._overlayRef.detach();
        this._overlayRef = null;
      }
    }

    if (this._opened) {
      this._opened = false;
    }

    if (actualStep.backdrop) {
      this._portalHost.detach();
      this._backdrop = null;
      this._ctx = null;
    }

    this._globalConfig = this._defaultGlobalConfig;
    this._activeStepIndex = 0;
    this._steps = [];
    this.onboardingEnd.emit();
    this.onboardingClose.emit();
  }
}
