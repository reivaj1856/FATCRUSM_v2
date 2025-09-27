import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SublimacionComponent } from './sublimacion.component';

describe('SublimacionComponent', () => {
  let component: SublimacionComponent;
  let fixture: ComponentFixture<SublimacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SublimacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SublimacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
