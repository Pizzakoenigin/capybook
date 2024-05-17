import { TestBed } from '@angular/core/testing';

import { MdbScrollStatusService } from './scroll-status.service';

describe('MdbAngularScrollStatusService', () => {
  let service: MdbScrollStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MdbScrollStatusService],
    });
    service = TestBed.inject(MdbScrollStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a proper scrollPercentage value for container', (done) => {
    const container = document.createElement('div');
    container.scrollTop = 90;
    Object.defineProperty(container, 'clientHeight', { value: '100', writable: true });
    Object.defineProperty(container, 'scrollHeight', { value: '400', writable: true });

    let expectedScrollPercentage = 30;

    service.getScrollPercentage(container).subscribe((value) => {
      expect(value).toEqual(expectedScrollPercentage);
      done();
    });
    container.dispatchEvent(new CustomEvent('scroll'));
  });

  it('should return a proper scrollPercentage value for document', (done) => {
    document.documentElement.scrollTop = 528;
    window.innerHeight = 1080;
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      value: '3000',
      writable: true,
    });

    let expectedScrollPercentage = 27.5;

    service.getScrollPercentage().subscribe((value) => {
      expect(value).toBeCloseTo(expectedScrollPercentage);
      done();
    });
    window.dispatchEvent(new CustomEvent('scroll'));
  });

  it('should return a proper scrollPercentage value for window', (done) => {
    window.scrollY = 900;
    window.innerHeight = 1100;
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      value: '3500',
      writable: true,
    });

    let expectedScrollPercentage = 37.5;

    service.getScrollPercentage().subscribe((value) => {
      expect(value).toBeCloseTo(expectedScrollPercentage);
      done();
    });
    window.dispatchEvent(new CustomEvent('scroll'));
  });
});
