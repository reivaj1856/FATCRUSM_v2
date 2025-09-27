import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViniladoComponent } from './vinilado.component';

describe('ViniladoComponent', () => {
  let component: ViniladoComponent;
  let fixture: ComponentFixture<ViniladoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViniladoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViniladoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
