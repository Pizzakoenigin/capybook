import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, ViewChild } from '@angular/core';
import { MdbCaptchaComponent } from './captcha.component';

// Mock Google reCAPTCHA object
const grecaptchaMock = {
  render: jest.fn(),
  reset: jest.fn(),
  getResponse: jest.fn(),
};

@Component({
  template: `
    <mdb-captcha
      [sitekey]="sitekey"
      [theme]="theme"
      [size]="size"
      [tabindex]="tabindex"
      [lang]="lang"
      (onSuccess)="onSuccess($event)"
      (onExpire)="onExpire()"
      (onError)="onError()"
    ></mdb-captcha>
  `,
})
class TestHostComponent {
  @ViewChild(MdbCaptchaComponent) mdbCaptchaComponent: MdbCaptchaComponent;

  sitekey = 'test-sitekey';
  theme: 'light' | 'dark' = 'dark';
  size: 'normal' | 'compact' = 'compact';
  tabindex = 1;
  lang = 'es';

  onSuccessResponse: string;
  onExpireCalled = false;
  onErrorCalled = false;

  onSuccess(response: string): void {
    this.onSuccessResponse = response;
  }

  onExpire(): void {
    this.onExpireCalled = true;
  }

  onError(): void {
    this.onErrorCalled = true;
  }
}

describe('MdbCaptchaComponent', () => {
  let testHostComponent: TestHostComponent;
  let testHostFixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MdbCaptchaComponent, TestHostComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    (window as any).grecaptcha = grecaptchaMock;

    testHostFixture = TestBed.createComponent(TestHostComponent);
    testHostComponent = testHostFixture.componentInstance;
    testHostFixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(testHostComponent.mdbCaptchaComponent).toBeTruthy();
  });

  it('should emit onSuccess event with response', () => {
    const response = 'test-response';
    const callback = grecaptchaMock.render.mock.calls[0][1].callback;
    callback(response);

    expect(testHostComponent.onSuccessResponse).toBe(response);
  });

  it('should emit onExpire event', () => {
    const expiredCallback = grecaptchaMock.render.mock.calls[0][1]['expired-callback'];
    expiredCallback();

    expect(testHostComponent.onExpireCalled).toBe(true);
  });

  it('should emit onError event', () => {
    const errorCallback = grecaptchaMock.render.mock.calls[0][1]['error-callback'];
    errorCallback();

    expect(testHostComponent.onErrorCalled).toBe(true);
  });
});
