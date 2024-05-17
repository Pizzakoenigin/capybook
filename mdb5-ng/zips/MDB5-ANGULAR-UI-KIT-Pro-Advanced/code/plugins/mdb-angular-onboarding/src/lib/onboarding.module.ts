import { OverlayModule } from '@angular/cdk/overlay';
import { NgModule } from '@angular/core';
import { MdbOnboardingComponent } from './onboarding.component';
import { MdbOnboardingService } from './onboarding.service';
import { MdbOnboardingDirective } from './onboarding.directive';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [MdbOnboardingComponent, MdbOnboardingDirective],
  imports: [BrowserAnimationsModule, CommonModule, OverlayModule],
  exports: [MdbOnboardingComponent, MdbOnboardingDirective],
  providers: [MdbOnboardingService],
})
export class MdbOnboardingModule {}
