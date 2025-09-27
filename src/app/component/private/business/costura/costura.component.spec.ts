import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CosturaComponent } from './costura.component';

describe('CosturaComponent', () => {
  let component: CosturaComponent;
  let fixture: ComponentFixture<CosturaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CosturaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CosturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
