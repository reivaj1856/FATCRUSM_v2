import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstimadoComponent } from './estimado.component';

describe('EstimadoComponent', () => {
  let component: EstimadoComponent;
  let fixture: ComponentFixture<EstimadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstimadoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstimadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
