import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ecommerce1Component } from './ecommerce1.component';

describe('EcommerceComponent', () => {
  let component: Ecommerce1Component;
  let fixture: ComponentFixture<Ecommerce1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Ecommerce1Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Ecommerce1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
