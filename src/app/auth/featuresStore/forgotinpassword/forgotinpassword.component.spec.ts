import { ComponentFixture, TestBed } from '@angular/core/testing';

import ForgotinpasswordComponent from './forgotinpassword.component';

describe('ForgotinpasswordComponent', () => {
  let component: ForgotinpasswordComponent;
  let fixture: ComponentFixture<ForgotinpasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForgotinpasswordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForgotinpasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
