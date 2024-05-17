import { Component, EventEmitter, HostListener, Output } from '@angular/core';
import { fadeInAnimation } from './onboarding.animations';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'mdb-onboarding',
  templateUrl: `onboarding.component.html`,
  styles: [],
  animations: [fadeInAnimation()],
})
export class MdbOnboardingComponent {
  constructor() {}

  actualIndex = 0;
  stepsLength = 0;
  content = '';
  nextLabel = 'Next';
  prevLabel = 'Back';
  skipLabel = 'Skip';
  finishLabel = 'Finish';
  pauseLabel = 'Pause';
  resumeLabel = 'Resume';
  btnNextClass = 'btn-primary';
  btnPrevClass = 'btn-primary';
  btnSkipClass = 'btn-danger';
  btnFinishClass = 'btn-danger';
  btnPauseClass = 'btn-primary';
  btnResumeClass = 'btn-success';
  customClass: string | string[] = '';
  autoplay = false;
  stepDuration = 0;
  animationState = false;

  protected autoplayPlayingStateLabel = this.pauseLabel;

  get autoplayPlaying(): boolean {
    return this._autoplayPlaying;
  }
  set autoplayPlaying(value: boolean) {
    this._autoplayPlaying = value;
    value === true
      ? (this.autoplayPlayingStateLabel = this.pauseLabel)
      : (this.autoplayPlayingStateLabel = this.resumeLabel);
  }
  private _autoplayPlaying = false;

  @Output() readonly firstStep: EventEmitter<void> = new EventEmitter();
  @Output() readonly lastStep: EventEmitter<void> = new EventEmitter();
  @Output() readonly open: EventEmitter<void> = new EventEmitter();
  @Output() readonly close: EventEmitter<void> = new EventEmitter();
  @Output() readonly next: EventEmitter<void> = new EventEmitter();
  @Output() readonly prev: EventEmitter<void> = new EventEmitter();
  @Output() readonly pause: EventEmitter<void> = new EventEmitter();
  @Output() readonly resume: EventEmitter<void> = new EventEmitter();

  @HostListener('window:keydown', ['$event'])
  handleKeydown(event: KeyboardEvent) {
    const { key } = event;
    const isKeyEscape = key === 'Escape';

    if (isKeyEscape) {
      this.stopOnboarding();
    }

    switch (key) {
      case 'Esc':
        this.stopOnboarding();
        break;
      case 'ArrowLeft':
        this.prevStep();
        break;
      case 'ArrowRight':
        this.nextStep();
        break;
      case 'End':
        this.goToLastStep();
        break;
      case 'Home':
        this.goToFirstStep();
        break;
    }
  }

  startAnimation(): void {
    this.animationState = true;
  }

  onAnimationDone(): void {
    this.animationState = false;
  }

  nextStep() {
    this.next.emit();
  }

  prevStep() {
    this.prev.emit();
  }

  goToFirstStep() {
    this.firstStep.emit();
  }

  goToLastStep() {
    this.lastStep.emit();
  }

  toggleAutoplay() {
    if (this.autoplayPlaying) {
      this.pause.emit();
      return;
    }

    this.resume.emit();
  }

  stopOnboarding() {
    this.close.emit();
  }
}
