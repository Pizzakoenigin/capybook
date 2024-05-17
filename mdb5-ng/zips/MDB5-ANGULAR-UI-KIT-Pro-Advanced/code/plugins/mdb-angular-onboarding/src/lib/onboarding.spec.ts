import { Component, Provider, Type } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, inject, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MdbOnboardingDirective } from './onboarding.directive';
import { MdbOnboardingModule } from './onboarding.module';
import { OverlayContainer } from '@angular/cdk/overlay';
import { MdbOnboardingService } from './onboarding.service';

describe('MDB Onboarding', () => {
  let overlayContainer: OverlayContainer;
  let overlayContainerElement: HTMLElement;

  function createComponent<T>(component: Type<T>, providers: Provider[] = []): ComponentFixture<T> {
    TestBed.configureTestingModule({
      imports: [MdbOnboardingModule, NoopAnimationsModule],
      declarations: [TestOnboardingComponent],
      teardown: { destroyAfterEach: false },
    });

    TestBed.compileComponents();

    inject([OverlayContainer], (oc: OverlayContainer) => {
      overlayContainer = oc;
      overlayContainerElement = oc.getContainerElement();
    })();

    return TestBed.createComponent<T>(component);
  }

  afterEach(inject([OverlayContainer], (currentOverlayContainer: OverlayContainer) => {
    currentOverlayContainer.ngOnDestroy();
    overlayContainer.ngOnDestroy();
  }));

  describe('after init', () => {
    let fixture: ComponentFixture<TestOnboardingComponent>;
    let element: HTMLElement;
    let component: TestOnboardingComponent;
    let directive: MdbOnboardingDirective;
    let service: MdbOnboardingService;

    beforeEach(async () => {
      fixture = createComponent(TestOnboardingComponent);
      component = fixture.componentInstance;
      element = fixture.nativeElement;
      fixture.detectChanges();

      directive = fixture.debugElement
        .query(By.directive(MdbOnboardingDirective))
        .injector.get(MdbOnboardingDirective) as MdbOnboardingDirective;

      service = TestBed.inject(MdbOnboardingService);
    });

    it('should create the component', () => {
      expect(component).toBeTruthy();
    });
    describe('basic usage', () => {
      it('should open and close using public methods', fakeAsync(() => {
        service.init([
          { id: 'first-step', content: 'This button has just started your onboarding' },
          {
            id: 'second-step',
            content: 'This is just basic example of initial onboarding options and configurations',
          },
          { id: 'third-step', content: 'There is many more options in the examples below' },
        ]);
        service.start();

        fixture.detectChanges();
        flush();

        expect(overlayContainerElement.querySelector('.popover-header').textContent).toEqual(
          '1 / 3'
        );
        expect(overlayContainerElement.querySelector('.popover-text').textContent).toEqual(
          'This button has just started your onboarding'
        );

        service.finish();

        fixture.detectChanges();
        flush();

        expect(overlayContainerElement.textContent).toEqual('');
      }));

      it('should go to next and previous step using methods', fakeAsync(() => {
        service.init([
          { id: 'first-step', content: 'This button has just started your onboarding' },
          {
            id: 'second-step',
            content: 'This is just basic example of initial onboarding options and configurations',
          },
        ]);
        service.start();

        fixture.detectChanges();
        flush();

        expect(overlayContainerElement.querySelector('.popover-header').textContent).toEqual(
          '1 / 2'
        );
        expect(overlayContainerElement.querySelector('.popover-text').textContent).toEqual(
          'This button has just started your onboarding'
        );

        service.prevStep();

        fixture.detectChanges();
        flush();

        expect(overlayContainerElement.querySelector('.popover-header').textContent).toEqual(
          '1 / 2'
        );
        expect(overlayContainerElement.querySelector('.popover-text').textContent).toEqual(
          'This button has just started your onboarding'
        );

        service.nextStep();

        fixture.detectChanges();
        flush();

        expect(overlayContainerElement.querySelector('.popover-header').textContent).toEqual(
          '2 / 2'
        );
        expect(overlayContainerElement.querySelector('.popover-text').textContent).toEqual(
          'This is just basic example of initial onboarding options and configurations'
        );

        service.prevStep();

        fixture.detectChanges();
        flush();

        expect(overlayContainerElement.querySelector('.popover-header').textContent).toEqual(
          '1 / 2'
        );
        expect(overlayContainerElement.querySelector('.popover-text').textContent).toEqual(
          'This button has just started your onboarding'
        );

        service.finish();

        fixture.detectChanges();
        flush();

        expect(overlayContainerElement.textContent).toEqual('');
      }));
    });

    describe('keyboard navigation', () => {
      it('should navigate to last/first using End/Home and close on Esc', fakeAsync(() => {
        const homeKeydownEvent = createKeyboardEvent('keydown', 36, 'Home');
        const endKeydownEvent = createKeyboardEvent('keydown', 35, 'End');
        const escKeydownEvent = createKeyboardEvent('keydown', 27, 'Esc');

        service.init([
          { id: 'first-step', content: 'This button has just started your onboarding' },
          {
            id: 'second-step',
            content: 'This is just basic example of initial onboarding options and configurations',
          },
          { id: 'third-step', content: 'There is many more options in the examples below' },
        ]);
        service.start();

        fixture.detectChanges();
        flush();

        expect(overlayContainerElement.querySelector('.popover-header').textContent).toEqual(
          '1 / 3'
        );
        expect(overlayContainerElement.querySelector('.popover-text').textContent).toEqual(
          'This button has just started your onboarding'
        );

        window.dispatchEvent(endKeydownEvent);

        fixture.detectChanges();
        flush();

        expect(overlayContainerElement.querySelector('.popover-header').textContent).toEqual(
          '3 / 3'
        );
        expect(overlayContainerElement.querySelector('.popover-text').textContent).toEqual(
          'There is many more options in the examples below'
        );

        window.dispatchEvent(homeKeydownEvent);

        fixture.detectChanges();
        flush();

        expect(overlayContainerElement.querySelector('.popover-header').textContent).toEqual(
          '1 / 3'
        );
        expect(overlayContainerElement.querySelector('.popover-text').textContent).toEqual(
          'This button has just started your onboarding'
        );

        window.dispatchEvent(escKeydownEvent);

        fixture.detectChanges();
        flush();

        expect(overlayContainerElement.textContent).toEqual('');
      }));
      it('should go to next step upon arrows keydown', fakeAsync(() => {
        const arrowRightEvent = createKeyboardEvent('keydown', 39, 'ArrowRight');
        const arrowLeftEvent = createKeyboardEvent('keydown', 37, 'ArrowLeft');

        service.init([
          { id: 'first-step', content: 'This button has just started your onboarding' },
          {
            id: 'second-step',
            content: 'This is just basic example of initial onboarding options and configurations',
          },
          { id: 'third-step', content: 'There is many more options in the examples below' },
        ]);
        service.start();

        fixture.detectChanges();
        flush();

        expect(overlayContainerElement.querySelector('.popover-header').textContent).toEqual(
          '1 / 3'
        );
        expect(overlayContainerElement.querySelector('.popover-text').textContent).toEqual(
          'This button has just started your onboarding'
        );

        window.dispatchEvent(arrowRightEvent);

        fixture.detectChanges();
        flush();

        expect(overlayContainerElement.querySelector('.popover-header').textContent).toEqual(
          '2 / 3'
        );
        expect(overlayContainerElement.querySelector('.popover-text').textContent).toEqual(
          'This is just basic example of initial onboarding options and configurations'
        );
        window.dispatchEvent(arrowLeftEvent);

        fixture.detectChanges();
        flush();

        expect(overlayContainerElement.querySelector('.popover-header').textContent).toEqual(
          '1 / 3'
        );
        expect(overlayContainerElement.querySelector('.popover-text').textContent).toEqual(
          'This button has just started your onboarding'
        );
      }));
    });

    describe('autoplay', () => {
      it('should proceed to the next step after a globally given time', fakeAsync(() => {
        service.init(
          [
            { id: 'first-step', content: 'This button has just started your onboarding' },
            {
              id: 'second-step',
              content:
                'This is just basic example of initial onboarding options and configurations',
            },
            { id: 'third-step', content: 'There is many more options in the examples below' },
          ],
          { autoplay: true, stepDuration: 2 }
        );

        service.start();
        tick(2000);
        fixture.detectChanges();

        expect(overlayContainerElement.querySelector('.popover-header').textContent).toEqual(
          '2 / 3'
        );
        expect(overlayContainerElement.querySelector('.popover-text').textContent).toEqual(
          'This is just basic example of initial onboarding options and configurations'
        );

        tick(2000);
        fixture.detectChanges();

        expect(overlayContainerElement.querySelector('.popover-header').textContent).toEqual(
          '3 / 3'
        );
        expect(overlayContainerElement.querySelector('.popover-text').textContent).toEqual(
          'There is many more options in the examples below'
        );

        tick(2000);
        fixture.detectChanges();

        expect(overlayContainerElement.textContent).toEqual('');
      }));
      it('should proceed to the next step after an individually given time', fakeAsync(() => {
        service.init(
          [
            {
              id: 'first-step',
              content: 'This button has just started your onboarding',
              stepDuration: 1,
            },
            {
              id: 'second-step',
              content:
                'This is just basic example of initial onboarding options and configurations',
              stepDuration: 7,
            },
            { id: 'third-step', content: 'There is many more options in the examples below' },
          ],
          { autoplay: true, stepDuration: 2 }
        );

        service.start();
        tick(1000);
        fixture.detectChanges();

        expect(overlayContainerElement.querySelector('.popover-header').textContent).toEqual(
          '2 / 3'
        );
        expect(overlayContainerElement.querySelector('.popover-text').textContent).toEqual(
          'This is just basic example of initial onboarding options and configurations'
        );

        tick(7000);
        fixture.detectChanges();

        expect(overlayContainerElement.querySelector('.popover-header').textContent).toEqual(
          '3 / 3'
        );
        expect(overlayContainerElement.querySelector('.popover-text').textContent).toEqual(
          'There is many more options in the examples below'
        );

        tick(2000);
        fixture.detectChanges();

        expect(overlayContainerElement.textContent).toEqual('');
      }));

      it('should pause autoplay and resume on click', fakeAsync(() => {
        service.init(
          [
            { id: 'first-step', content: 'This button has just started your onboarding' },
            {
              id: 'second-step',
              content:
                'This is just basic example of initial onboarding options and configurations',
            },
            { id: 'third-step', content: 'There is many more options in the examples below' },
          ],
          { autoplay: true, stepDuration: 2 }
        );

        service.start();
        tick(150);
        fixture.detectChanges();

        expect(overlayContainerElement.querySelector('.popover-header').textContent).toEqual(
          '1 / 3'
        );
        expect(overlayContainerElement.querySelector('.popover-text').textContent).toEqual(
          'This button has just started your onboarding'
        );

        const toggleAutoplayButton = overlayContainerElement.querySelector(
          'button[data-mdb-role="pause-resume"]'
        );
        toggleAutoplayButton.dispatchEvent(new Event('click'));
        tick(2000);
        fixture.detectChanges();

        expect(overlayContainerElement.querySelector('.popover-header').textContent).toEqual(
          '1 / 3'
        );
        expect(overlayContainerElement.querySelector('.popover-text').textContent).toEqual(
          'This button has just started your onboarding'
        );

        toggleAutoplayButton.dispatchEvent(new Event('click'));

        tick(2000);
        fixture.detectChanges();

        expect(overlayContainerElement.querySelector('.popover-header').textContent).toEqual(
          '2 / 3'
        );
        expect(overlayContainerElement.querySelector('.popover-text').textContent).toEqual(
          'This is just basic example of initial onboarding options and configurations'
        );

        flush();
      }));
    });
    describe('backdrop', () => {
      it('should create a canvas if backdrop is set', fakeAsync(() => {
        service.init(
          [
            { id: 'first-step', content: 'This button has just started your onboarding' },
            {
              id: 'second-step',
              content:
                'This is just basic example of initial onboarding options and configurations',
            },
            { id: 'third-step', content: 'There is many more options in the examples below' },
          ],
          { backdrop: true }
        );

        service.start();

        fixture.detectChanges();
        flush();

        const canvasEl = document.querySelector('canvas');
        expect(canvasEl).toBeTruthy();
      }));
    });
    describe('customization', () => {
      it('should set custom labels', fakeAsync(() => {
        service.init(
          [
            { id: 'first-step', content: 'This button has just started your onboarding' },
            {
              id: 'second-step',
              content:
                'This is just basic example of initial onboarding options and configurations',
            },
            {
              id: 'third-step',
              content: 'There is many more options in the examples below',
              prevLabel: 'Get back',
              nextLabel: 'Go on',
              finishLabel: 'Abandon',
            },
          ],
          {
            prevLabel: 'Left',
            nextLabel: 'Right',
            skipLabel: 'End',
          }
        );

        service.start();

        fixture.detectChanges();
        flush();

        expect(overlayContainerElement.querySelector('.prev').textContent).toEqual('Left');
        expect(overlayContainerElement.querySelector('.next').textContent).toEqual('Right');
        expect(overlayContainerElement.querySelector('.end').textContent).toEqual('End');

        service.nextStep();

        fixture.detectChanges();
        flush();

        expect(overlayContainerElement.querySelector('.prev').textContent).toEqual('Left');
        expect(overlayContainerElement.querySelector('.next').textContent).toEqual('Right');
        expect(overlayContainerElement.querySelector('.end').textContent).toEqual('End');

        service.nextStep();

        fixture.detectChanges();
        flush();

        expect(overlayContainerElement.querySelector('.prev').textContent).toEqual('Get back');
        expect(overlayContainerElement.querySelector('.next').textContent).toEqual('Go on');
        expect(overlayContainerElement.querySelector('.end').textContent).toEqual('Abandon');
      }));

      it('should set custom classes', fakeAsync(() => {
        service.init(
          [
            { id: 'first-step', content: 'This button has just started your onboarding' },
            {
              id: 'second-step',
              content:
                'This is just basic example of initial onboarding options and configurations',
            },
            {
              id: 'third-step',
              content: 'There is many more options in the examples below',
              btnPrevClass: 'btn-outline-danger btn-rounded',
              btnNextClass: 'btn-outline-danger btn-rounded',
              btnSkipClass: 'btn-outline-secondary btn-rounded',
              btnFinishClass: 'btn-outline-secondary btn-rounded',
            },
          ],
          {
            btnPrevClass: 'btn-outline-primary btn-rounded',
            btnNextClass: 'btn-outline-primary btn-rounded',
            btnSkipClass: 'btn-outline-warning btn-rounded',
            btnFinishClass: 'btn-outline-warning btn-rounded',
          }
        );

        service.start();

        fixture.detectChanges();
        flush();

        expect(
          overlayContainerElement.querySelector('.prev').classList.contains('btn-outline-primary')
        ).toEqual(true);
        expect(
          overlayContainerElement.querySelector('.next').classList.contains('btn-outline-primary')
        ).toEqual(true);
        expect(
          overlayContainerElement.querySelector('.end').classList.contains('btn-outline-warning')
        ).toEqual(true);

        service.nextStep();

        fixture.detectChanges();
        flush();

        expect(
          overlayContainerElement.querySelector('.prev').classList.contains('btn-outline-primary')
        ).toEqual(true);
        expect(
          overlayContainerElement.querySelector('.next').classList.contains('btn-outline-primary')
        ).toEqual(true);
        expect(
          overlayContainerElement.querySelector('.end').classList.contains('btn-outline-warning')
        ).toEqual(true);

        service.nextStep();

        fixture.detectChanges();
        flush();

        expect(
          overlayContainerElement.querySelector('.prev').classList.contains('btn-outline-danger')
        ).toEqual(true);
        expect(
          overlayContainerElement.querySelector('.next').classList.contains('btn-outline-danger')
        ).toEqual(true);
        expect(
          overlayContainerElement.querySelector('.end').classList.contains('btn-outline-secondary')
        ).toEqual(true);
      }));
    });
  });
});

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'mdb-test-onboarding',
  template: `
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-3 text-center">
          <button
            class="btn btn-danger"
            (click)="handleClick()"
            [mdbOnboardingAnchor]="'first-step'"
          >
            Start onboarding
          </button>
        </div>
      </div>
      <hr />
      <div class="row d-flex justify-content-center">
        <!-- Card Regular -->
        <div class="col-md-4">
          <div class="card">
            <!-- Card image -->
            <img
              [mdbOnboardingAnchor]="'second-step'"
              class="card-img-top"
              src="https://mdbcdn.b-cdn.net/img/Photos/Others/men.webp"
              alt="Man in Cap and Glasses"
            />
            <a>
              <div class="mask rgba-white-slight"></div>
            </a>
            <!-- Card content -->
            <div class="card-body text-center">
              <!-- Title -->
              <h4 class="card-title">
                <strong>John Doe</strong>
              </h4>
              <!-- Subtitle -->
              <h6 class="fw-bold indigo-text py-2">Web developer</h6>
              <!-- Text -->
              <p [mdbOnboardingAnchor]="'third-step'" class="card-text">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus, ex,
                recusandae. Facere modi sunt, quod quibusdam.
              </p>

              <div class="d-flex justify-content-evenly">
                <!-- Facebook -->
                <a href="#!" role="button">
                  <i class="fab fa-facebook-f fa-lg"></i>
                </a>
                <!-- Twitter -->
                <a href="#!" role="button">
                  <i class="fab fa-twitter fa-lg"></i>
                </a>
                <!-- Google + -->
                <a href="#!" role="button">
                  <i class="fab fa-dribbble fa-lg"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
        <!-- Card Regular -->
      </div>
    </div>
  `,
})
class TestOnboardingComponent {
  constructor() {
    window.HTMLElement.prototype.scrollIntoView = function () {};
  }
}

function createKeyboardEvent(type: string, keyCode: number, key?: string): KeyboardEvent {
  const event = new KeyboardEvent(type);

  Object.defineProperty(event, 'keyCode', {
    get: () => keyCode,
  });

  Object.defineProperty(event, 'key', {
    get: () => key,
  });

  return event;
}
