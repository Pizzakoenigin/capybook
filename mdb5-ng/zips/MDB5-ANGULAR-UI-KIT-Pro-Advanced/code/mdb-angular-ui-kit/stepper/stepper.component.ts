import {
  Component,
  ContentChildren,
  QueryList,
  AfterContentInit,
  Input,
  ElementRef,
  ViewChild,
  ViewChildren,
  Output,
  EventEmitter,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  HostBinding,
} from '@angular/core';
import { MdbStepComponent } from './step.component';
import { UntypedFormControl } from '@angular/forms';
import { merge, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { horizontalAnimation, verticalAnimation } from './stepper-animations';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';

export type MdbStepperOrientation = 'horizontal' | 'vertical';

export interface MdbStepChangeEvent {
  activeStep: MdbStepComponent;
  activeStepIndex: number;
  previousStep: MdbStepComponent;
  previousStepIndex: number;
}

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'mdb-stepper',
  exportAs: 'mdbStepper',
  templateUrl: 'stepper.component.html',
  animations: [horizontalAnimation, verticalAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdbStepperComponent implements AfterContentInit, OnDestroy {
  @ContentChildren(MdbStepComponent) steps: QueryList<MdbStepComponent>;
  @ViewChildren('stepTitle') stepTitles: QueryList<ElementRef>;
  @ViewChildren('stepContent') stepContents: QueryList<ElementRef>;
  @ViewChild('container', { static: true }) container: ElementRef;

  @Input() orientation: MdbStepperOrientation = 'horizontal';
  @Input()
  get linear(): boolean {
    return this._linear;
  }
  set linear(value: boolean) {
    this._linear = coerceBooleanProperty(value);
  }
  private _linear = false;

  @Input()
  get stepperHeadClick(): boolean {
    return this._stepperHeadClick;
  }
  set stepperHeadClick(value: boolean) {
    this._stepperHeadClick = coerceBooleanProperty(value);
  }
  private _stepperHeadClick = true;

  @Input()
  get mobile(): boolean {
    return this._mobile;
  }
  set mobile(value: boolean) {
    this._mobile = coerceBooleanProperty(value);
  }
  private _mobile = false;

  @Input() mobileBarBreakpoint = 4;

  @Input()
  get stepperMobileStepTxt(): string {
    return this._stepperMobileStepTxt;
  }
  set stepperMobileStepTxt(value: string) {
    this._stepperMobileStepTxt = value;
  }
  private _stepperMobileStepTxt = 'Step';

  @Input()
  get stepperMobileBackBtn(): string {
    return this._stepperMobileBackBtn;
  }
  set stepperMobileBackBtn(value: string) {
    this._stepperMobileBackBtn = value;
  }
  private _stepperMobileBackBtn = 'Back';

  @Input()
  get stepperMobileNextBtn(): string {
    return this._stepperMobileNextBtn;
  }
  set stepperMobileNextBtn(value: string) {
    this._stepperMobileNextBtn = value;
  }
  private _stepperMobileNextBtn = 'Next';

  @Input()
  get stepperMobileOfTxt(): string {
    return this._stepperMobileOfTxt;
  }
  set stepperMobileOfTxt(value: string) {
    this._stepperMobileOfTxt = value;
  }
  private _stepperMobileOfTxt = 'of';

  @Input()
  get markAsCompleted(): boolean {
    return this._markAsCompleted;
  }
  set markAsCompleted(value: boolean) {
    this._markAsCompleted = coerceBooleanProperty(value);
  }
  private _markAsCompleted = true;

  @Output() stepChange: EventEmitter<MdbStepChangeEvent> = new EventEmitter<MdbStepChangeEvent>();
  @Output() stepValid: EventEmitter<void> = new EventEmitter<void>();
  @Output() stepInvalid: EventEmitter<void> = new EventEmitter<void>();

  @HostBinding('class.d-block') display = true;
  @HostBinding('class.w-100') width = true;
  @HostBinding('class.position-relative') position = true;

  constructor(private _cdRef: ChangeDetectorRef) {}

  private _destroy: Subject<void> = new Subject();

  private _activeStepIndex: number;
  private _activeStep: MdbStepComponent;

  get allStepsNumber(): number {
    return this.steps.length;
  }

  getProgressBarWidth(): number {
    return ((this.activeStepIndex + 1) / this.steps.length) * 100;
  }

  get activeStepIndex(): number {
    return this._activeStepIndex;
  }

  set activeStepIndex(value: number) {
    this._activeStepIndex = value;
  }

  private _isStepValid(step: MdbStepComponent): boolean {
    if (!step.stepForm) {
      return true;
    }

    if (step.stepForm && step.stepForm.valid) {
      return true;
    }

    return false;
  }

  getAnimationState(index: number): string {
    const nextElPosition = index - this.activeStepIndex;

    if (nextElPosition < 0) {
      return 'previous';
    } else if (nextElPosition > 0) {
      return 'next';
    }
    return 'current';
  }

  private _getStepByIndex(index: number): MdbStepComponent {
    return this.steps.toArray()[index];
  }

  next(): void {
    if (this.activeStepIndex < this.steps.length - 1) {
      this.setNewActiveStep(this.activeStepIndex + 1);
      this._cdRef.markForCheck();
    }
  }

  previous(): void {
    if (this.activeStepIndex > 0) {
      this.setNewActiveStep(this.activeStepIndex - 1);
      this._cdRef.markForCheck();
    }
  }

  submit(): void {
    if (this.linear) {
      this._markCurrentAsDone();
      this._cdRef.markForCheck();
    }
  }

  handleHeaderClick(index: number) {
    if (!this.stepperHeadClick) {
      return;
    }

    this.setNewActiveStep(index);
  }

  setNewActiveStep(index: number): void {
    setTimeout(() => {
      const currentStep = this._activeStep;
      const currentStepIndex = this._activeStepIndex;
      const newStep = this._getStepByIndex(index);
      const newStepIndex = this.steps
        .toArray()
        .findIndex((step: MdbStepComponent) => step === newStep);

      if (this.linear && !this._isNewStepLinear(index)) {
        return;
      }

      if (newStepIndex < this._activeStepIndex && !newStep.editable) {
        return;
      }

      if (this.linear && index > this.activeStepIndex) {
        if (this._isStepValid(this._activeStep) || currentStep.optional) {
          this.stepValid.emit();
          this._markCurrentAsDone();
          this._removeCurrentActiveStep();
          this._setActiveStep(index);
          this.stepChange.emit({
            activeStep: newStep,
            activeStepIndex: newStepIndex,
            previousStep: currentStep,
            previousStepIndex: currentStepIndex,
          });
        } else {
          this.stepInvalid.emit();
          this._markCurrentAsWrong();
          this._markStepControlsAsDirty(this._activeStep);
        }
      } else {
        if (index < this.activeStepIndex && !this._isStepValid(this._activeStep)) {
          this._removeStepValidationClasses(this._activeStep);
        }

        if (!this.linear) {
          this._markCurrentAsDone();
        }

        this._removeCurrentActiveStep();
        this._setActiveStep(index);

        this.stepChange.emit({
          activeStep: newStep,
          activeStepIndex: newStepIndex,
          previousStep: currentStep,
          previousStepIndex: currentStepIndex,
        });
      }
    }, 0);
  }

  private _markCurrentAsDone(): void {
    this._activeStep.isCompleted = true;
    this._activeStep.isInvalid = false;
  }

  private _markCurrentAsWrong(): void {
    this._activeStep.isInvalid = true;
    this._activeStep.isCompleted = false;
  }

  private _markStepControlsAsDirty(step: MdbStepComponent): void {
    const controls = step.stepForm.controls;
    if (step.stepForm.controls) {
      const keys = Object.keys(controls);
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < keys.length; i++) {
        const control = controls[keys[i]];

        if (control instanceof UntypedFormControl) {
          control.markAsTouched();
        }
      }
    }
  }

  private _removeStepValidationClasses(step: MdbStepComponent): void {
    step.isCompleted = false;
    step.isInvalid = false;
  }

  private _isNewStepLinear(newStepIndex: number): boolean {
    let result: boolean;

    if (this.activeStepIndex - newStepIndex === 1 || this.activeStepIndex - newStepIndex === -1) {
      result = true;
    }

    if (this.activeStepIndex < newStepIndex) {
      this.steps.forEach((el, i) => {
        if (i > this.activeStepIndex && i < newStepIndex) {
          result = this._isStepValid(el) || this._getStepByIndex(i).optional;
        }
      });
    }

    if (this.activeStepIndex > newStepIndex) {
      this.steps.forEach((el, i) => {
        if (i < this.activeStepIndex && i > newStepIndex) {
          result = this._isStepValid(el) || this._getStepByIndex(i).optional;
        }
      });
    }
    return result;
  }

  private _setActiveStep(index: number): void {
    this.steps.toArray()[index].isActive = true;
    this.activeStepIndex = index;
    this._activeStep = this._getStepByIndex(this.activeStepIndex);
    this._cdRef.markForCheck();
  }

  private _removeCurrentActiveStep(): void {
    const currentActiveStep = this.steps.find((activeStep) => activeStep.isActive);
    if (currentActiveStep) {
      currentActiveStep.isActive = false;
    }
  }

  resetAll(): void {
    this.steps.forEach((step: MdbStepComponent) => {
      step.reset();
      this._setActiveStep(0);
      this._cdRef.markForCheck();
    });
  }

  ngAfterContentInit(): void {
    this._setActiveStep(0);

    // tslint:disable-next-line: deprecation
    this.steps.changes.pipe(takeUntil(this._destroy)).subscribe(() => this._cdRef.markForCheck());

    merge(...this.steps.map((step: MdbStepComponent) => step._onChanges))
      .pipe(takeUntil(this._destroy))
      // tslint:disable-next-line: deprecation
      .subscribe((_) => this._cdRef.markForCheck());
  }

  ngOnDestroy(): void {
    this._destroy.next();
    this._destroy.complete();
  }

  static ngAcceptInputType_linear: BooleanInput;
  static ngAcceptInputType_mobile: BooleanInput;
  static ngAcceptInputType_markAsCompleted: BooleanInput;
}
