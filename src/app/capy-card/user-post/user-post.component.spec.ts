import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPostComponent } from './user-post.component';

describe('UserPostComponent', () => {
  let component: UserPostComponent;
  let fixture: ComponentFixture<UserPostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserPostComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
