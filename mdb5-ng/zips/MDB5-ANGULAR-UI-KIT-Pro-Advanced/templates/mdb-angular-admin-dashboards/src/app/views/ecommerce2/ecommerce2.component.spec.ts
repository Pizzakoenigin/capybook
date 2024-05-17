import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ecommerce2Component } from './ecommerce2.component';

describe('Eccomerce2Component', () => {
  let component: Ecommerce2Component;
  let fixture: ComponentFixture<Ecommerce2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Ecommerce2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Ecommerce2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
