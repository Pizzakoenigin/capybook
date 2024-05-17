import { Component } from '@angular/core';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'mdb-onboarding-backdrop',
  template: `<canvas class="onboarding-backdrop"></canvas>`,
  styles: ['canvas { z-index: 1075 }'],
})
export class MdbOnboardingBackdropComponent {}
