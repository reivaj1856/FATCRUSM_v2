import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BordadosComponent } from './bordados.component';

describe('BordadosComponent', () => {
  let component: BordadosComponent;
  let fixture: ComponentFixture<BordadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BordadosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BordadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
