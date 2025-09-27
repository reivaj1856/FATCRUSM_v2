import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BordadoComponent } from './bordado.component';

describe('BordadoComponent', () => {
  let component: BordadoComponent;
  let fixture: ComponentFixture<BordadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BordadoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BordadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
