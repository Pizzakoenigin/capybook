import { Component, ElementRef, EventEmitter, Input, Output, AfterViewInit } from '@angular/core';

declare let grecaptcha: any;

@Component({
  selector: 'mdb-captcha',
  template: '',
})
export class MdbCaptchaComponent implements AfterViewInit {
  @Input() sitekey = '';
  @Input() theme: 'light' | 'dark' = 'light';
  @Input() size: 'normal' | 'compact' = 'normal';
  @Input() tabindex = 0;
  @Input() lang = 'en';

  @Output() expire: EventEmitter<void> = new EventEmitter<void>();
  @Output() error: EventEmitter<void> = new EventEmitter<void>();
  @Output() success: EventEmitter<string> = new EventEmitter<string>();

  // Holds the instance of the rendered reCAPTCHA widget
  private _instance: any;

  constructor(private _elementRef: ElementRef) {}

  ngAfterViewInit(): void {
    this._initRecaptcha();
  }

  public reset(): void {
    if (this._instance === null) {
      return;
    }
    grecaptcha.reset(this._instance);
  }

  public getResponse(): string | null {
    if (this._instance === null) {
      return null;
    }
    return grecaptcha.getResponse(this._instance);
  }

  private _initRecaptcha(): void {
    if ((window as any).grecaptcha) {
      if (!(window as any).grecaptcha.render) {
        setTimeout(() => {
          this._renderRecaptcha();
        }, 100);
      } else {
        this._renderRecaptcha();
      }
    } else {
      // If the `grecaptcha` object has not yet been loaded, set a callback function that will be
      // called when the object is loaded, and render the reCAPTCHA widget in the callback function.
      // This is a callback provided by the reCAPTCHA library that is called when the library is fully loaded.
      (window as any).onloadCallback = () => {
        this._renderRecaptcha();
      };
    }
  }

  private _renderRecaptcha(): void {
    this._instance = grecaptcha.render(this._elementRef.nativeElement, {
      sitekey: this.sitekey,
      theme: this.theme,
      size: this.size,
      tabindex: this.tabindex,
      hl: this.lang,
      callback: (response: string) => {
        this.success.emit(response);
      },
      'expired-callback': () => {
        this.expire.emit();
      },
      'error-callback': () => {
        this.error.emit();
      },
    });
  }
}
