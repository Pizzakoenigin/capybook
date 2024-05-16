import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CapyCardComponent } from './capy-card.component';

describe('CapyCardComponent', () => {
  let component: CapyCardComponent;
  let fixture: ComponentFixture<CapyCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CapyCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CapyCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
