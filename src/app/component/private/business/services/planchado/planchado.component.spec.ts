import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanchadoComponent } from './planchado.component';

describe('PlanchadoComponent', () => {
  let component: PlanchadoComponent;
  let fixture: ComponentFixture<PlanchadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanchadoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanchadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
